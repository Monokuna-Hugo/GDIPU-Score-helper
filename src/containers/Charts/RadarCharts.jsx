import { Radar } from '@ant-design/plots';
import React from 'react';

const DemoRadar = ({ studentInfo }) => {
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

    // 处理studentInfo数据，转换为雷达图需要的格式
    const radarData = studentInfo.items.map(item => {
        const itemName = item.name.replace(/（.*?）/, ''); // 移除括号内的百分比信息
        // 根据五育名称确定类型
        const type = itemName;
        return {
            item: itemName,
            score: parseFloat(item.score),
            percentage: parseFloat(item.percentage),
            type: type
        };
    });

    const config = {
        data: radarData,
        xField: 'item',
        yField: 'score',
        colorField: 'type',
        color: (type) => typeColors[type] || '#d9d9d9', // 根据类型返回对应颜色
        coordinateType: 'polar',
        axis: {
            x: {
                grid: true,
                gridLineWidth: 1,
                tick: false,
                gridLineDash: [0, 0],
                line: false,
            },
            y: {
                zIndex: 1,
                title: false,
                gridConnect: 'line',
                gridLineWidth: 1,
                gridLineDash: [0, 0],
            },
        },
        area: {
            style: {
                fillOpacity: 0.5,
            },
        },
        point: {
            shapeField: 'point',
            sizeField: 3,
        },
        scale: { x: { padding: 0.5, align: 0 }, y: { tickCount: 5, domainMax: 80 } },
        style: {
            lineWidth: 2,
        },
    };

    return <Radar {...config} />;
};

export default DemoRadar;