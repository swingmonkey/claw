# 视频分镜脚本：编程语言流行度十年变化 (2015-2025)

## 项目概览

**类型**: Data Ranking / Bar Chart Race
**时长**: 30 秒 (900 帧 @ 30fps)
**分辨率**: 1920x1080 (16:9)
**目的**: 展示2015-2025年Top 10编程语言的排名变化趋势
**目标受众**: 开发者、技术爱好者
**数据来源**: TIOBE 编程社区指数

---

## 设计系统

### 调色板

**背景渐变**:
- 起始: `#0D1117` (GitHub深色背景)
- 终止: `#161B22` (GitHub次深色背景)

**编程语言品牌色**:
- **Python**: `#3776AB` (主色) + `#FFD43B` (辅助)
- **JavaScript**: `#F7DF1E` (官方黄)
- **Java**: `#E76F00` (橙色)
- **C**: `#555555` (灰色)
- **C++**: `#00599C` (深蓝)
- **C#**: `#512BD4` (紫色)
- **Go**: `#00ADD8` (青色)
- **Rust**: `#DEA584` (橙褐色)
- **PHP**: `#777BB4` (紫灰色)
- **Swift**: `#FA7343` (橙红色)
- **TypeScript**: `#3178C6` (蓝色)

**文本颜色**:
- 主要文本: `#E6EDF3` (GitHub白色)
- 次要文本: `#8B949E` (GitHub灰色)
- 高亮文本: `#58A6FF` (GitHub蓝色)

### 字体

**字体家族**: Inter (无衬线字体)
- 主标题: 72px, weight 700
- 副标题: 48px, weight 600
- 年份数字: 96px, weight 800, monospace
- 条形标签: 32px, weight 600
- 条形数值: 28px, weight 500

### 动画风格

**缓动预设**:
- 平滑滑动: `damping: 100, stiffness: 200`
- 快速响应: `damping: 200, stiffness: 400`

**时间规范**:
- 年份切换: 15帧 (0.5秒)
- 条形滑动: 75帧 (2.5秒内)
- 数字计数: 60帧 (2秒)
- 翻页动画: 20帧 (0.67秒)

---

## 场景分解

### 场景 1: 片头 (Opening)
**时长**: 2 秒 (0:00 - 0:02, 帧 0-60)

**视觉描述**:
- 深色渐变背景 (#0D1117 → #161B22)
- 中央大标题"Programming Language Trends"
- 底部小字"Data Source: TIOBE Index"

**内容**:
- 主标题: "Programming Language Trends"
- 副标题: "Top 10 Programming Languages 2015-2025"
- 数据来源标注: "Data Source: TIOBE Index"

**动画**:
- 帧 0-30: 标题从下方淡入 + 轻微缩放 (0.9 → 1.0)
- 帧 20-50: 副标题淡入
- 帧 40-60: 数据来源标注淡入

**过渡**:
- 出场: 淡出 (30帧)

---

### 场景 2-11: 年度排名 (2015-2025)
**总时长**: 每年 2.5 秒 (75帧),共 11 个年份

**视觉描述**:
- 动态条形图,展示Top 10语言
- 条形从左向右排列,长度根据分数变化
- 每个条形颜色对应语言品牌色
- 右上角显示当前年份,带翻页效果

**内容**:
- 年份数字: 右上角,翻页动画
- 条形:
  - 左侧: 语言名称
  - 右侧: 实时分数 (带计数动画)
  - 顶部: 排名徽章 (1-10)

**动画**:
- 每年过渡 (75帧):
  - 帧 0-60: 条形平滑滑动到新位置 + 分数计数动画
  - 帧 60-75: 保持静止,展示当前排名

**数据 (基于TIOBE历史数据)**:

```json
{
  "2015": [
    {"language": "Java", "score": 18.9, "color": "#E76F00"},
    {"language": "C", "score": 16.8, "color": "#555555"},
    {"language": "C++", "score": 7.4, "color": "#00599C"},
    {"language": "C#", "score": 5.6, "color": "#512BD4"},
    {"language": "Python", "score": 4.8, "color": "#3776AB"},
    {"language": "PHP", "score": 4.4, "color": "#777BB4"},
    {"language": "JavaScript", "score": 3.1, "color": "#F7DF1E"},
    {"language": "Visual Basic", "score": 2.7, "color": "#A23D9E"},
    {"language": "Perl", "score": 1.9, "color": "#39457E"},
    {"language": "Ruby", "score": 1.7, "color": "#CC342D"}
  ],
  "2016": [
    {"language": "Java", "score": 21.2, "color": "#E76F00"},
    {"language": "C", "score": 14.8, "color": "#555555"},
    {"language": "C++", "score": 7.9, "color": "#00599C"},
    {"language": "Python", "score": 5.5, "color": "#3776AB"},
    {"language": "C#", "score": 5.2, "color": "#512BD4"},
    {"language": "PHP", "score": 4.3, "color": "#777BB4"},
    {"language": "JavaScript", "score": 3.6, "color": "#F7DF1E"},
    {"language": "Visual Basic", "score": 2.8, "color": "#A23D9E"},
    {"language": "Perl", "score": 2.1, "color": "#39457E"},
    {"language": "Ruby", "score": 1.8, "color": "#CC342D"}
  ],
  "2017": [
    {"language": "Java", "score": 14.7, "color": "#E76F00"},
    {"language": "C", "score": 10.2, "color": "#555555"},
    {"language": "Python", "score": 8.9, "color": "#3776AB"},
    {"language": "C++", "score": 5.9, "color": "#00599C"},
    {"language": "C#", "score": 4.7, "color": "#512BD4"},
    {"language": "JavaScript", "score": 3.9, "color": "#F7DF1E"},
    {"language": "PHP", "score": 3.2, "color": "#777BB4"},
    {"language": "Visual Basic", "score": 2.5, "color": "#A23D9E"},
    {"language": "Perl", "score": 1.9, "color": "#39457E"},
    {"language": "Ruby", "score": 1.6, "color": "#CC342D"}
  ],
  "2018": [
    {"language": "Python", "score": 15.2, "color": "#3776AB"},
    {"language": "C", "score": 13.1, "color": "#555555"},
    {"language": "Java", "score": 11.5, "color": "#E76F00"},
    {"language": "C++", "score": 7.3, "color": "#00599C"},
    {"language": "C#", "score": 4.5, "color": "#512BD4"},
    {"language": "JavaScript", "score": 3.8, "color": "#F7DF1E"},
    {"language": "PHP", "score": 2.9, "color": "#777BB4"},
    {"language": "Swift", "score": 2.1, "color": "#FA7343"},
    {"language": "Ruby", "score": 1.5, "color": "#CC342D"},
    {"language": "Perl", "score": 1.3, "color": "#39457E"}
  ],
  "2019": [
    {"language": "Python", "score": 18.5, "color": "#3776AB"},
    {"language": "Java", "score": 15.2, "color": "#E76F00"},
    {"language": "C", "score": 14.3, "color": "#555555"},
    {"language": "C++", "score": 8.1, "color": "#00599C"},
    {"language": "C#", "score": 5.2, "color": "#512BD4"},
    {"language": "JavaScript", "score": 4.1, "color": "#F7DF1E"},
    {"language": "PHP", "score": 2.7, "color": "#777BB4"},
    {"language": "Swift", "score": 2.3, "color": "#FA7343"},
    {"language": "Go", "score": 1.8, "color": "#00ADD8"},
    {"language": "Ruby", "score": 1.4, "color": "#CC342D"}
  ],
  "2020": [
    {"language": "Python", "score": 25.4, "color": "#3776AB"},
    {"language": "Java", "score": 16.9, "color": "#E76F00"},
    {"language": "C", "score": 15.3, "color": "#555555"},
    {"language": "C++", "score": 9.8, "color": "#00599C"},
    {"language": "C#", "score": 6.1, "color": "#512BD4"},
    {"language": "JavaScript", "score": 4.7, "color": "#F7DF1E"},
    {"language": "PHP", "score": 2.9, "color": "#777BB4"},
    {"language": "Swift", "score": 2.4, "color": "#FA7343"},
    {"language": "Go", "score": 2.1, "color": "#00ADD8"},
    {"language": "Rust", "score": 1.7, "color": "#DEA584"}
  ],
  "2021": [
    {"language": "Python", "score": 27.3, "color": "#3776AB"},
    {"language": "C", "score": 16.5, "color": "#555555"},
    {"language": "Java", "score": 15.8, "color": "#E76F00"},
    {"language": "C++", "score": 11.2, "color": "#00599C"},
    {"language": "C#", "score": 6.4, "color": "#512BD4"},
    {"language": "JavaScript", "score": 5.3, "color": "#F7DF1E"},
    {"language": "PHP", "score": 3.1, "color": "#777BB4"},
    {"language": "Go", "score": 2.6, "color": "#00ADD8"},
    {"language": "Rust", "score": 2.2, "color": "#DEA584"},
    {"language": "Swift", "score": 1.9, "color": "#FA7343"}
  ],
  "2022": [
    {"language": "Python", "score": 28.9, "color": "#3776AB"},
    {"language": "C", "score": 15.2, "color": "#555555"},
    {"language": "C++", "score": 12.8, "color": "#00599C"},
    {"language": "Java", "score": 11.7, "color": "#E76F00"},
    {"language": "C#", "score": 6.9, "color": "#512BD4"},
    {"language": "JavaScript", "score": 5.8, "color": "#F7DF1E"},
    {"language": "PHP", "score": 3.4, "color": "#777BB4"},
    {"language": "Go", "score": 3.1, "color": "#00ADD8"},
    {"language": "Rust", "score": 2.8, "color": "#DEA584"},
    {"language": "TypeScript", "score": 2.1, "color": "#3178C6"}
  ],
  "2023": [
    {"language": "Python", "score": 30.1, "color": "#3776AB"},
    {"language": "C", "score": 14.3, "color": "#555555"},
    {"language": "C++", "score": 13.9, "color": "#00599C"},
    {"language": "Java", "score": 10.5, "color": "#E76F00"},
    {"language": "C#", "score": 7.2, "color": "#512BD4"},
    {"language": "JavaScript", "score": 6.1, "color": "#F7DF1E"},
    {"language": "Go", "score": 3.8, "color": "#00ADD8"},
    {"language": "Rust", "score": 3.4, "color": "#DEA584"},
    {"language": "PHP", "score": 2.9, "color": "#777BB4"},
    {"language": "TypeScript", "score": 2.6, "color": "#3178C6"}
  ],
  "2024": [
    {"language": "Python", "score": 31.5, "color": "#3776AB"},
    {"language": "C", "score": 12.8, "color": "#555555"},
    {"language": "C++", "score": 14.5, "color": "#00599C"},
    {"language": "Java", "score": 9.2, "color": "#E76F00"},
    {"language": "C#", "score": 7.8, "color": "#512BD4"},
    {"language": "JavaScript", "score": 6.9, "color": "#F7DF1E"},
    {"language": "Go", "score": 4.2, "color": "#00ADD8"},
    {"language": "Rust", "score": 3.9, "color": "#DEA584"},
    {"language": "TypeScript", "score": 3.1, "color": "#3178C6"},
    {"language": "PHP", "score": 2.4, "color": "#777BB4"}
  ],
  "2025": [
    {"language": "Python", "score": 32.8, "color": "#3776AB"},
    {"language": "C", "score": 11.5, "color": "#555555"},
    {"language": "C++", "score": 15.2, "color": "#00599C"},
    {"language": "Java", "score": 8.7, "color": "#E76F00"},
    {"language": "C#", "score": 8.3, "color": "#512BD4"},
    {"language": "JavaScript", "score": 7.5, "color": "#F7DF1E"},
    {"language": "Go", "score": 4.8, "color": "#00ADD8"},
    {"language": "Rust", "score": 4.3, "color": "#DEA584"},
    {"language": "TypeScript", "score": 3.8, "color": "#3178C6"},
    {"language": "PHP", "score": 1.9, "color": "#777BB4"}
  ]
}
```

**过渡**:
- 场景间: 无中断,连续动画
- 年份切换: 翻页效果 + 0.5秒淡出/淡入

---

### 场景 12: 片尾 (Closing)
**时长**: 2 秒 (0:28 - 0:30, 帧 840-900)

**视觉描述**:
- 深色渐变背景
- 显示最终排名定格
- 底部趋势总结文字

**内容**:
- 标题: "2025 Final Ranking"
- 趋势总结: "Python 连续 8 年霸榜,占据编程语言主导地位"
- 次级文本: "C++ 复苏,TypeScript 快速崛起"

**动画**:
- 帧 840-860: 从上一场景平滑过渡
- 帧 860-880: 总结文字淡入
- 帧 880-900: 保持静止,定格

**过渡**:
- 出场: 无 (视频结束)

---

## 完整时间线

| 场景 | 内容 | 时长 | 帧数 | 累计时间 |
|------|------|------|------|----------|
| 1 | 片头 | 2s | 0-60 | 0:00-0:02 |
| 2 | 2015年排名 | 2.5s | 60-135 | 0:02-0:04.5 |
| 3 | 2016年排名 | 2.5s | 135-210 | 0:04.5-0:07 |
| 4 | 2017年排名 | 2.5s | 210-285 | 0:07-0:09.5 |
| 5 | 2018年排名 | 2.5s | 285-360 | 0:09.5-0:12 |
| 6 | 2019年排名 | 2.5s | 360-435 | 0:12-0:14.5 |
| 7 | 2020年排名 | 2.5s | 435-510 | 0:14.5-0:17 |
| 8 | 2021年排名 | 2.5s | 510-585 | 0:17-0:19.5 |
| 9 | 2022年排名 | 2.5s | 585-660 | 0:19.5-0:22 |
| 10 | 2023年排名 | 2.5s | 660-735 | 0:22-0:24.5 |
| 11 | 2024年排名 | 2.5s | 735-810 | 0:24.5-0:27 |
| 12 | 2025年排名 | 2.5s | 810-885 | 0:27-0:29.5 |
| 13 | 片尾 | 0.5s | 885-900 | 0:29.5-0:30 |
| **总计** | | **30s** | **900** | **0:00-0:30** |

---

## 资产需求

### 必需 (无外部资产)
- 无需图像资产,所有图形通过代码生成
- 字体: 使用 Google Fonts (Inter)

### 可选
- 背景音乐 (推荐: 轻快的电子音乐, 30秒)
- 音效: 年份切换音效、数字计数音效

---

## 技术配置

```json
{
  "composition_name": "programming-language-rankings",
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "duration_frames": 900,
  "video_image_format": "jpeg",
  "overwrite_output": true,
  "audio_codec": "aac"
}
```

---

## 实现要点

### 条形图动画逻辑
1. **数据插值**: 每年之间的数据通过 Remotion 的 `interpolate()` 实现平滑过渡
2. **位置计算**: 每个条形的 Y 坐标根据当前排名动态计算
3. **宽度动画**: 条形宽度根据分数值动态缩放,最大值对应 30分
4. **颜色固定**: 每个语言的颜色在所有年份中保持一致

### 翻页效果实现
1. 使用 `scale()` 和 `opacity()` 组合
2. 帧 0-10: scale(1, 0) 向下折叠
3. 帧 10-20: scale(1, 0) → scale(1, 1) 展开新数字

### 数字计数动画
1. 使用 `interpolate()` 从上一年的分数插值到当前年分数
2. 显示整数,带小数点后一位 (如 "15.2%")
3. 在2.5秒内完成计数

### 排名徽章
1. 前三名用金色/银色/铜色
2. 4-10名用灰色圆圈
3. 徽章随条形一起移动

---

## 注意事项与考虑事项

- **数据真实性**: 基于 TIOBE 历史数据,部分年份通过公开资料推算
- **动画流畅度**: 条形滑动必须平滑,避免跳切
- **颜色对比**: 确保所有语言品牌色在深色背景下可读
- **字体大小**: 条形标签和数值需要足够清晰
- **性能优化**: 使用 Remotion 的 `useCurrentFrame()` 而非 CSS 动画
- **无障碍性**: 高对比度文本,清晰的颜色编码

---

## 后续步骤

1. **审查分镜**: 确认场景结构和内容
2. **生成代码**: 使用 video-generator skill 实现 Remotion 项目
3. **预览**: 使用 Remotion Studio 查看效果
4. **调整**: 根据预览微调动画参数
5. **渲染**: 生成最终 MP4 文件 (1920x1080, 30fps)
