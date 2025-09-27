<img src="src/assets/img/icon-128.png" width="64"/>

# GDIPU Score Helper

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.27.3-blue)](https://ant.design)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen)](https://developer.chrome.com/docs/extensions/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange)](https://developer.chrome.com/docs/extensions/mv3/intro/)

一个专为广轻大学生设计的Chrome浏览器扩展，用于帮助管理和查看综合测评成绩。

## 功能特性

### 🎯 核心功能
- **成绩数据可视化** - 使用Ant Design Charts展示成绩趋势和统计信息
- **实时时间显示** - 在头部显示当前时间，支持自动更新


### 🛠️ 技术特性
- **现代化技术栈** - 基于React 18 + Ant Design 5 + Webpack 5构建
- **模块化架构** - 组件化开发，易于维护和扩展

## 安装和运行

### 环境要求
- Node.js >= 18.0.0
- Chrome浏览器 >= 88.0.0

### 开发环境设置

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd GDIPU-Score-helper
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm start
   ```

4. **加载扩展到Chrome**
   - 打开Chrome浏览器，访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `build` 文件夹

### 生产环境构建
```bash
npm run build
```

## 项目结构

```
src/
├── assets/           # 静态资源
│   └── img/         # 图片资源
├── containers/       # 容器组件
│   ├── MyHeaders/   # 头部组件
│   ├── MySider/     # 侧边栏组件
│   ├── MyContent/   # 内容区域组件
│   └── Charts/      # 图表组件
├── contexts/         # React Context
│   └── ThemeContext.jsx  # 主题上下文
├── pages/           # 页面组件
│   └── Options/     # 选项页面
└── manifest.json    # 扩展配置文件
```

## 主要组件说明

### MyHeader 组件
- 显示应用标题"智慧3.0助手"
- 实时时间显示功能
- 响应式布局设计

### MySider 组件
- 侧边栏导航菜单
- 路由导航功能
- 包含"数据总览"和"测评记录"选项


## 使用说明

### 数据查看
- 通过侧边栏导航切换不同页面
- 查看成绩统计和趋势图表
- 支持数据筛选和搜索

## 开发指南

### 添加新功能
1. 在相应的组件目录中创建新组件
2. 如果需要全局状态，使用ThemeContext或创建新的Context
3. 更新路由配置（如需要）
4. 测试功能并提交代码


## 技术栈

- **前端框架**: React 18.2.0
- **UI组件库**: Ant Design 5.27.3
- **构建工具**: Webpack 5.75.0
- **开发服务器**: Webpack Dev Server 4.11.1
- **路由管理**: React Router DOM 7.9.2
- **图表库**: Ant Design Charts 2.6.4
- **图标库**: Ant Design Icons 5.6.1

## 浏览器兼容性

- Chrome 88+
- Edge 88+
- 其他基于Chromium的浏览器

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License

## 更新日志

## 支持与反馈

如果您在使用过程中遇到任何问题或有改进建议，请通过以下方式联系我们：
- 提交GitHub Issue
- 发送邮件到项目维护者

---

**GDIPU Score Helper** - 让成绩管理更简单、更智能！
