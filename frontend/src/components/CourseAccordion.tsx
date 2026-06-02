import React, { useState } from 'react';
import { coursesData } from '../data/mockData';

const CourseAccordion: React.FC = () => {
    const [activeId, setActiveId] = useState<number | null>(1); // Mặc định mở tab đầu tiên

    const toggleAccordion = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section className="courses" id="courses">
            <div className="container">
                <h2 className="section-title">Chương Trình Đào Tạo</h2>
                <p className="section-subtitle">Khám phá các khóa học thực chiến được thiết kế riêng cho bạn</p>

                <div className="accordion-wrapper">
                    {coursesData.map((course) => (
                        <div className={`accordion-item ${activeId === course.id ? 'active' : ''}`} key={course.id}>
                            {/* Header */}
                            <div className="accordion-header" onClick={() => toggleAccordion(course.id)}>
                                <span>{course.title}</span>
                                <span className="icon">▼</span>
                            </div>

                            {/* Magic wrapper for smooth transition */}
                            <div className="accordion-content-grid">
                                <div className="accordion-content-inner">
                                    <div className="course-detail">
                                        <div className="course-image">
                                            <img src={course.image} alt={course.title} />

                                            <div className="teacher-mini" style={{ marginTop: '20px' }}>
                                                <div>
                                                    <h5>Giảng viên: {course.teacher.name}</h5>
                                                    <p>{course.teacher.title} tại {course.teacher.company}</p>
                                                    <p>Kinh nghiệm: {course.teacher.experience}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="course-info">
                                            <h4>Tổng quan khóa học</h4>
                                            <p className="desc">{course.shortDesc}</p>

                                            <div className="course-meta">
                                                <span className="meta-badge">⏱ {course.duration}</span>
                                                <span className="meta-badge">💻 {course.format}</span>
                                            </div>

                                            <h4>Nội dung đào tạo</h4>
                                            <ul className="course-syllabus">
                                                {course.syllabus.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>

                                            <div className="course-price-cta">
                                                <div className="price">{course.price}</div>
                                                <button className="btn btn-primary">Đăng ký ngay</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CourseAccordion;