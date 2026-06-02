import React from 'react';
import { teachersData } from '../data/mockData';

const Teachers: React.FC = () => {
    return (
        <section className="teachers">
            <div className="container">
                <h2 className="section-title">Đội Ngũ Giảng Viên</h2>
                <p className="section-subtitle">Học hỏi từ những chuyên gia hàng đầu trong ngành</p>
                <div className="grid-cards">
                    {teachersData.map(teacher => (
                        <div className="card" key={teacher.id}>
                            <img src={teacher.avatar} alt={teacher.name} className="card-avatar" />
                            <h4>{teacher.name}</h4>
                            <p className="role">{teacher.role} @ {teacher.company}</p>
                            <p className="exp">Kinh nghiệm: {teacher.exp}</p>
                            <p style={{ marginTop: '10px' }}>{teacher.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Teachers;