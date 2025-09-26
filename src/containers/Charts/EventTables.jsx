import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
const EventTables = () => {

    const columns = [
        {
            title: '活动名称',
            dataIndex: 'activityName',
            key: 'activityName',
        },
        {
            title: '测评类型',
            dataIndex: 'accessmentIndicator',
            key: 'accessmentIndicator',
        },
        {
            title: '测评标准',
            dataIndex: 'accessmentItem',
            key: 'accessmentItem',
        },
        {
            title: '测评体系',
            dataIndex: 'accessmentSystem',
            key: 'accessmentSystem',
        },
        {
            title: '发生时间',
            dataIndex: 'occurrenceTime',
            key: 'occurrenceTime',
        },
        {
            title: '分数',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: '分数标准',
            dataIndex: 'scoreCondition',
            key: 'scoreCondition',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];



    const processEventData = (eventInfo) => {
        return eventInfo.accessmentRecords.map(item => {
            return {
                activityName: item.activityName,
                accessmentIndicator: item.accessmentIndicator,
                accessmentItem: item.accessmentItem,
                accessmentSystem: item.accessmentSystem,
                accessmentTime: item.accessmentTime,
                score: item.score,
                scoreTime: item.scoreTime,
            }
        })
    }

    const [studentInfo, setStudentInfo] = useState(null)
    const [eventData, setEventData] = useState([])

    useEffect(() => {
        if (typeof chrome != 'undefined') {
            chrome.storage.local.get('studentInfo', ({ studentInfo: storedInfo }) => {
                if (storedInfo) {
                    setStudentInfo(storedInfo)
                    setEventData(processEventData(storeInfo))
                }
            })
        }
    })

    return (
        <Table columns={columns} dataSource={eventData} />
    );

};

export default EventTables;