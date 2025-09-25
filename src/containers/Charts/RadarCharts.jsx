import { Rose } from '@ant-design/plots';
import React from 'react';

const DemoRose = ({ studentInfo }) => {
    // 如果没有传入studentInfo，使用默认数据
    if (!studentInfo || !studentInfo.items || studentInfo.items.length === 0) {
        return null;
    }

    // 定义五育类型对应的颜色
    const typeColors = {
        '德育': '#ff4d4f', // 红色
        '智育': '#1890ff', // 蓝色
        '体育': '#52c41a', // 绿色
        '美育': '#faad14', // 橙色
        '劳育': '#722ed1'  // 紫色
    };

    // 处理studentInfo数据，转换为玫瑰图需要的格式
    const roseData = studentInfo.items.map(item => {
        const itemName = item.name.replace(/（.*?）/, ''); // 移除括号内的百分比信息
        return {
            type: itemName,
            value: parseFloat(item.score),
            percentage: parseFloat(item.percentage)
        };
    });

    const config = {
        data: roseData,
        xField: 'type',
        yField: 'value',
        innerRadius: 0.2,
        colorField: 'type',
        style: {
            radius: 5,

        },
        scale: {
            y: {
                domainMax: 100
            }
        },
    };

    return <Rose {...config} />;
};

export default DemoRose;