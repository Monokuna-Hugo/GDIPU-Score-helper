import React, { useState, useEffect } from 'react';
import { Radar } from '@ant-design/plots';
import { Row, Col, Statistic, Select, Space, Tooltip, Card, Table, Button, Modal, Tag } from 'antd';
import { DragOutlined, FilterOutlined } from '@ant-design/icons';

// 主组件
const StudentDashboard = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [filters, setFilters] = useState({
        indicator: 'all',
        level: 'all',
        mode: 'all'
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPage, setModalPage] = useState(1);
    const modalPageSize = 10;

    // 加载数据
    useEffect(() => {
        chrome.storage.local.get('studentInfo', ({ studentInfo }) => {
            if (studentInfo) {
                setStudentInfo(studentInfo);
                setFilteredRecords(studentInfo.assessmentRecords);
            }
        });
    }, []);

    // 应用过滤器
    useEffect(() => {
        if (!studentInfo) return;

        const filtered = filterRecords(studentInfo.assessmentRecords, filters);
        setFilteredRecords(filtered);
    }, [filters, studentInfo]);

    // 过滤逻辑（与原逻辑相同）
    const filterRecords = (records, filters) => {
        return records.filter(r =>
            (filters.indicator === 'all' || r.assessmentIndicator === filters.indicator) &&
            matchLevelFilter(r, filters.level) &&
            matchModeFilter(r, filters.mode)
        );
    };

    const matchLevelFilter = (r, levelValue) =>
        levelValue === 'all' ? true :
            levelValue === 'other' ? !['校级', '学院', '社团', '班级'].some(l => r.assessmentItem.includes(l)) :
                r.assessmentItem.includes(levelValue);

    const matchModeFilter = (r, modeValue) => {
        if (modeValue === 'all') return true;
        const [isNonOffline, isNonOnline, isOffline, isOnline] =
            ['非线下', '非线上', '线下', '线上'].map(m => r.assessmentItem.includes(m));
        return modeValue === '线下' ? isOffline || isNonOnline :
            modeValue === '线上' ? isOnline || isNonOffline :
                !isOffline && !isOnline && !isNonOffline && !isNonOnline;
    };

    if (!studentInfo) {
        return <div>没有找到学生信息</div>;
    }

    return (
        <div className="student-dashboard">
            <InfoPanel info={studentInfo} />
            <FilterPanel filters={filters} setFilters={setFilters} filteredRecords={filteredRecords} />
            <Row gutter={16}>
                <Col span={12}>
                    <RadarChart info={studentInfo} />
                </Col>
                <Col span={12}>
                    <CrossTable info={studentInfo} />
                </Col>
            </Row>
            <Button type="primary" onClick={() => setModalVisible(true)}>
                查看详细记录
            </Button>
            <RecordModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                records={filteredRecords}
                page={modalPage}
                pageSize={modalPageSize}
                onPageChange={setModalPage}
            />
        </div>
    );
};

// 信息面板组件
const InfoPanel = ({ info }) => {
    const order = ['德育测评', '智育测评', '体育测评', '美育测评', '劳育测评'];

    return (
        <Card title="学生测评信息">
            <Row gutter={16}>
                <Col span={4}>
                    <Statistic title="综合成绩" value={info.totalScore} suffix="分" />
                </Col>
                {order.map(name => {
                    const item = info.items.find(item => item.name.includes(name));
                    return item ? (
                        <Col span={4} key={name}>
                            <Card size="small">
                                <div>{name}</div>
                                <Statistic value={item.score} suffix="分" />
                            </Card>
                        </Col>
                    ) : null;
                })}
            </Row>
        </Card>
    );
};

// 过滤器组件
const FilterPanel = ({ filters, setFilters, filteredRecords }) => {
    const indicators = ['全部', '德育测评', '智育测评', '体育测评', '美育测评', '劳育测评'];
    const levels = ['全部', '校级', '学院', '社团', '班级', '其他'];
    const modes = ['全部', '线上', '线下', '其他'];

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const scoreSum = filters.indicator !== '全部' ?
        filteredRecords.reduce((sum, r) => sum + parseFloat(r.score), 0).toFixed(2) :
        'N/A';

    return (
        <Card title="筛选条件" style={{ marginBottom: 16 }}>
            <Space>
                <span>测评指标:</span>
                <Select
                    value={filters.indicator}
                    onChange={value => updateFilter('indicator', value)}
                    style={{ width: 120 }}
                >
                    {indicators.map(indicator => (
                        <Select.Option key={indicator} value={indicator === '全部' ? 'all' : indicator}>
                            {indicator}
                        </Select.Option>
                    ))}
                </Select>

                <span>级别:</span>
                <Select
                    value={filters.level}
                    onChange={value => updateFilter('level', value)}
                    style={{ width: 100 }}
                >
                    {levels.map(level => (
                        <Select.Option key={level} value={level === '全部' ? 'all' : level}>
                            {level}
                        </Select.Option>
                    ))}
                </Select>

                <span>模式:</span>
                <Select
                    value={filters.mode}
                    onChange={value => updateFilter('mode', value)}
                    style={{ width: 100 }}
                >
                    {modes.map(mode => (
                        <Select.Option key={mode} value={mode === '全部' ? 'all' : mode}>
                            {mode}
                        </Select.Option>
                    ))}
                </Select>

                <Tag color="blue">分数统计: {scoreSum}</Tag>
            </Space>
        </Card>
    );
};

// 雷达图组件
const RadarChart = ({ info }) => {
    const order = ['德育测评', '智育测评', '体育测评', '美育测评', '劳育测评'];
    const orderedItems = order.map(name =>
        info.items.find(item => item.name.includes(name))
    ).filter(Boolean);

    const config = {
        data: [{
            name: '成绩',
            value: orderedItems.map(item => parseFloat(item.score)),
            category: orderedItems.map(item => item.name.replace(/（.*?）/, ''))
        }],
        xField: 'category',
        yField: 'value',
        seriesField: 'name',
        meta: {
            value: {
                min: 0,
                max: 100,
                nice: true
            }
        },
        area: {
            style: {
                fill: 'rgba(0, 255, 255, 0.1)'
            }
        },
        line: {
            style: {
                stroke: 'l(0) 0:#00FFFF 1:#00FF00'
            }
        },
        point: {
            size: 4
        }
    };

    return (
        <Card title="五育成绩雷达图">
            <Radar {...config} />
        </Card>
    );
};

// 交叉表组件
const CrossTable = ({ info }) => {
    const indicators = ['德育测评', '智育测评', '体育测评', '美育测评', '劳育测评'];
    const levels = ['校级', '学院', '社团', '班级', '其他'];

    const dataSource = levels.map(level => {
        const row = { level };
        indicators.forEach(indicator => {
            row[indicator] = info.assessmentRecords
                .filter(r => r.assessmentIndicator === indicator &&
                    (level === '其他' ?
                        !['校级', '学院', '社团', '班级'].some(l => r.assessmentItem.includes(l)) :
                        r.assessmentItem.includes(level))
                )
                .reduce((sum, r) => sum + parseFloat(r.score), 0)
                .toFixed(2);
        });
        return row;
    });

    // 添加总计行
    const totalRow = { level: '总计' };
    indicators.forEach(indicator => {
        totalRow[indicator] = info.assessmentRecords
            .filter(r => r.assessmentIndicator === indicator)
            .reduce((sum, r) => sum + parseFloat(r.score), 0)
            .toFixed(2);
    });
    dataSource.push(totalRow);

    const columns = [
        {
            title: '级别 / 指标',
            dataIndex: 'level',
            key: 'level',
        },
        ...indicators.map(indicator => ({
            title: indicator,
            dataIndex: indicator,
            key: indicator,
        }))
    ];

    return (
        <Card title="级别-指标交叉表">
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                size="small"
            />
        </Card>
    );
};

// 记录模态框组件
const RecordModal = ({ visible, onClose, records, page, pageSize, onPageChange }) => {
    const [position, setPosition] = useState({ x: window.innerWidth * 0.15, y: window.innerHeight * 0.10 });
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (!e.target.closest('.ant-table') && !e.target.closest('.ant-pagination')) {
            setDragging(true);
            setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragging]);

    const columns = [
        {
            title: '测评指标',
            dataIndex: 'assessmentIndicator',
            key: 'assessmentIndicator',
            ellipsis: true,
        },
        {
            title: '测评项',
            dataIndex: 'assessmentItem',
            key: 'assessmentItem',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            )
        },
        {
            title: '活动名称',
            dataIndex: 'activityName',
            key: 'activityName',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            )
        },
        {
            title: '得分条件',
            dataIndex: 'scoringCondition',
            key: 'scoringCondition',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            )
        },
        {
            title: '分值',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: '发生时间',
            dataIndex: 'occurrenceTime',
            key: 'occurrenceTime',
        },
    ];

    const paginatedRecords = records.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return (
        <Modal
            title={
                <div
                    onMouseDown={handleMouseDown}
                    style={{ cursor: 'move', padding: '16px 24px', margin: '-16px -24px' }}
                >
                    <DragOutlined style={{ marginRight: 8 }} />
                    详细测评记录
                </div>
            }
            visible={visible}
            onCancel={onClose}
            footer={null}
            style={{
                top: position.y,
                left: position.x,
                position: 'absolute',
                margin: 0,
                paddingBottom: 0,
            }}
            width={1000}
            bodyStyle={{ padding: 0 }}
        >
            <Table
                columns={columns}
                dataSource={paginatedRecords}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: records.length,
                    onChange: onPageChange,
                    showSizeChanger: false,
                }}
                scroll={{ y: 400 }}
                size="small"
            />
        </Modal>
    );
};

export default StudentDashboard;