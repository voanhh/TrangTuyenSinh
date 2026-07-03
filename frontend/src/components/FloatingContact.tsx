import React, { useState } from 'react';
import fbIcon from '../assets/Facebook_icon.webp';
import zaloIcon from '../assets/Icon_Zalo.webp';

const FloatingContact: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleToggleModal = (): void => {
    setIsOpenModal(!isOpenModal);
  };

  return (
    <>
        <style>
        {`
          /* Hiệu ứng 1: Nút tự động to nhỏ liên tục */
          @keyframes breath-scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); } /* Kích thước phình to ra 15% */
          }
          
          /* Hiệu ứng 2: Vòng tròn trắng viền ngoài cùng to nhỏ theo */
          @keyframes ring-scale {
            0%, 100% { 
              transform: scale(1.1); /* To hơn nút một chút để lộ viền */
              border: 3px solid rgba(255, 255, 255, 0.9);
            }
            50% { 
              transform: scale(1.4); /* Phình to ra cùng nhịp với nút */
              border: 3px solid rgba(255, 255, 255, 0.3); /* Mờ dần khi to ra */
            }
          }

          .animate-breath {
            animation: breath-scale 2s infinite ease-in-out;
          }
          
          .animate-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: transparent;
            animation: ring-scale 2s infinite ease-in-out;
            pointer-events: none; /* Để viền không cản trở việc click chuột vào nút */
          }

          .delay-500 {
            animation-delay: 0.5s;
          }
        `}
      </style>

      {/* 3. Container bọc 2 nút cố định */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-6 z-50">
        
        {/* ===================== NÚT BẤM ZALO ===================== */}
        <div className="relative flex items-center justify-center w-11 h-11 animate-breath">
  
          
          {/* Logo Zalo */}
          <button 
            onClick={handleToggleModal}
            className="relative z-10 w-full h-full rounded-full overflow-hidden hover:scale-110 transition-transform shadow-xl focus:outline-none cursor-pointer"
            title="Thông tin Trí Anh Education"
          >
            <img 
              src={zaloIcon} 
              alt="Zalo Icon" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* ===================== NÚT BẤM FACEBOOK ===================== */}
        <div className="relative flex items-center justify-center w-11 h-11 animate-breath">
          {/* Hiệu ứng vòng tròn trắng tỏa ra (Trễ 0.5s để lệch nhịp với Zalo) */}
          <div className="absolute w-full h-full bg-white rounded-full animate-ripple delay-500"></div>

          {/* Logo Facebook */}
          <a 
            href="https://www.facebook.com/caulacbo.trianh/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 w-full h-full rounded-full overflow-hidden hover:scale-110 transition-transform shadow-xl block cursor-pointer"
            title="Facebook Trí Anh Education"
          >
            <img 
              src={fbIcon} 
              alt="Facebook Icon" 
              className="w-full h-full object-cover"
            />
          </a>
        </div>

      </div>

      {/* ===================== GIAO DIỆN HIỂN THỊ HÌNH ẢNH & THÔNG TIN (MODAL) ===================== */}
      {isOpenModal && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleToggleModal} // Bấm ra ngoài vùng trắng để đóng modal nhanh
        >
          {/* Khung nội dung trắng */}
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện đóng modal khi nhấn vào bên trong khung trắng
          >
            {/* Nút Đóng (X) */}
            <button 
              onClick={handleToggleModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold focus:outline-none cursor-pointer"
            >
              ✕
            </button>

            {/* Chi tiết thông tin công ty */}
            <div className="text-center">
              <h3 className="font-bold text-blue-600 text-2xl mb-1">
                Trí Anh Education
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Đồng hành cùng tương lai
              </p>

              {/* Vùng hiển thị Hình ảnh / Mã QR của bạn */}
              <div className="bg-gray-50 p-4 rounded-xl inline-block mb-3 border border-gray-100">
                <img 
                  src="/assets/trianh-zalo-qr.png" // LƯU Ý: Thay đường dẫn này bằng file ảnh thực tế trong thư mục dự án của bạn (vd: public hoặc src/assets)
                  alt="Zalo QR Trí Anh Education" 
                  className="w-52 h-52 object-contain mx-auto rounded-lg shadow-sm"
                  onError={(e) => {
                    // Cơ chế fallback phòng trường hợp chưa cấu hình đúng đường dẫn ảnh
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/220?text=Tr%C3%AD+Anh+Education+QR";
                  }}
                />
              </div>

              <p className="text-xs text-gray-400 mb-5 px-2 leading-relaxed">
                Quét mã QR bằng ứng dụng Zalo trên điện thoại để nhận tư vấn trực tiếp.
              </p>

              {/* Các đường dẫn tương tác (Clickable) */}
              <div className="flex flex-col gap-2.5 text-left border-t pt-4">
                {/* Số điện thoại (Bấm để thực hiện cuộc gọi) */}
                <a 
                  href="tel:0123456789" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-800 hover:text-blue-600 transition-all text-sm font-semibold"
                >
                  <span className="text-lg">📞</span> Hotline: 0123 456 789
                </a>
                
                {/* Website (Bấm để nhảy sang trang web của công ty) */}
                <a 
                  href="https://trianh.edu.vn" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-all text-sm font-semibold"
                >
                  <span className="text-lg">🌐</span> Website: trianh.edu.vn
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FloatingContact;