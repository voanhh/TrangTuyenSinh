import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Camera, Save, ShieldAlert, Mail, Phone, FileText, Loader2 } from 'lucide-react';
import { uploadApi } from '../../services/upload.api';
import { userApi } from '../../services/user.api';
import { emitUserUpdated } from '../../utils/authEvents';

const StudentSetting: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        avatar: 'https://ui-avatars.com/api/?name=User&background=E5664B&color=fff'
    });

    // File ảnh mới người dùng chọn (chưa upload), và preview tạm thời
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setProfileData(prev => ({
                ...prev,
                name: parsedUser.fullName || parsedUser.name || 'Học viên',
                email: parsedUser.email || '',
                phone: parsedUser.phone || '',
                avatar: parsedUser.avatarUrl || `https://ui-avatars.com/api/?name=${parsedUser.fullName || 'User'}&background=E5664B&color=fff`
            }));
        }
    }, []);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    // chọn ảnh mới, chưa upload lên Cloudinary
    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Ảnh vượt quá 2MB, vui lòng chọn ảnh khác.');
            return;
        }

        setSelectedFile(file);
        setProfileData(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let avatarUrl = profileData.avatar;

            // Chỉ upload lên Cloudinary khi thực sự có ảnh mới được chọn
            //
            if (selectedFile) {
                avatarUrl = await uploadApi.uploadAvatar(selectedFile);
            }

            const updatedUser = await userApi.updateProfile({
                fullName: profileData.name,
                avatarUrl,
                phone: profileData.phone,
            });

            emitUserUpdated(updatedUser);
            setSelectedFile(null);
            alert('Đã cập nhật hồ sơ cá nhân thành công!');
        } catch (error: any) {
            alert(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        alert('Đã đổi mật khẩu thành công! (Mô phỏng)');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 bg-[#F5F7FA] min-h-screen">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">Cài đặt tài khoản</h1>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 flex-shrink-0">
                    <div className="p-4 md:p-6 space-y-2 flex md:flex-col overflow-x-auto scrollbar-hide">
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`cursor-pointer flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors w-full ${
                                activeTab === 'profile' ? 'bg-white text-[#E5664B] shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
                            }`}
                        >
                            <User size={18} /> Hồ sơ cá nhân
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`cursor-pointer flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors w-full ${
                                activeTab === 'security' ? 'bg-white text-[#E5664B] shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
                            }`}
                        >
                            <Lock size={18} /> Bảo mật
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-10">
                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h2>

                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                                        <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 bg-[#E5664B] text-white p-2 rounded-full shadow-lg hover:bg-[#d6553a] transition-colors cursor-pointer"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleAvatarSelect}
                                    />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="font-bold text-gray-800 text-lg">{profileData.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Ảnh định dạng JPG, GIF hoặc PNG. Tối đa 2MB.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <User size={16} className="text-gray-400" /> Họ và tên
                                        </label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all font-medium text-gray-800"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 relative">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <Mail size={16} className="text-gray-400" /> Email đăng nhập
                                        </label>
                                        <input 
                                            type="email" 
                                            value={profileData.email}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                                            disabled
                                        />
                                        <Lock size={14} className="absolute right-4 top-10 text-gray-400" />
                                        <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi.</p>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400" /> Số điện thoại
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all font-medium text-gray-800"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <FileText size={16} className="text-gray-400" /> Giới thiệu bản thân
                                        </label>
                                        <textarea 
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleProfileChange}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all font-medium text-gray-800 resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-[#E5664B] hover:bg-[#d6553a] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {isSaving ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Đổi mật khẩu</h2>
                            <p className="text-sm text-gray-500 mb-8">Để bảo vệ tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.</p>

                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8 flex items-start gap-3">
                                <ShieldAlert className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-bold text-amber-800 text-sm">Lời khuyên bảo mật</h4>
                                    <p className="text-xs text-amber-700 mt-1">Sử dụng mật khẩu dài ít nhất 6 ký tự, bao gồm cả chữ hoa, chữ thường, số và ký tự đặc biệt để tài khoản an toàn nhất.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSavePassword} className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Mật khẩu hiện tại</label>
                                    <input 
                                        type="password" 
                                        name="current"
                                        value={passwords.current}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Mật khẩu mới</label>
                                    <input 
                                        type="password" 
                                        name="new"
                                        value={passwords.new}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all font-medium"
                                        placeholder="Nhập mật khẩu mới"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Xác nhận mật khẩu mới</label>
                                    <input 
                                        type="password" 
                                        name="confirm"
                                        value={passwords.confirm}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#E5664B] focus:ring-2 focus:ring-[#E5664B]/20 transition-all font-medium"
                                        placeholder="Nhập lại mật khẩu mới"
                                        required
                                    />
                                </div>
                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        className="bg-[#E5664B] hover:bg-[#d6553a] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                                    >
                                        <Lock size={18} /> Cập nhật mật khẩu
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentSetting;