import { Statistic } from "antd";
import React from "react";

import { useState, useEffect } from 'react';

const StudentDashboard = ({ studentInfo }) => {
    // 使用 useState 管理数据状态
    const [processedData, setProcessedData] = useState([]);

    // 处理学生信息的函数
    const processStudentInfo = (info) => {
        if (!info || !info.items) return [];
        return info.items.map(item => {
            const itemName = item.name.replace(/（.*?）/, ''); // 移除括号内的百分比信息
            return {
                type: itemName,
                value: parseFloat(item.score),
                percentage: parseFloat(item.percentage)
            };
        });
    };

    // 组件挂载或 studentInfo 变化时处理数据
    useEffect(() => {
        setProcessedData(processStudentInfo(studentInfo));
    }, [studentInfo]);

    // 从 chrome 存储中获取数据
    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get('studentInfo', ({ studentInfo: storedInfo }) => {
                if (storedInfo) {
                    setProcessedData(processStudentInfo(storedInfo));
                }
            });
        }
    }, []);

    return (
        <>
            {processedData.map((item) => (
                <Statistic key={item.type} title={item.type} value={item.value} />
            ))}
        </>
    );
};

export default StudentDashboard;