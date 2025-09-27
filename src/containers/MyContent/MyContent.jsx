import React, { Component } from "react"
import { Card, Col, Flex, notification, Row, Space, Splitter, Typography } from 'antd';
import StudentRadarChart from "../Charts/RadarCharts";
import StudentDashboard from "../Charts/StudentDashboard";




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
                }
            });
        }


    }

    render() {
        const { studentInfo } = this.state;

        return (
            <Row gutter={24}>
                <Col span={12}>
                    <Card title="测评数据">
                        <StudentDashboard studentInfo={studentInfo} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="分数玫瑰图">
                        <StudentRadarChart studentInfo={studentInfo} />
                    </Card>
                </Col>
            </Row>
        )
    }
}

export default MyContent;

