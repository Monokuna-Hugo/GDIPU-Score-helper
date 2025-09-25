import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from '../Charts/StudentDashboard';
import MyContent from '../MyContent/MyContent';
import DemoRose from '../Charts/RadarCharts';

// 个人信息页面组件（占位）
const Profile = () => (
    <div style={{ padding: '20px' }}>
        <h2>个人信息</h2>
        <p>这里是个人信息页面，功能待开发...</p>
    </div>
);

// 图表分析页面组件
const ChartsAnalysis = () => (
    <div style={{ padding: '20px' }}>
        <h2>图表分析</h2>
        <p>这里是图表分析页面，功能待开发...</p>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/charts" element={<ChartsAnalysis />} />
            <Route path="/radar" element={<MyContent />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;