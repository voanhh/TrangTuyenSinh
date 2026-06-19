import { AppDataSource } from "../models/DataSource";
import { Course, CourseStatus } from "../models/entities/Course";
import { v4 as uuidv4 } from 'uuid'; // Thư viện tạo chuỗi ID ngẫu nhiên

export class CourseServiceGV {
    private static courseRepository = AppDataSource.getRepository(Course);

    // =========================================================
    // PHẦN 1: DÀNH CHO HỌC VIÊN (HIỂN THỊ CÔNG KHAI)
    // =========================================================

    // Lấy chi tiết khóa học cho học viên (Chỉ lấy bản PUBLISHED)
    static async getCourseById(courseGroupId: string) {
        return this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.registrations', 'registrations')
            .leftJoinAndSelect('course.syllabus', 'syllabus')
            .where('course.course_group_id = :courseGroupId', { courseGroupId })
            .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
            .orderBy('syllabus.orderIndex', 'ASC')
            .getOne();
    }

    // =========================================================
    // PHẦN 2: DÀNH CHO GIẢNG VIÊN (QUẢN LÝ DRAFT & PUBLISH)
    // =========================================================

    // 1. Lấy danh sách khóa học của Giảng viên (Hiển thị ở màn hình Dashboard)
    static async getLecturerCourses(teacherId: number) {
        // Lấy tất cả khóa học của GV này, order mới nhất
        const allCourses = await this.courseRepository.find({
            where: { teacherId },
            order: { createdAt: 'DESC' }
        });
        
        // (Logic gộp nhóm courseGroupId giống hệt file Courses.jsx của FE)
        // BE có thể trả về hết, FE sẽ tự gộp, hoặc BE gộp luôn tại đây cho nhẹ tải
        return allCourses; 
    }

    // 2. Khởi tạo một Bản nháp mới (Khi GV bấm "+ Thêm khóa học mới")
    static async createDraft(title: string, teacherId: number) {
        const newCourse = new Course();
        newCourse.courseGroupId = uuidv4(); // Cấp 1 thẻ ID chung cho cả gia đình khóa học này
        newCourse.title = title;
        newCourse.teacherId = teacherId;
        newCourse.status = CourseStatus.DRAFT;
        newCourse.courseData = []; // Khởi tạo mảng JSON rỗng cho UI Builder
        newCourse.blocks = {};     // Khởi tạo Object rỗng chứa Video/Text
        newCourse.price = 0;

        return this.courseRepository.save(newCourse);
    }

    // 3. Lấy dữ liệu Bản nháp để đổ vào giao diện Builder (Kéo thả)
    static async getDraft(courseGroupId: string, teacherId: number) {
        const draft = await this.courseRepository.findOne({
            where: { courseGroupId, status: CourseStatus.DRAFT, teacherId }
        });

        if (!draft) throw new Error('Không tìm thấy bản nháp hoặc bạn không có quyền!');
        return draft;
    }

    // 4. Lưu Bản nháp (Khi GV thao tác kéo thả và bấm "Lưu thông tin")
    static async updateDraft(courseGroupId: string, teacherId: number, courseDataInput: any) {
        const draft = await this.getDraft(courseGroupId, teacherId);

        // Chỉ cập nhật những trường mà FE gửi lên (UI Builder)
        draft.title = courseDataInput.title ?? draft.title;
        draft.shortDesc = courseDataInput.shortDesc ?? draft.shortDesc;
        draft.target = courseDataInput.target ?? draft.target;
        draft.imageUrl = courseDataInput.thumbnail ?? draft.imageUrl; // Thumbnail
        draft.category = courseDataInput.category ?? draft.category;
        draft.price = courseDataInput.price ?? draft.price;
        
        // Cập nhật cấu trúc Kéo thả Builder (JSON)
        draft.courseData = courseDataInput.courseData ?? draft.courseData;
        draft.blocks = courseDataInput.blocks ?? draft.blocks;

        return this.courseRepository.save(draft);
    }

    // 5. Xuất bản khóa học (Khi GV bấm nút "Xuất bản")
    static async publishCourse(courseGroupId: string, teacherId: number) {
        // Tìm bản Nháp hiện tại
        const draft = await this.getDraft(courseGroupId, teacherId);

        // Báo cho DB biết: "Hãy cất bản PUBLISHED cũ (nếu có) vào kho ARCHIVED"
        await this.courseRepository.update(
            { courseGroupId, status: CourseStatus.PUBLISHED, teacherId },
            { status: CourseStatus.ARCHIVED }
        );

        // Clone bản Nháp thành bản PUBLISHED mới
        const publishedCourse = new Course();
        Object.assign(publishedCourse, draft); // Copy mọi data từ Draft
        
        publishedCourse.id = undefined; // Bỏ ID của bản Draft để DB tự sinh ID mới
        publishedCourse.status = CourseStatus.PUBLISHED;

        // Tương lai: Tại bước này, bạn có thể gọi thêm 1 hàm đọc dữ liệu từ publishedCourse.courseData (JSON)
        // và tự động INSERT vào bảng `CourseSyllabus` để phục vụ học viên dễ dàng hơn.

        return this.courseRepository.save(publishedCourse);
    }
}