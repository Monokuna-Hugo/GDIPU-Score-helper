import { SearchOutlined } from '@ant-design/icons';
import { Form, Input, DatePicker, Button, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React from 'react'

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchForm = ({ onSearch, loading = false }) => {
    const [form] = Form.useForm();

    // 处理搜索提交
    const handleSearch = (values) => {
        if (onSearch) {
            onSearch(values);
        }
    };

    // 重置表单
    const handleReset = () => {
        form.resetFields();
        if (onSearch) {
            onSearch({});
        }
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <Form
                form={form}
                layout='inline'
                onFinish={handleSearch}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
            >
                <FormItem label="活动名称" name="activityName">
                    <Input
                        placeholder="输入活动名称关键词"
                        style={{ width: 180 }}
                        allowClear
                    />
                </FormItem>

                <FormItem label="测评类型" name="assessmentIndicator">
                    <Select
                        placeholder="选择测评类型"
                        style={{ width: 150 }}
                        allowClear
                    >
                        <Option value="德育测评">德育测评</Option>
                        <Option value="智育测评">智育测评</Option>
                        <Option value="体育测评">体育测评</Option>
                        <Option value="美育测评">美育测评</Option>
                        <Option value="劳育测评">劳育测评</Option>
                    </Select>
                </FormItem>

                <FormItem label="活动时间" name="occurrenceTime">
                    <DatePicker
                        placeholder='选择活动时间'
                        style={{ width: 150 }}
                    />
                </FormItem>


                <FormItem>
                    <Button
                        icon={<SearchOutlined />}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ marginRight: 8 }}
                    >
                        搜索
                    </Button>
                    <Button
                        onClick={handleReset}
                        disabled={loading}
                    >
                        重置
                    </Button>
                </FormItem>
            </Form>
        </div>
    );
};

export default SearchForm;