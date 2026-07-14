import { AppDataSource } from '../models/DataSource';
import { User } from '../models/entities/User';

export class UserService {
    private static userRepository = AppDataSource.getRepository(User);

    static async getAllUser() {
        return this.userRepository.find({
            relations: {registrations: true},
        });
    }

    static async getUserById(id: number) {
        return this.userRepository.findOne({
            where: { id },
            relations: {registrations: true},
        });
    }

    static async deleteUser(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.remove(user);
    }

    // cập nhật tên, sdt, avatarUrl của User
    static async updateProfile(userId: number, data: { fullName?: string; avatarUrl?: string; phone?: string }) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        // Chỉ cập nhật field được gửi lên
        user.fullName = data.fullName ?? user.fullName;
        user.avatarUrl = data.avatarUrl ?? user.avatarUrl;
        user.phone = data.phone ?? user.phone;

        await this.userRepository.save(user);

        // Trả về đúng field cần thiết cho FE
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            role: user.role,
        };
    }
}