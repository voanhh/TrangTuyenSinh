import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { teacherApi, Teacher } from '../../services/api';

const AdminTeachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Tạm thời gọi API lấy dữ liệu
        const fetchTeachers = async () => {
            try {
                const data = await teacherApi.getAllTeachers();
                setTeachers(data);
            } catch (error) {
                console.error("Lỗi API:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    return (
        <div>
            <div className="page-header-actions">
                <h2 className="admin-page-title">Quản lý Giảng viên</h2>
                <button className="btn btn-icon btn-add">
                    <Plus size={18} /> Thêm Giảng viên
                </button>
            </div>

            <div className="table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Giảng viên</th>
                            <th>Chức danh & Công ty</th>
                            <th>Kinh nghiệm</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
                        ) : (
                            teachers.map((teacher) => (
                                <tr key={teacher.id}>
                                    <td>#{teacher.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={teacher.avatarUrl || "https://via.placeholder.com/40"} alt={teacher.fullName} className="table-img table-img-round" />
                                            <strong>{teacher.fullName}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <div>{teacher.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{teacher.company}</div>
                                    </td>
                                    <td>{teacher.experience}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-edit" title="Sửa"><Edit size={16} /></button>
                                            <button className="btn-delete" title="Xóa"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTeachers;