import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContent from '../MyContent/MyContent';
import EventTables from '../Charts/EventTables';



const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<MyContent />} />
            <Route path="/charts" element={<EventTables />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;