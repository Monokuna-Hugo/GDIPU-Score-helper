import React, { Component } from "react"
import { Flex, Splitter, Typography } from 'antd';
import DemoRose from "../Charts/RadarCharts";

const Desc = props => (
    <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
            {props.text}
        </Typography.Title>
    </Flex>
);

class MyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentInfo: null
        };
    }

    componentDidMount() {
        // 从chrome.storage.local.get获取studentInfo数据
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get('studentInfo', ({ studentInfo }) => {
                if (studentInfo) {
                    this.setState({ studentInfo });
                } else {
                    // 如果没有获取到数据，使用模拟数据
                    const mockStudentInfo = {
                        items: [
                            { name: "智育测评（60%）", percentage: "60", score: "78.73" },
                            { name: "美育测评（8%）", percentage: "8", score: "54.5" },
                            { name: "劳育测评（8%）", percentage: "8", score: "92" },
                            { name: "德育测评（16%）", percentage: "16", score: "90.94" },
                            { name: "体育测评（8%）", percentage: "8", score: "72.5" }
                        ],
                        totalScore: "79.308",
                        assessmentRecords: []
                    };
                    this.setState({ studentInfo: mockStudentInfo });
                }
            });
        } else {
            // 在非Chrome环境下使用模拟数据
            const mockStudentInfo = {
                items: [
                    { name: "智育测评（60%）", percentage: "60", score: "78.73" },
                    { name: "美育测评（8%）", percentage: "8", score: "54.5" },
                    { name: "劳育测评（8%）", percentage: "8", score: "92" },
                    { name: "德育测评（16%）", percentage: "16", score: "90.94" },
                    { name: "体育测评（8%）", percentage: "8", score: "72.5" }
                ],
                totalScore: "79.308",
                assessmentRecords: []
            };
            this.setState({ studentInfo: mockStudentInfo });
        }
    }

    render() {
        const { studentInfo } = this.state;

        return (
            <Splitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', height: '510px' }}>
                <Splitter.Panel defaultSize="40%" min="20%" max="70%">
                    <DemoRose studentInfo={studentInfo} />
                </Splitter.Panel>
                <Splitter.Panel>
                    <div style={{ padding: '20px', height: '100%' }}>
                        <Typography.Title level={4} style={{ marginBottom: '20px' }}>
                            成绩详情
                        </Typography.Title>
                        {studentInfo ? (
                            <div>
                                <Typography.Paragraph>
                                    <strong>综合成绩：</strong>{studentInfo.totalScore}分
                                </Typography.Paragraph>
                                {studentInfo.items.map((item, index) => (
                                    <Typography.Paragraph key={index}>
                                        <strong>{item.name.replace(/（.*?）/, '')}：</strong>
                                        {item.score}分 (权重：{item.percentage}%)
                                    </Typography.Paragraph>
                                ))}
                            </div>
                        ) : (
                            <Desc text="加载中..." />
                        )}
                    </div>
                </Splitter.Panel>
            </Splitter>
        )
    }
}

export default MyContent;

