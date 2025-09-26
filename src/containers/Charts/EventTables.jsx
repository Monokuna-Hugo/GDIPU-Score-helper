import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';

const EventTables = () => {
    const columns = [
        {
            title: '活动名称',
            dataIndex: 'activityName',
            key: 'activityName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '测评类型',
            dataIndex: 'assessmentIndicator',
            key: 'assessmentIndicator',
            width: 100,
            filters: [
                { text: '德育测评', value: '德育测评' },
                { text: '智育测评', value: '智育测评' },
                { text: '体育测评', value: '体育测评' },
                { text: '美育测评', value: '美育测评' },
                { text: '劳育测评', value: '劳育测评' },
            ],
            onFilter: (value, record) => record.assessmentIndicator === value,
        },
        {
            title: '测评项目',
            dataIndex: 'assessmentItem',
            key: 'assessmentItem',
            width: 150,
            ellipsis: true,
        },
        {
            title: '测评体系',
            dataIndex: 'assessmentSystem',
            key: 'assessmentSystem',
            width: 200,
            ellipsis: true,
        },
        {
            title: '发生时间',
            dataIndex: 'occurrenceTime',
            key: 'occurrenceTime',
            width: 120,
            sorter: (a, b) => new Date(a.occurrenceTime) - new Date(b.occurrenceTime),
        },
        {
            title: '分数',
            dataIndex: 'score',
            key: 'score',
            width: 80,
            sorter: (a, b) => parseFloat(a.score) - parseFloat(b.score),
            render: (score) => <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{score}</span>,
        },
        {
            title: '评分条件',
            dataIndex: 'scoringCondition',
            key: 'scoringCondition',
            width: 250,
            ellipsis: true,
            render: (text) => (
                <span title={text}>
                    {text.length > 30 ? text.substring(0, 30) + '...' : text}
                </span>
            ),
        },
    ];

    const processEventData = (eventInfo) => {
        if (!eventInfo || !eventInfo.assessmentRecords) return [];

        return eventInfo.assessmentRecords.map((item, index) => ({
            key: index,
            activityName: item.activityName || '',
            assessmentIndicator: item.assessmentIndicator || '',
            assessmentItem: item.assessmentItem || '',
            assessmentSystem: item.assessmentSystem || '',
            occurrenceTime: item.occurrenceTime || '',
            score: item.score || '0',
            scoringCondition: item.scoringCondition || '',
        }));
    };

    const [studentInfo, setStudentInfo] = useState(null);
    const [eventData, setEventData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (typeof chrome !== 'undefined' && chrome.storage) {
                    chrome.storage.local.get('studentInfo', ({ studentInfo: storedInfo }) => {
                        if (storedInfo) {
                            setStudentInfo(storedInfo);
                            const processedData = processEventData(storedInfo);
                            setEventData(processedData);
                        }
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('获取数据失败:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Table
            columns={columns}
            dataSource={eventData}
            loading={loading}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
            }}
            scroll={{ x: 1000 }}
            size="middle"
        />
    );
};

export default EventTables;