import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import DemoRadar from '../../containers/Charts/RadarCharts';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    // 模拟从chrome.storage.local.get获取数据
    // 这里使用data.txt中的示例数据
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
    
    setStudentInfo(mockStudentInfo);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          学生成绩雷达图测试
        </p>
        
        <div style={{ width: '600px', height: '400px', background: 'white', padding: '20px', borderRadius: '8px' }}>
          <DemoRadar studentInfo={studentInfo} />
        </div>
        
        {studentInfo && (
          <div style={{ marginTop: '20px', color: 'white' }}>
            <h3>数据预览：</h3>
            <pre style={{ textAlign: 'left', fontSize: '12px' }}>
              {JSON.stringify(studentInfo.items, null, 2)}
            </pre>
          </div>
        )}
      </header>
    </div>
  );
};

export default Newtab;
