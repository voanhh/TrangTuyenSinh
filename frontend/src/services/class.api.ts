import { apiClient } from './apiClient';

export interface Enrollment {
    id: number;
    classId: number;
    userId: number;
    enrolledAt: string;
    status: string;

    class: {
        id: number;
        className: string;
        courseId: number;
        teacherId: number;
        startDate: string;
        endDate: string;
        maxStudents: number;
        status: "upcoming" | "ongoing" | "completed";

        course: {
            id: number;
            title: string;
            shortDesc: string;
            imageUrl: string;
            duration: string;
            format: string;
        };

        teacher: {
            id: number;
            fullName: string;
            avatarUrl: string;
        };
    };
}

export const classApi = {
    getMyClasses : async (): Promise<Enrollment[]> => {
        const response = await apiClient.get('/class-enrollments/myclasses');
        return response.data.data;
    },

    getClassSchedule: async (classId: number): Promise<any> => {
        const response = await apiClient.get(`/schedules?classId=${classId}`);
        return response.data.data;
    }
}