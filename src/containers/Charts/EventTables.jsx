import React, { useEffect, useState, useMemo } from 'react';
import { Card, Space, Table, Tag, Typography, message } from 'antd';
import SearchForm from '../SearchForm/SearchForm';

/**
 * 活动表格组件
 * @returns 
 */
const EventTables = () => {
    // 定义表格的列配置，每个对象代表表格中的一列
    const columns = [
        {
            // 列的标题
            title: '活动名称',
            // 对应数据对象中的属性名
            dataIndex: 'activityName',
            // 列的唯一标识
            key: 'activityName',
            // 列的宽度
            width: 200,
            // 当内容过长时显示省略号
            ellipsis: true,
        },
        {
            title: '测评类型',
            dataIndex: 'assessmentIndicator',
            key: 'assessmentIndicator',
            width: 100,
            // 定义列的筛选选项
            filters: [
                { text: '德育测评', value: '德育测评' },
                { text: '智育测评', value: '智育测评' },
                { text: '体育测评', value: '体育测评' },
                { text: '美育测评', value: '美育测评' },
                { text: '劳育测评', value: '劳育测评' },
            ],
            // 筛选逻辑，根据选中的值过滤数据
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
            // 定义排序逻辑，根据发生时间进行排序
            sorter: (a, b) => new Date(a.occurrenceTime) - new Date(b.occurrenceTime),
        },
        {
            title: '分数',
            dataIndex: 'score',
            key: 'score',
            width: 80,
            // 定义排序逻辑，根据分数进行排序
            sorter: (a, b) => parseFloat(a.score) - parseFloat(b.score),
            // 自定义渲染函数，将分数显示为蓝色加粗文本
            render: (score) => <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{score}</span>,
        },
        {
            title: '评分条件',
            dataIndex: 'scoringCondition',
            key: 'scoringCondition',
            width: 250,
            ellipsis: true,
            // 自定义渲染函数，当内容长度超过 30 字符时显示省略号，并添加 tooltip 显示完整内容
            render: (text) => (
                <span title={text}>
                    {text.length > 30 ? text.substring(0, 30) + '...' : text}
                </span>
            ),
        },
    ];

    // 定义一个函数，用于处理事件数据，将原始数据转换为表格所需的格式
    const processEventData = (eventInfo) => {
        // 如果传入的数据为空或没有 assessmentRecords 属性，返回空数组
        if (!eventInfo || !eventInfo.assessmentRecords) return [];

        // 遍历 assessmentRecords 数组，将每个元素转换为表格所需的格式
        return eventInfo.assessmentRecords.map((item, index) => ({
            // 为每条数据添加唯一的 key
            key: index,
            // 如果属性不存在，使用空字符串或 '0' 作为默认值
            activityName: item.activityName || '',
            assessmentIndicator: item.assessmentIndicator || '',
            assessmentItem: item.assessmentItem || '',
            assessmentSystem: item.assessmentSystem || '',
            occurrenceTime: item.occurrenceTime || '',
            score: item.score || '0',
            scoringCondition: item.scoringCondition || '',
        }));
    };

    // 定义状态变量，用于存储学生信息，初始值为 null
    const [studentInfo, setStudentInfo] = useState(null);
    // 定义状态变量，用于存储处理后的事件数据，初始值为空数组
    const [eventData, setEventData] = useState([]);
    // 定义状态变量，用于存储原始数据（不经过搜索过滤）
    const [originalData, setOriginalData] = useState([]);
    // 定义状态变量，用于控制表格的加载状态，初始值为 false
    const [loading, setLoading] = useState(false);
    // 定义状态变量，用于存储搜索参数
    const [searchParams, setSearchParams] = useState({});

    // 搜索函数
    const handleSearch = (searchValues) => {
        setSearchParams(searchValues);

        if (Object.keys(searchValues).length === 0) {
            // 如果没有搜索条件，显示所有数据
            setEventData(originalData);
            return;
        }

        const filteredData = originalData.filter(item => {
            // 活动名称搜索（模糊匹配）
            if (searchValues.activityName && item.activityName) {
                if (!item.activityName.includes(searchValues.activityName)) {
                    return false;
                }
            }

            // 测评类型搜索（精确匹配）
            if (searchValues.assessmentIndicator && item.assessmentIndicator !== searchValues.assessmentIndicator) {
                return false;
            }

            // 活动时间搜索
            if (searchValues.occurrenceTime && item.occurrenceTime) {
                const searchDate = searchValues.occurrenceTime.format('YYYY-MM-DD');
                if (item.occurrenceTime !== searchDate) {
                    return false;
                }
            }

            return true;
        });

        setEventData(filteredData);

        // 显示搜索结果统计
        if (filteredData.length === 0) {
            message.info('未找到匹配的记录');
        } else {
            message.success(`找到 ${filteredData.length} 条匹配记录`);
        }
    };

    // 使用 useEffect 钩子，在组件挂载时执行数据获取操作
    useEffect(() => {
        // 定义一个异步函数，用于获取数据
        const fetchData = async () => {
            // 设置加载状态为 true
            setLoading(true);
            try {
                // 检查是否在 Chrome 浏览器环境且支持 chrome.storage API
                if (typeof chrome !== 'undefined' && chrome.storage) {
                    // 从本地存储中获取 studentInfo 数据
                    chrome.storage.local.get('studentInfo', ({ studentInfo: storedInfo }) => {
                        // 如果获取到数据
                        if (storedInfo) {
                            // 更新学生信息状态
                            setStudentInfo(storedInfo);
                            // 处理获取到的数据
                            const processedData = processEventData(storedInfo);
                            // 更新原始数据和事件数据状态
                            setOriginalData(processedData);
                            setEventData(processedData);
                        }
                        // 设置加载状态为 false
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            } catch (error) {
                // 捕获异常并打印错误信息
                console.error('获取数据失败:', error);
                // 设置加载状态为 false
                setLoading(false);
            }
        };

        // 调用数据获取函数
        fetchData();
    }, []);

    // 分页配置
    const myPagination = {
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
    };

    // 组件返回一个 Table 组件，用于展示事件数据
    return (
        <>
            <Card title="测评记录" size='large'>
                <SearchForm
                    onSearch={handleSearch}
                    loading={loading}
                />
                <Table
                    // 传入表格的列配置
                    columns={columns}
                    // 传入表格的数据源
                    dataSource={eventData}
                    // 传入加载状态
                    loading={loading}
                    // 配置表格的分页功能
                    pagination={myPagination}
                    // 设置表格的横向滚动宽度
                    scroll={{ x: 1000 }}
                    size="large"
                />
            </Card>
        </>
    );
};

export default EventTables;