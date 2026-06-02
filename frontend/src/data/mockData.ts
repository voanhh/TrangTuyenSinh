// src/data/mockData.ts

export interface Course {
    id: number;
    title: string;
    image: string;
    shortDesc: string;
    duration: string;
    format: string;
    price: string;
    teacher: {
        name: string;
        title: string;
        experience: string;
        company: string;
    };
    syllabus: string[];
}

export const coursesData: Course[] = [
    {
        id: 1,
        title: "Frontend ReactJS Masterclass",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
        shortDesc: "Làm chủ ReactJS từ cơ bản đến nâng cao, xây dựng ứng dụng thực tế với Redux, TypeScript và NextJS.",
        duration: "12 Tuần",
        format: "Online qua Zoom + Video xem lại",
        price: "4.500.000 VNĐ",
        teacher: {
            name: "Nguyễn Văn A",
            title: "Senior Frontend Engineer",
            experience: "8 năm kinh nghiệm",
            company: "Shopee VN"
        },
        syllabus: ["Chương 1: React Cơ bản & Hooks", "Chương 2: State Management với Redux Toolkit", "Chương 3: React Router & API Integration", "Chương 4: TypeScript trong React", "Chương 5: Đồ án cuối khóa"]
    },
    {
        id: 2,
        title: "Backend NodeJS & Microservices",
        image: "https://images.unsplash.com/photo-1627398225081-000801106d91?auto=format&fit=crop&w=800&q=80",
        shortDesc: "Xây dựng hệ thống Backend mạnh mẽ, có khả năng mở rộng cao với NodeJS, Express, MongoDB và Docker.",
        duration: "14 Tuần",
        format: "Hybrid (Online + Offline)",
        price: "5.200.000 VNĐ",
        teacher: {
            name: "Trần Thị B",
            title: "Software Architect",
            experience: "10 năm kinh nghiệm",
            company: "VNG Corporation"
        },
        syllabus: ["Chương 1: NodeJS & Express Foundation", "Chương 2: Database Design (MongoDB/PostgreSQL)", "Chương 3: Authentication & Security", "Chương 4: Docker & Deployment", "Chương 5: Microservices Architecture"]
    },
    {
        id: 3,
        title: "UI/UX Design Tương Tác",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
        shortDesc: "Từ tư duy thiết kế đến thực hành với Figma. Tạo ra các sản phẩm số có trải nghiệm người dùng tối ưu.",
        duration: "10 Tuần",
        format: "Online linh hoạt",
        price: "3.800.000 VNĐ",
        teacher: {
            name: "Lê Hoàng C",
            title: "Lead Product Designer",
            experience: "6 năm kinh nghiệm",
            company: "MoMo"
        },
        syllabus: ["Chương 1: Nguyên lý UI/UX", "Chương 2: User Research & Persona", "Chương 3: Wireframe & Prototyping", "Chương 4: Master Figma & Design System", "Chương 5: Portfolio Review"]
    }
];

export const teachersData = [
    { id: 1, name: "Nguyễn Văn A", role: "Senior Frontend", exp: "8 năm", company: "Shopee VN", avatar: "https://i.pravatar.cc/150?img=11", bio: "Chuyên gia về React và tối ưu hóa hiệu suất web." },
    { id: 2, name: "Trần Thị B", role: "Software Architect", exp: "10 năm", company: "VNG", avatar: "https://i.pravatar.cc/150?img=5", bio: "Đam mê xây dựng hệ thống phân tán và bảo mật." },
    { id: 3, name: "Lê Hoàng C", role: "Product Designer", exp: "6 năm", company: "MoMo", avatar: "https://i.pravatar.cc/150?img=8", bio: "Tin rằng thiết kế tốt là thiết kế giải quyết được vấn đề." }
];

export const reviewsData = [
    { id: 1, name: "Phạm D", job: "Junior Developer", avatar: "https://i.pravatar.cc/150?img=12", content: "Khóa học React thực sự chất lượng, mentor hỗ trợ 1-1 rất nhiệt tình. Tôi đã tìm được việc ngay sau khóa học." },
    { id: 2, name: "Hoàng E", job: "Sinh viên IT", avatar: "https://i.pravatar.cc/150?img=33", content: "Giáo trình sát với thực tế doanh nghiệp. Phần Docker và Microservices được giải thích cực kỳ dễ hiểu." },
    { id: 3, name: "Đặng F", job: "Graphic Designer", avatar: "https://i.pravatar.cc/150?img=20", content: "Chuyển ngành sang UI/UX không còn là ác mộng nhờ có khóa học này. Rất đáng tiền!" }
];