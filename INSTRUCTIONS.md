# 视频渲染说明

## 当前状态

✅ 所有代码文件已创建完成
✅ 项目结构已配置完成
⏳ 需要手动安装依赖并渲染视频

## 后续步骤

### 1. 安装依赖

在项目根目录运行:

```bash
cd c:/Users/LiaoRH/CodeBuddy/Claw
npm install
```

这将安装以下依赖:
- `remotion`: Remotion 核心库
- `@remotion/cli`: Remotion 命令行工具
- `react`: React 框架
- `react-dom`: React DOM

### 2. 预览视频(可选)

如需在浏览器中实时预览视频效果,运行:

```bash
npm start
```

这将启动 Remotion Studio,在 `http://localhost:3000` 访问。

### 3. 渲染最终视频

运行以下命令渲染视频:

```bash
npm run build
```

视频将输出到: `c:/Users/LiaoRH/CodeBuddy/Claw/out/video.mp4`

## 项目文件清单

```
c:/Users/LiaoRH/CodeBuddy/Claw/
├── Root.tsx                                    # Remotion 根组件
├── index.ts                                    # Remotion 入口文件
├── remotion.config.ts                          # Remotion 配置
├── tsconfig.json                               # TypeScript 配置
├── package.json                                # 项目配置与依赖
├── setup.js                                    # 设置脚本
├── video-storyboard.md                         # 详细分镜脚本
├── README.md                                   # 项目文档
├── INSTRUCTIONS.md                             # 本文件
├── components/
│   └── ProgrammingLanguageRankings.tsx         # 主视频组件
└── out/
    └── .gitkeep                               # 输出目录
```

## 视频规格

- **文件名**: video.mp4
- **时长**: 30 秒
- **帧率**: 30 fps
- **分辨率**: 1920 x 1080 (Full HD, 16:9)
- **编码**: H.264
- **格式**: MP4

## 数据来源

视频数据基于 TIOBE 编程社区指数的历史排名数据,展示了 2015-2025 年 Top 10 编程语言的流行度变化。

## 故障排除

### 如果 `npm install` 失败

尝试清除 npm 缓存后重试:

```bash
npm cache clean --force
npm install
```

### 如果 `npm run build` 失败

确保已安装所有依赖:

```bash
npm install
```

如果仍有问题,检查 Node.js 版本:

```bash
node --version  # 应该 >= 18.0.0
```

### 如果渲染很慢

这是正常现象,Remotion 需要逐帧渲染:
- 30 秒视频 @ 30fps = 900 帧
- 每帧渲染时间取决于系统性能
- 通常需要 5-10 分钟完成

## 自定义说明

所有可自定义的参数都在 `components/ProgrammingLanguageRankings.tsx` 文件顶部的常量部分:

- `BRAND_COLORS`: 修改颜色
- `TYPOGRAPHY`: 修改字体和字号
- `TIMING`: 修改时间参数
- `LAYOUT`: 修改布局参数
- `RANKING_DATA`: 修改排名数据

## 技术栈

- **框架**: Remotion (基于 React)
- **语言**: TypeScript
- **动画**: Remotion 内置动画函数 (interpolate, spring)
- **样式**: 内联样式对象
