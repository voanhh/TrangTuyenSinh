import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'shadow-md' : ''}`}>
            <div className="container nav-content">
                <a href="/" className="logo">Trí Anh<span> Education</span></a>
                <ul className="nav-links">
                    <li><a href="#home">Trang chủ</a></li>
                    <li><a href="#about">Giới thiệu</a></li>
                    <li><a href="#courses">Khóa học ▾</a></li>
                    <li><a href="#blog">Blog</a></li>
                    <li><a href="#contact">Liên hệ</a></li>
                </ul>
                <button className="btn btn-primary">Đăng ký học ngay</button>
            </div>
        </nav>
    );
};

export default Navbar;