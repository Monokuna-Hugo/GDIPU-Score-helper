import { notification, Statistic, Row, Col, Card } from "antd";
import React from "react";
import { useState, useEffect } from 'react';

const StudentDashboard = () => {
    // 使用 useState 管理数据状态
    const [studentInfo, setStudentInfo] = useState(null);
    const [processedData, setProcessedData] = useState([]);

    const typeColors = {
        '德育测评': '#d886fe', // 红色
        '智育测评': '#4286fd', // 蓝色
        '体育测评': '#8668fd', // 绿色
        '美育测评': '#32cbcc', // 橙色
        '劳育测评': '#ee9059'  // 紫色
    };

    const getColorForType = (type) => {
        return typeColors[type] || '#999'; // 默认颜色
    }

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

    // 从 chrome 存储中获取数据
    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get('studentInfo', ({ studentInfo: storedInfo }) => {
                if (storedInfo) {
                    setStudentInfo(storedInfo);
                    setProcessedData(processStudentInfo(storedInfo));
                } else {
                    notification.error({
                        message: '获取数据失败',
                        description: '请检查是否已登录并刷新页面',
                    });
                }
            });
        } else {
            notification.error({
                message: '获取数据失败',
                description: '请检查是否已登录并刷新页面1',
            });
        }
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            {studentInfo && (
                <Card title="综合成绩" style={{ marginBottom: '20px' }}>
                    <Statistic
                        title="总成绩"
                        value={studentInfo.totalScore}
                        precision={2}
                        suffix="分"
                        valueStyle={{ color: '#3f8600', fontSize: '32px' }}
                    />
                </Card>
            )}

            <Row gutter={[16, 16]}>
                {processedData.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.type}>
                        <Card size="small">
                            <Statistic
                                title={item.type}
                                value={item.value}
                                precision={2}
                                suffix="分"
                                valueStyle={{ color: getColorForType(item.type) }}
                            />
                            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                                权重: {item.percentage}%
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default StudentDashboard;