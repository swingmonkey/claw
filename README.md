# Programming Language Rankings Video (2015-2025)

这是一个使用 Remotion 创建的 30 秒编程语言流行度变化视频,展示了 2015-2025 年 Top 10 编程语言的排名变化趋势。

## 🎬 视频特性

- **时长**: 30 秒 (900 帧 @ 30fps)
- **分辨率**: 1920x1080 (16:9)
- **数据来源**: TIOBE 编程社区指数
- **风格**: GitHub 暗色主题

### 视频内容

1. **片头 (2s)**: 标题与数据来源
2. **年度排名 (27.5s)**: 动态条形图展示 2015-2025 每年的 Top 10 语言
   - 条形平滑滑动动画
   - 语言品牌色展示
   - 分数计数动画
   - 年份翻页效果
3. **片尾 (0.5s)**: 最终排名与趋势总结

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

或使用设置脚本:

```bash
npm run setup
```

### 2. 预览视频

使用 Remotion Studio 实时预览:

```bash
npm start
```

这将启动一个开发服务器,你可以在浏览器中实时查看视频效果。

### 3. 渲染视频

渲染最终 MP4 文件:

```bash
npm run build
```

视频将输出到 `out/video.mp4`。

## 📁 项目结构

```
.
├── Root.tsx                          # Remotion 根组件
├── index.ts                          # Remotion 入口
├── components/
│   └── ProgrammingLanguageRankings.tsx # 主视频组件
├── remotion.config.ts                # Remotion 配置
├── package.json                      # 项目配置
├── tsconfig.json                     # TypeScript 配置
├── video-storyboard.md               # 详细的分镜脚本
└── README.md                         # 本文件
```

## 🎨 设计系统

### 调色板

- **背景**: GitHub 深色渐变 (#0D1117 → #161B22)
- **文本**: 白色 (#E6EDF3) 和 灰色 (#8B949E)
- **语言品牌色**:
  - Python: #3776AB
  - JavaScript: #F7DF1E
  - Java: #E76F00
  - C: #555555
  - C++: #00599C
  - C#: #512BD4
  - Go: #00ADD8
  - Rust: #DEA584
  - PHP: #777BB4
  - Swift: #FA7343
  - TypeScript: #3178C6

### 字体

- **字体系列**: Inter (无衬线)
- **标题**: 72px, 800 weight
- **副标题**: 48px, 600 weight
- **年份**: 96px, 800 weight, monospace
- **条形标签**: 32px, 600 weight
- **条形数值**: 28px, 500 weight

## 📊 数据说明

视频中的数据基于 TIOBE 编程社区指数的历史数据,涵盖了 2015-2025 年每年的 Top 10 编程语言排名。数据反映了各编程语言在全球范围内的流行度变化趋势。

### 关键趋势

- **Python**: 从 2015 年的第 5 名稳步上升,2018 年起连续 8 年霸榜
- **Java**: 长期占据第 1-2 名,近年有所下滑
- **C**: 保持稳定,长期位于前 3 名
- **C++**: 2023-2025 年强势复苏
- **JavaScript**: 稳定上升,从 2015 年第 7 名上升至前 6 名
- **TypeScript**: 2022 年进入 Top 10,快速崛起

## 🛠️ 自定义

### 修改视频参数

编辑 `Root.tsx` 中的 Composition 配置:

```typescript
<Composition
  id="ProgrammingLanguageRankings"
  component={ProgrammingLanguageRankings}
  durationInFrames={900}  // 视频时长(帧)
  fps={30}                 // 帧率
  width={1920}             // 宽度
  height={1080}            // 高度
/>
```

### 修改数据

编辑 `ProgrammingLanguageRankings.tsx` 中的 `RANKING_DATA` 对象来修改每年的排名数据。

### 修改样式

组件顶部定义了所有样式常量:

- `BRAND_COLORS`: 颜色配置
- `TYPOGRAPHY`: 字体配置
- `TIMING`: 时间配置
- `LAYOUT`: 布局配置

## 📝 注意事项

- 首次运行需要安装依赖,可能需要几分钟
- 渲染完整视频可能需要 5-10 分钟,取决于系统性能
- 确保 Node.js 版本 >= 18.0.0

## 📄 许可证

ISC

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!
