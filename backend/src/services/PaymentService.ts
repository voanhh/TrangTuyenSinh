import { PayOS } from '@payos/node';
import { AppDataSource } from '../models/DataSource';
import { Course, CourseStatus } from '../models/entities/Course';
import { Order, OrderStatus, PaymentMethod } from '../models/entities/Payment';
import { Registration, RegistrationStatus } from '../models/entities/Registration';
import { User } from '../models/entities/User';
import { getMissingEnvKeys } from '../config/env';

export class PaymentService {
    private static userRepository = AppDataSource.getRepository(User);
    private static courseRepository = AppDataSource.getRepository(Course);
    private static orderRepository = AppDataSource.getRepository(Order);
    private static registrationRepository = AppDataSource.getRepository(Registration);

    private static get frontendUrl() {
        return process.env.FRONTEND_URL || 'http://localhost:5173';
    }

    private static get payos() {
        console.log('[DEBUG] PAYOS_CLIENT_ID:', JSON.stringify(process.env.PAYOS_CLIENT_ID));
        console.log('[DEBUG] PAYOS_API_KEY:', JSON.stringify(process.env.PAYOS_API_KEY));
        console.log('[DEBUG] PAYOS_CHECKSUM_KEY:', JSON.stringify(process.env.PAYOS_CHECKSUM_KEY));

        const clientId = process.env.PAYOS_CLIENT_ID;
        const apiKey = process.env.PAYOS_API_KEY;
        const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
        const missingKeys = getMissingEnvKeys(['PAYOS_CLIENT_ID', 'PAYOS_API_KEY', 'PAYOS_CHECKSUM_KEY']);

        if (missingKeys.length > 0) {
            throw new Error(`Server chưa cấu hình ${missingKeys.join(' / ')}`);
        }
        if (!clientId || !apiKey || !checksumKey) {
            throw new Error('Server chưa cấu hình PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY');
        }

        return new PayOS({ clientId, apiKey, checksumKey });
    }

    private static async generateUniqueOrderCode(): Promise<string> {
        while (true) {
            const orderCode = `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            const exists = await this.orderRepository.findOneBy({ orderCode });
            if (!exists) {
                return orderCode;
            }
        }
    }

    private static getCourseAmount(course: Course): number {
        const rawAmount = Number(course.discountPrice ?? course.price ?? 0);
        if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
            throw new Error('Khóa học chưa có giá hợp lệ để thanh toán');
        }
        return Math.round(rawAmount);
    }

    private static getCoursePaymentDescription(courseId: number): string {
        return `THANH TOAN KHOA HOC ${courseId}`.slice(0, 25);
    }

    static async createCoursePaymentLink(userId: number, courseId: number) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        const course = await this.courseRepository.findOneBy({
            id: courseId,
            status: CourseStatus.PUBLISHED,
        });

        if (!course) {
            throw new Error('Khóa học không tồn tại hoặc chưa được xuất bản');
        }

        const existingPaid = await this.orderRepository.findOne({
            where: { userId, courseId, status: OrderStatus.PAID },
        });
        if (existingPaid) {
            throw new Error('Bạn đã thanh toán khóa học này');
        }

        const now = new Date();
        const existingPending = await this.orderRepository.findOne({
            where: { userId, courseId, status: OrderStatus.PENDING },
            order: { createdAt: 'DESC' },
        });
        if (
            existingPending &&
            existingPending.checkoutUrl &&
            existingPending.qrCodeUrl &&
            existingPending.paymentLinkExpiresAt &&
            existingPending.paymentLinkExpiresAt > now
        ) {
            return existingPending;
        }

        const amount = this.getCourseAmount(course);
        const orderCode = await this.generateUniqueOrderCode();

        const payosResponse = await this.payos.paymentRequests.create({
            orderCode: Number(orderCode),
            amount,
            description: this.getCoursePaymentDescription(course.id),
            returnUrl: `${this.frontendUrl}/khoa-hoc/${course.id}?payment=success`,
            cancelUrl: `${this.frontendUrl}/khoa-hoc/${course.id}?payment=cancel`,
        });

        const newOrder = new Order();
        newOrder.orderCode = orderCode;
        newOrder.userId = userId;
        newOrder.courseId = courseId;
        newOrder.amount = amount;
        newOrder.status = OrderStatus.PENDING;
        newOrder.checkoutUrl = payosResponse.checkoutUrl || '';
        newOrder.qrCodeUrl = payosResponse.qrCode || '';
        if (payosResponse.expiredAt) {
            newOrder.paymentLinkExpiresAt = new Date(payosResponse.expiredAt * 1000);
        }

        return this.orderRepository.save(newOrder);
    }

    static async getOrderByCode(orderCode: string, userId: number, role: string) {
        const order = await this.orderRepository.findOne({
            where: { orderCode },
            relations: { course: true, user: true },
        });

        if (!order) {
            throw new Error('Không tìm thấy đơn hàng');
        }

        if (role !== 'admin' && order.userId !== userId) {
            throw new Error('Bạn không có quyền xem đơn hàng này');
        }

        return order;
    }

    static async confirmPaymentAutomatically(orderCode: string, payosTransactionId?: string, paymentNote?: string) {
        const order = await this.orderRepository.findOne({
            where: { orderCode },
            relations: { user: true, course: true },
        });

        if (!order) {
            throw new Error('Không tìm thấy đơn hàng để xác nhận');
        }

        if (order.status === OrderStatus.PAID) {
            return order;
        }

        order.status = OrderStatus.PAID;
        order.paymentMethod = PaymentMethod.PAYOS_AUTO;
        order.payosTransactionId = payosTransactionId || order.payosTransactionId;
        order.paymentNote = paymentNote || order.paymentNote;

        await this.orderRepository.save(order);

        const existingRegistration = await this.registrationRepository.findOne({
            where: {
                userId: order.userId,
                courseId: order.courseId,
            },
        });

        if (!existingRegistration) {
            const registration = this.registrationRepository.create({
                userId: order.userId,
                courseId: order.courseId,
                contactName: order.user.fullName,
                contactEmail: order.user.email,
                contactPhone: order.user.phone || '',
                note: `Đăng ký tự động sau khi thanh toán PayOS. Mã đơn: ${order.orderCode}`,
                status: RegistrationStatus.CONFIRMED,
                handledBy: 'system_payos',
                contactedAt: new Date(),
            });
            await this.registrationRepository.save(registration);
        } else if (existingRegistration.status !== RegistrationStatus.CONFIRMED) {
            existingRegistration.status = RegistrationStatus.CONFIRMED;
            existingRegistration.contactedAt = new Date();
            existingRegistration.handledBy = 'system_payos';
            await this.registrationRepository.save(existingRegistration);
        }

        return order;
    }

    static async markOrderFailed(orderCode: string, paymentNote?: string) {
        const order = await this.orderRepository.findOne({
            where: { orderCode },
        });
        if (!order || order.status === OrderStatus.PAID) {
            return order;
        }

        order.status = OrderStatus.FAILED;
        order.paymentNote = paymentNote || order.paymentNote;
        return this.orderRepository.save(order);
    }

    static async handlePayOSWebhook(payload: unknown) {
        const webhookData = await this.payos.webhooks.verify(payload as any);

        const orderCode = String(webhookData.orderCode);
        const paymentStatusCode = webhookData.code;
        const note = webhookData.desc || null;
        const transactionId = webhookData.reference || webhookData.paymentLinkId;

        if (paymentStatusCode === '00') {
            await this.confirmPaymentAutomatically(orderCode, transactionId, note || undefined);
        } else {
            await this.markOrderFailed(orderCode, note || undefined);
        }

        return webhookData;
    }
}