<!-- ═══════════════════════════════════════════════════════════════════════ -->

<div align="center">

# <img src="ref/mode-run.webp"> dsh-ohjingjing-team <img src="ref/mode-eat.webp">

### 用「哦鲸鲸」替换 DSH 智能体团队面板里成员行的状态图标、在会话头部画上会跑会停的鲸鲸，并把子代理下拉里的绿点也换成它

**三块可分别开关的组件**：成员行皮肤与子代理列表是纯 CSS；标题栏跑道读名册与状态，在官方标签行右侧自建一条轨道

[![DSH](https://img.shields.io/badge/DSH-0.2.0--rc.2%20--%200.2.1--alpha.3-blue)](https://github.com/deepseek-ai/deepseek-harness)
[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/spookywaste/dsh-ohjingjing-team)
[![npm](https://img.shields.io/npm/v/dsh-ohjingjing-team?logo=npm&logoColor=white)](https://www.npmjs.com/package/dsh-ohjingjing-team)

**中文** &nbsp;·&nbsp; [**English**](README.en.md)

</div>

---

## 🐳 这是什么

~~创建哦鲸鲸团队~~，用「哦鲸鲸」替换 DSH 智能体团队面板里成员行的状态图标。

<p align="center">
  <img src="ref/panel-live.webp" width="569"><br>
  <sub>哦鲸鲸团队</sub>
</p>

## 🛝 标题栏跑道

会话头部「对话／轨迹」右边那条空白带子变成一条**共用跑道**：主会话+子代理会出现在这里跑步<del><sub>和吃白饭</sub></del>。

<p align="center">
  <img src="ref/header-runway_1.png" width="760"><br>
  <sub>很多哦鲸鲸在跑</sub>
</p>

## 🟢 子代理列表

「N 个子智能体 ▾」下拉里每一行的状态圆点换成哦鲸鲸：

<p align="center">
  <img src="ref/catalog_1.png" width="20%"><br>
  <sub>下拉列表：圆点位置变成鲸鲸，行高与文字排版不变</sub>
</p>

## 🎬 运行中

运行中的哦鲸鲸有4种动画：
<p align="center">
 <img src="ref/mode-run.webp">  <img src="ref/mode-back.webp">  <img src="ref/mode-eat.webp">  <img src="ref/mode-back-eat.webp"> <br>
 <sub>四个运行状态的预览</sub>
</p>

## 🎯 静止中

团队面板（会话页头「智能体团队」浮层）成员行左侧的图标位：


<p align="center">
  <img src="ref/state-sprites.png"><br>
  <sub>四个非运行状态的预览：静止 / 倒立 / 待命 / 完成——后两个是任务圆点的料，目前版本对成员行不生效</sub>
</p>

## 📦 安装
### CLI 安装
```sh
dsh plugin --profile web add dsh-ohjingjing-team          
```
### 网页版/桌面版插件管理安装
插件管理页面，右上角「添加插件」→ 填入插件名 `dsh-ohjingjing-team` 或仓库名
```sh
https://github.com/SpookyWaste/dsh-ohjingjing-team
```
装完刷新 Web GUI，打开一次团队面板即可看到效果；标题栏跑道在会话头部自己出现，不需要额外开关。

**插件管理页里一行一个开关**，默认都开，可以单独关掉，每行显示它自己的名字与一行说明：

| 组件 | 条目名 | 做什么 |
|---|---|---|
| 智能体团队皮肤 | `dsh-ohjingjing-team/skin` | 团队成员行的图标换成哦鲸鲸 |
| 标题栏跑道 | `dsh-ohjingjing-team/runners` | 会话头部标签行右侧的跑道 |
| 子代理列表 | `dsh-ohjingjing-team/catalog` | 「N 个子智能体」下拉行里的圆点 |
| 插件包本身 | `dsh-ohjingjing-team` | 三块组件共用的样式表与跑道运行时 |

#### 依赖
| 项 | 值 |
|---|---|
| DSH | `≥0.2.0-rc.2` |
| 官方智能体团队组件<sub>@deepseek-ai/dsh-experimental-agent-team-profile</sub> | 仅组件1需要，保持开启 |


## 🎛 可调参数

外观参数是 `:root` 上的自定义属性，改它们不需要重新构建（写进用户样式或浏览器覆盖即可）：

| 变量 | 默认 | 说明 |
|---|---|---|
| `--oj-max-size` | `40px` | **皮肤**尺寸上限，防止在极端字号下图标失控。 |
| `--oj-runner-size` | `26px` | **跑道**里鲸鲸的边长（26px 时脚正好压在那条分隔线上）。 |
| `--oj-runners-gap` | `26px` | **跑道**初次出现时相邻两只的槽位间距（满员时按轨道长度自动收窄）。 |
| `--oj-lap-duration` | `60.2s` | **跑道**一圈的时长（60.2s = 86 个走帧循环，步点与走帧同相位；改大改小会按比例改变地面速度）。 |
| `--oj-max-subagents` | `20` | **跑道**最多画多少个**子代理**（lead 之外；DSH 会把历史子代理留在总数里，所以取最新的这些）。 |
| `--oj-catalog-size` | `26px` | **子代理列表**里图标位的边长（官方只有 14×17；放大后行内文字右移 12px，行高不变）。 |
| `--oj-duration` | `0.7s` | **走帧一圈**的时长，步数多的动画自动按比例拉长（三块组件共用）。 |

## 📜 版本

<details>
<summary>版本历史（点击展开）</summary>

- **0.4.1** —— 跑道改成**一条共用轨道**：lead 永远在、跟着最新的 20 个子代理，跑完一圈回起点重生（无 offset）、停下就地站住、按剧本周期性切换动作；新增**子代理列表**组件（下拉行的圆点换成鲸鲸）；`--oj-cruise-scale` 与 `--oj-min-segment` 被 `--oj-lap-duration` 取代。
- **0.4.0** —— 新增**标题栏跑道**组件：会话头部标签行右侧画上子代理，动作与成员行同位次同玩法、位移与动画同步折返；两块组件可分别开关。
- **0.3.0** —— 运行中从「一套七帧跑动」变成**四种**动画。
- **0.2.2** —— 修复帧边缘的**邻帧残留**。
- **0.2.1** —— 修复跑动动画**少播一帧**：关键帧的时间刻度与位置刻度被写成同一套，导致最后一帧的时间区间长度为零。
- **0.2.0** —— 失败态换成**倒立**姿态；运行态从两帧往返改为**七帧循环**。
- **0.1.2** —— 修复失败态素材被裁。
- **0.1.1** —— 修复高 DPI 屏图标发糊，并修复 `error` 状态回落为 `idle`；图标边长默认 28px → 31px（用满两行文字高度，成员卡仍为 51px）。
- **0.1.0** —— 首个版本。

</details>

## 🙏 素材来源与许可

「哦鲸鲸」（ohjingjing）为社区常用名，本名「深深」，形象为 CC BY-NC-SA 授权
- 原鲸鱼娘人设[ZipZipPipe](https://space.bilibili.com/4168597)。 
- 「哦鲸鲸」（深深）形象[这个刀子真甜](https://space.bilibili.com/23315338)。 
- 本仓库代码以 MIT 授权（见 [LICENSE](LICENSE)）。

<!-- ═══════════════════════════════════════════════════════════════════════ -->