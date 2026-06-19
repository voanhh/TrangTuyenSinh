import { create } from 'zustand';
import { CourseAPI } from '../../../services/courseApi';
import Swal from 'sweetalert2';

interface CourseState {
  courseDetails: any;
  courseData: any[]; // Chứa Units và Lessons
  blocksByLesson: any; // Chứa nội dung (Video, text, quiz)
  activeLesson: any | null;
  isLoading: boolean;
  
  // Actions
  fetchDraftData: (courseId: string) => Promise<void>;
  saveDraft: (courseId: string) => Promise<void>;
  setActiveLesson: (lesson: any) => void;
  // ... các hàm addUnit, addLesson tương tự bài cũ nhưng chuyển hết vào đây
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courseDetails: { title: '', description: '', price: 0, thumbnail: '' },
  courseData: [],
  blocksByLesson: {},
  activeLesson: null,
  isLoading: false,

  fetchDraftData: async (courseId) => {
    set({ isLoading: true });
    try {
      const response = await CourseAPI.getDraft(courseId);
      const data = response.data.data;
      set({ 
        courseDetails: { title: data.title, description: data.description, price: data.price },
        courseData: data.courseData || [],
        blocksByLesson: data.blocks || {},
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveDraft: async (courseId) => {
    const state = get();
    Swal.fire({ title: 'Đang lưu...', didOpen: () => Swal.showLoading() });
    try {
      await CourseAPI.updateDraft(courseId, {
        ...state.courseDetails,
        courseData: state.courseData,
        blocks: state.blocksByLesson
      });
      Swal.fire('Thành công', 'Đã lưu bản nháp', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể lưu', 'error');
    }
  },
  
  setActiveLesson: (lesson) => set({ activeLesson: lesson })
}));