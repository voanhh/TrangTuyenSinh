import React from 'react';
import { useCourseStore } from '../store/useCourseStore';

export default function CourseSettings() {
  const { courseDetails } = useCourseStore();
  // Giả sử có logic setCourseDetails trong store

  return (
    <div className="flex-1 p-5 space-y-6 bg-white overflow-y-auto border-l border-blue-100">
      <h3 className="text-lg font-bold text-blue-900 mb-4">Thiết lập khóa học</h3>
      
      <div>
        <label className="block mb-2 text-sm font-bold text-slate-600">Tên khóa học</label>
        <input 
          type="text" 
          value={courseDetails.title}
          className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all" 
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-bold text-slate-600">Giá (VNĐ)</label>
        <input
          type="number"
          value={courseDetails.price}
          className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          placeholder="VD: 500000 — để trống nếu miễn phí"
        />
      </div>

      <div className="pt-4">
        <button 
          // onClick={() => saveDraft(courseId)}
          className="w-full py-3.5 font-bold text-white transition-all bg-orange-500 rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-[0.98]"
        >
          LƯU THÔNG TIN
        </button>
      </div>
    </div>
  );
}