import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';

export default function CourseSettings() {
  const navigate = useNavigate();
  const params = useParams<any>();

  const courseId = params.id || params.courseId;

  const courseDetails = useCourseStore((state) => state.courseDetails);
  const updateCourseDetails = useCourseStore((state) => state.updateCourseDetails);
  const fetchDraftData = useCourseStore((state) => state.fetchDraftData);
  const saveDraft = useCourseStore((state) => state.saveDraft);

  // Tự động lấy dữ liệu cũ (bao gồm courseData/blocks) đổ vào store khi vào trang Sửa
  useEffect(() => {
    if (courseId) {
      fetchDraftData(courseId);
    }
  }, [courseId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateCourseDetails({ [name]: name === 'price' ? Number(value) : value });
  };

  const handleSave = async () => {
    if (!courseId) {
      alert('Không tìm thấy ID của khóa học để thực hiện lưu!');
      return;
    }
    await saveDraft(courseId);
    navigate('/instructor/courses');
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-blue-100">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-blue-900">Thiết lập khóa học</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div>
          <label className="block mb-2 text-sm font-bold text-slate-600">Tên khóa học</label>
          <input
            type="text" name="title" value={courseDetails.title} onChange={handleChange}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-bold text-slate-600">Mô tả ngắn</label>
          <textarea
            name="shortDesc" value={courseDetails.shortDesc} onChange={handleChange} rows={1}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-bold text-slate-600">URL Hình ảnh bìa</label>
          <input
            type="text" name="imageUrl" value={courseDetails.imageUrl} onChange={handleChange}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-bold text-slate-600">Mục tiêu khóa học</label>
          <textarea
            name="target" value={courseDetails.target} onChange={handleChange} rows={1}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-bold text-slate-600">Định dạng học</label>
          <select
            name="format" value={courseDetails.format} onChange={handleChange}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-bold text-slate-600">Giá (VNĐ)</label>
          <input
            type="number" name="price" value={courseDetails.price} onChange={handleChange}
            className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleSave}
          className="w-full bg-[#E5664B] hover:bg-[#d4553b] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          Lưu thông tin
        </button>
      </div>
    </div>
  );
}