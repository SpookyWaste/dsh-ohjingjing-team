/**
 * dsh-ohjingjing-team 的浏览器束。
 *
 * 本文件由 tools/gen-client.mjs 生成，不要手改；要改行为请改 tools/styles.mjs、
 * tools/client-runtime.js 或 tools/gen-client.mjs，然后重跑 `npm run build`。
 *
 * 束契约（三条都是硬约束，违反会波及其他插件）：
 *
 * 1. **不含顶层 import/export**。宿主把同一批插件的束用字符串拼接成一个经典脚本
 *    （`dsh-client-modules` 的 `buildComboScript`），拼接结果里任何一个顶层
 *    `export` 或 `import` 都会让整批脚本语法错误——同批的其他插件会跟着起不来。
 * 2. **顶层声明不外泄**。同批所有束共享一个脚本作用域，顶层 `const`/`function`
 *    会互相覆盖。所以整段代码包进 IIFE，只把注册动作交给
 *    `window.__ModuleLoader__.load`。
 * 3. **只能 require 外壳种子词**（`react`、`react/jsx-runtime`、
 *    `@deepseek-ai/dsh-client-ui-primitives` 等九个平台单例），其余一切都拿不到。
 *
 * 本插件贡献三块**可分别开关**的组件，共用这一条束：
 *
 * | 组件 | 客户端做什么 | 服务端 |
 * |---|---|---|
 * | 状态皮肤 | 注入一份样式表，把团队成员行的图标换成「哦鲸鲸」 | 托管素材路由 |
 * | 标题栏跑道 | 往 `conversation.session.header.actions` 挂一条同槽条目，在标签行右侧画鲸鲸 | 托管素材路由 + 组件清单 |
 * | 子代理列表 | 注入一份样式表，把下拉行里的状态圆点换成鲸鲸 | 托管素材路由 + 组件清单 |
 *
 * 三块都由 `GET /ohjingjing-team/components.json` 门控：宿主半区按**实际活跃的 entry** 算出清单，
 * 所以插件管理页里的开关在运行期就生效（重新聚焦页面时重探一次），不必刷新。
 */

// @ts-nocheck —— 本文件是交给浏览器的纯 JavaScript：不带类型标注，
// 形态正确性由 scripts/verify-client-bundle.mjs 与 test-bundle.mjs 保障。
(function () {
  /** 浏览器模块 id；必须等于包名，否则 boot 图匹配不上。 */
  const BUNDLE_ID = 'dsh-ohjingjing-team'

  /** 组件能力清单；宿主半区在同一条前缀路由上应答它。 */
  const COMPONENTS_URL = '/ohjingjing-team/components.json'

  /** 官方标签行的标记；跑道按它定位（官方没有给这个位置任何槽位）。 */
  const TABS_SELECTOR = '[data-conversation-tabs]'

  /** 跑道挂进官方槽位的键与条目 id。 */
  const SLOT_KEY = 'conversation.session.header.actions'
  const SLOT_ENTRY_ID = 'ohjingjing-team-runners'

  /** 三块样式表各自的 style 标签标记，供卸载时精确定位与分开撤销。 */
  const SKIN_STYLE_ID = 'dsh-ohjingjing-team/ohjingjing.module.css'
  const RUNNER_STYLE_ID = 'dsh-ohjingjing-team/ohjingjing-runway.module.css'
  const CATALOG_STYLE_ID = 'dsh-ohjingjing-team/ohjingjing-catalog.module.css'

  /** 由 tools/gen-client.mjs 生成的样式表；图片 URL 由宿主半区的同名前缀路由托管。 */
  const SKIN_STYLESHEET = '/* dsh-ohjingjing-team：由客户端束在运行时注入，勿手工编辑。 */\n/* 作用域：除 :root 变量外，所有规则都以 [data-team-panel] 为祖先。 */\n/*!oj:root-params*/ /* 可调参数：图标边长、上限与一圈的时长；--oj-icon 给一个不依赖任何其他变量的初值 */\n:root {\n  --oj-size: 31px;\n  --oj-max-size: 40px;\n  --oj-duration: 0.7s;\n  --oj-icon: 31px;\n}\n/*!oj:art-idle-1*/ /* idle 的 1× 素材 URL */\n:root {\n  --oj-art-idle-1: url("/ohjingjing-team/idle.113c758413.png");\n}\n/*!oj:art-idle-2*/ /* idle 的 2× 素材 URL */\n:root {\n  --oj-art-idle-2: url("/ohjingjing-team/idle@2x.4b67b106af.png");\n}\n/*!oj:art-idle-3*/ /* idle 的 3× 素材 URL */\n:root {\n  --oj-art-idle-3: url("/ohjingjing-team/idle@3x.11fe7373fd.png");\n}\n/*!oj:art-error-1*/ /* error 的 1× 素材 URL */\n:root {\n  --oj-art-error-1: url("/ohjingjing-team/error.2a9dafb2b4.png");\n}\n/*!oj:art-error-2*/ /* error 的 2× 素材 URL */\n:root {\n  --oj-art-error-2: url("/ohjingjing-team/error@2x.98bd36f5f5.png");\n}\n/*!oj:art-error-3*/ /* error 的 3× 素材 URL */\n:root {\n  --oj-art-error-3: url("/ohjingjing-team/error@3x.0aa62a0773.png");\n}\n/*!oj:art-warning-1*/ /* warning 的 1× 素材 URL */\n:root {\n  --oj-art-warning-1: url("/ohjingjing-team/warning.7cf6302367.png");\n}\n/*!oj:art-warning-2*/ /* warning 的 2× 素材 URL */\n:root {\n  --oj-art-warning-2: url("/ohjingjing-team/warning@2x.9188218fbd.png");\n}\n/*!oj:art-warning-3*/ /* warning 的 3× 素材 URL */\n:root {\n  --oj-art-warning-3: url("/ohjingjing-team/warning@3x.9ae5c8a552.png");\n}\n/*!oj:art-done-1*/ /* done 的 1× 素材 URL */\n:root {\n  --oj-art-done-1: url("/ohjingjing-team/done.f19c69e059.png");\n}\n/*!oj:art-done-2*/ /* done 的 2× 素材 URL */\n:root {\n  --oj-art-done-2: url("/ohjingjing-team/done@2x.3bcc51f79b.png");\n}\n/*!oj:art-done-3*/ /* done 的 3× 素材 URL */\n:root {\n  --oj-art-done-3: url("/ohjingjing-team/done@3x.b0b07a82d4.png");\n}\n/*!oj:art-mode-sheet-1*/ /* mode-sheet 的 1× 素材 URL */\n:root {\n  --oj-art-mode-sheet-1: url("/ohjingjing-team/mode-sheet.aa677855dc.png");\n}\n/*!oj:art-mode-sheet-2*/ /* mode-sheet 的 2× 素材 URL */\n:root {\n  --oj-art-mode-sheet-2: url("/ohjingjing-team/mode-sheet@2x.da97da3f8d.png");\n}\n/*!oj:art-mode-sheet-3*/ /* mode-sheet 的 3× 素材 URL */\n:root {\n  --oj-art-mode-sheet-3: url("/ohjingjing-team/mode-sheet@3x.b48da35023.png");\n}\n/* ── 兜底、状态选图与运行态 ─────────────────────────────────── */\n/*!oj:dot*/ /* 尺寸取配置值与上限的较小者；未匹配任何状态宿主时落兜底图 */\n[data-team-panel] [class*="_memberDot"] {\n  box-sizing: border-box;\n  --oj-icon: min(var(--oj-size, 31px), var(--oj-max-size, 40px));\n  width: var(--oj-icon, 31px) !important;\n  height: var(--oj-icon, 31px) !important;\n  background-repeat: no-repeat;\n  background-position: 50% 50%;\n  background-size: contain;\n  --oj-run: none;\n  --oj-art: var(--oj-art-idle-1);\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/idle.113c758413.png") 1x, url("/ohjingjing-team/idle@2x.4b67b106af.png") 2x, url("/ohjingjing-team/idle@3x.11fe7373fd.png") 3x);\n}\n/*!oj:state-idle-art*/ /* idle：命中宿主 > svg:not([data-state]) 时选图 */\n[data-team-panel] [class*="_memberDot"]:has(> svg:not([data-state])) {\n  --oj-art: var(--oj-art-idle-1);\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/idle.113c758413.png") 1x, url("/ohjingjing-team/idle@2x.4b67b106af.png") 2x, url("/ohjingjing-team/idle@3x.11fe7373fd.png") 3x);\n}\n/*!oj:state-error-art*/ /* error：命中宿主 > span[data-state="error"] 时选图 */\n[data-team-panel] [class*="_memberDot"]:has(> span[data-state="error"]) {\n  --oj-art: var(--oj-art-error-1);\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/error.2a9dafb2b4.png") 1x, url("/ohjingjing-team/error@2x.98bd36f5f5.png") 2x, url("/ohjingjing-team/error@3x.0aa62a0773.png") 3x);\n}\n/*!oj:state-warning-art*/ /* warning：命中宿主 > span[data-state="warning"] 时选图 */\n[data-team-panel] [class*="_memberDot"]:has(> span[data-state="warning"]) {\n  --oj-art: var(--oj-art-warning-1);\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/warning.7cf6302367.png") 1x, url("/ohjingjing-team/warning@2x.9188218fbd.png") 2x, url("/ohjingjing-team/warning@3x.9ae5c8a552.png") 3x);\n}\n/*!oj:state-done-art*/ /* done：命中宿主 > span[data-state="done"] 时选图 */\n[data-team-panel] [class*="_memberDot"]:has(> span[data-state="done"]) {\n  --oj-art: var(--oj-art-done-1);\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/done.f19c69e059.png") 1x, url("/ohjingjing-team/done@2x.3bcc51f79b.png") 2x, url("/ohjingjing-team/done@3x.b0b07a82d4.png") 3x);\n}\n/*!oj:running-art*/ /* 运行态：8 列 × 3 行玩法精灵图 */\n[data-team-panel] [class*="_memberDot"]:has(> svg[data-state="ongoing"]) {\n  --oj-art: var(--oj-art-mode-sheet-1);\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/mode-sheet.aa677855dc.png") 1x, url("/ohjingjing-team/mode-sheet@2x.da97da3f8d.png") 2x, url("/ohjingjing-team/mode-sheet@3x.b48da35023.png") 3x);\n}\n/* ── :has() 可用：官方图标让位，运行态交给伪元素播玩法 ─────────── */\n@supports selector(:has(*)) {\n  /*!oj:hide-official*/ /* 让官方图标不可见但保留占位，避免容器塌陷与文字左移 */\n  [data-team-panel] [class*="_memberDot"] > svg,\n[data-team-panel] [class*="_memberDot"] > span[data-state] {\n    visibility: hidden !important;\n  }\n  /*!oj:running-box-relative*/ /* 运行态容器：承载绝对定位的伪元素 */\n  [data-team-panel] [class*="_memberDot"]:has(> svg[data-state="ongoing"]) {\n    position: relative;\n    background-image: none;\n    overflow: visible;\n  }\n  /*!oj:running-frames*/ /* 运行态默认玩法（正常跑）8 步：background-position 逐格步进 */\n  [data-team-panel] [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before {\n    content: "";\n    position: absolute;\n    inset: 0;\n    pointer-events: none;\n    background-repeat: no-repeat;\n    /* 整张图放大到 8 列 × 3 行，一格一个姿态，靠 background-position 逐格切换 */\n    background-size: 800% 300%;\n    background-position: 0% 0%;\n    background-image: var(--oj-art);\n    background-image: image-set(url("/ohjingjing-team/mode-sheet.aa677855dc.png") 1x, url("/ohjingjing-team/mode-sheet@2x.da97da3f8d.png") 2x, url("/ohjingjing-team/mode-sheet@3x.b48da35023.png") 3x);\n    animation: oj-run-pos var(--oj-duration) step-end infinite;\n  }\n  /*!oj:mode-back*/ /* 玩法「左右来回跑」：位次 2、8、11、16，56 步 */\n  [data-team-panel] [class*="_roster"] > :nth-child(2) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(8) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(11) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(16) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before {\n    animation: oj-back-pos calc(var(--oj-duration) * 56 / 7) step-end infinite, oj-back-flip calc(var(--oj-duration) * 56 / 7) step-end infinite;\n  }\n  /*!oj:mode-eat*/ /* 玩法「吃饭」：位次 3、5、12、14，6 步 */\n  [data-team-panel] [class*="_roster"] > :nth-child(3) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(5) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(12) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(14) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before {\n    animation: oj-eat-pos var(--oj-duration) step-end infinite;\n  }\n  /*!oj:mode-backEat*/ /* 玩法「左右来回跑 3 圈 + 吃 1 圈」：位次 4、7、9、15，27 步 */\n  [data-team-panel] [class*="_roster"] > :nth-child(4) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(7) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(9) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(15) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before {\n    animation: oj-backEat-pos calc(var(--oj-duration) * 27 / 7) step-end infinite, oj-backEat-flip calc(var(--oj-duration) * 27 / 7) step-end infinite;\n  }\n  /* 正常跑：8 步（1 圈 × 8 帧） */\n  @keyframes oj-run-pos {\n    0% { background-position: 0% 0%; }\n    12.5% { background-position: 14.2857% 0%; }\n    25% { background-position: 28.5714% 0%; }\n    37.5% { background-position: 42.8571% 0%; }\n    50% { background-position: 57.1429% 0%; }\n    62.5% { background-position: 71.4286% 0%; }\n    75% { background-position: 85.7143% 0%; }\n    87.5% { background-position: 100% 0%; }\n    100% { background-position: 0% 0%; }\n  }\n  /* 左右来回跑：56 步（4 圈 × 7 帧 + 4 圈 × 7 帧 镜像） */\n  @keyframes oj-back-pos {\n    0% { background-position: 0% 50%; }\n    1.7857% { background-position: 14.2857% 50%; }\n    3.5714% { background-position: 28.5714% 50%; }\n    5.3571% { background-position: 42.8571% 50%; }\n    7.1429% { background-position: 57.1429% 50%; }\n    8.9286% { background-position: 71.4286% 50%; }\n    10.7143% { background-position: 85.7143% 50%; }\n    12.5% { background-position: 0% 50%; }\n    14.2857% { background-position: 14.2857% 50%; }\n    16.0714% { background-position: 28.5714% 50%; }\n    17.8571% { background-position: 42.8571% 50%; }\n    19.6429% { background-position: 57.1429% 50%; }\n    21.4286% { background-position: 71.4286% 50%; }\n    23.2143% { background-position: 85.7143% 50%; }\n    25% { background-position: 0% 50%; }\n    26.7857% { background-position: 14.2857% 50%; }\n    28.5714% { background-position: 28.5714% 50%; }\n    30.3571% { background-position: 42.8571% 50%; }\n    32.1429% { background-position: 57.1429% 50%; }\n    33.9286% { background-position: 71.4286% 50%; }\n    35.7143% { background-position: 85.7143% 50%; }\n    37.5% { background-position: 0% 50%; }\n    39.2857% { background-position: 14.2857% 50%; }\n    41.0714% { background-position: 28.5714% 50%; }\n    42.8571% { background-position: 42.8571% 50%; }\n    44.6429% { background-position: 57.1429% 50%; }\n    46.4286% { background-position: 71.4286% 50%; }\n    48.2143% { background-position: 85.7143% 50%; }\n    50% { background-position: 0% 50%; }\n    51.7857% { background-position: 14.2857% 50%; }\n    53.5714% { background-position: 28.5714% 50%; }\n    55.3571% { background-position: 42.8571% 50%; }\n    57.1429% { background-position: 57.1429% 50%; }\n    58.9286% { background-position: 71.4286% 50%; }\n    60.7143% { background-position: 85.7143% 50%; }\n    62.5% { background-position: 0% 50%; }\n    64.2857% { background-position: 14.2857% 50%; }\n    66.0714% { background-position: 28.5714% 50%; }\n    67.8571% { background-position: 42.8571% 50%; }\n    69.6429% { background-position: 57.1429% 50%; }\n    71.4286% { background-position: 71.4286% 50%; }\n    73.2143% { background-position: 85.7143% 50%; }\n    75% { background-position: 0% 50%; }\n    76.7857% { background-position: 14.2857% 50%; }\n    78.5714% { background-position: 28.5714% 50%; }\n    80.3571% { background-position: 42.8571% 50%; }\n    82.1429% { background-position: 57.1429% 50%; }\n    83.9286% { background-position: 71.4286% 50%; }\n    85.7143% { background-position: 85.7143% 50%; }\n    87.5% { background-position: 0% 50%; }\n    89.2857% { background-position: 14.2857% 50%; }\n    91.0714% { background-position: 28.5714% 50%; }\n    92.8571% { background-position: 42.8571% 50%; }\n    94.6429% { background-position: 57.1429% 50%; }\n    96.4286% { background-position: 71.4286% 50%; }\n    98.2143% { background-position: 85.7143% 50%; }\n    100% { background-position: 0% 0%; }\n  }\n  @keyframes oj-back-flip {\n    0% { transform: scaleX(1); }\n    50% { transform: scaleX(-1); }\n    100% { transform: scaleX(1); }\n  }\n  /* 吃饭：6 步（1 圈 × 6 帧） */\n  @keyframes oj-eat-pos {\n    0% { background-position: 0% 100%; }\n    16.6667% { background-position: 14.2857% 100%; }\n    33.3333% { background-position: 28.5714% 100%; }\n    50% { background-position: 42.8571% 100%; }\n    66.6667% { background-position: 57.1429% 100%; }\n    83.3333% { background-position: 71.4286% 100%; }\n    100% { background-position: 0% 0%; }\n  }\n  /* 左右来回跑 3 圈 + 吃 1 圈：27 步（2 圈 × 7 帧 + 1 圈 × 7 帧 镜像 + 1 圈 × 6 帧） */\n  @keyframes oj-backEat-pos {\n    0% { background-position: 0% 50%; }\n    3.7037% { background-position: 14.2857% 50%; }\n    7.4074% { background-position: 28.5714% 50%; }\n    11.1111% { background-position: 42.8571% 50%; }\n    14.8148% { background-position: 57.1429% 50%; }\n    18.5185% { background-position: 71.4286% 50%; }\n    22.2222% { background-position: 85.7143% 50%; }\n    25.9259% { background-position: 0% 50%; }\n    29.6296% { background-position: 14.2857% 50%; }\n    33.3333% { background-position: 28.5714% 50%; }\n    37.037% { background-position: 42.8571% 50%; }\n    40.7407% { background-position: 57.1429% 50%; }\n    44.4444% { background-position: 71.4286% 50%; }\n    48.1481% { background-position: 85.7143% 50%; }\n    51.8519% { background-position: 0% 50%; }\n    55.5556% { background-position: 14.2857% 50%; }\n    59.2593% { background-position: 28.5714% 50%; }\n    62.963% { background-position: 42.8571% 50%; }\n    66.6667% { background-position: 57.1429% 50%; }\n    70.3704% { background-position: 71.4286% 50%; }\n    74.0741% { background-position: 85.7143% 50%; }\n    77.7778% { background-position: 0% 100%; }\n    81.4815% { background-position: 14.2857% 100%; }\n    85.1852% { background-position: 28.5714% 100%; }\n    88.8889% { background-position: 42.8571% 100%; }\n    92.5926% { background-position: 57.1429% 100%; }\n    96.2963% { background-position: 71.4286% 100%; }\n    100% { background-position: 0% 0%; }\n  }\n  @keyframes oj-backEat-flip {\n    0% { transform: scaleX(1); }\n    51.8519% { transform: scaleX(-1); }\n    77.7778% { transform: scaleX(1); }\n    100% { transform: scaleX(1); }\n  }\n  /* 与官方口径一致：用户要求减弱动效时停在第一帧 */\n  @media (prefers-reduced-motion: reduce) {\n    /*!oj:running-reduced*/ /* 减弱动效：默认玩法（正常跑）停在第一帧 */\n    [data-team-panel] [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before {\n      animation: none;\n      background-position: 0% 0%;\n    }\n    /*!oj:mode-back-reduced*/ /* 减弱动效：玩法「左右来回跑」停在第一帧 */\n    [data-team-panel] [class*="_roster"] > :nth-child(2) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(8) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(11) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(16) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before {\n      animation: none;\n      background-position: 0% 50%;\n    }\n    /*!oj:mode-eat-reduced*/ /* 减弱动效：玩法「吃饭」停在第一帧 */\n    [data-team-panel] [class*="_roster"] > :nth-child(3) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(5) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(12) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(14) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before {\n      animation: none;\n      background-position: 0% 100%;\n    }\n    /*!oj:mode-backEat-reduced*/ /* 减弱动效：玩法「左右来回跑 3 圈 + 吃 1 圈」停在第一帧 */\n    [data-team-panel] [class*="_roster"] > :nth-child(4) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(7) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(9) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before,\n[data-team-panel] [class*="_roster"] > :nth-child(15) [class*="_memberDot"]:has(> svg[data-state="ongoing"])::before {\n      animation: none;\n      background-position: 0% 50%;\n    }\n  }\n}\n/* ── :has() 不可用：用第二层承载玩法图，官方图标保持可见 ───────── */\n@supports not selector(:has(*)) {\n  /*!oj:layered-art*/ /* 无 :has() 时的第二层：只铺精灵图第一格，不区分状态与玩法 */\n  [data-team-panel] [class*="_memberDot"] {\n    --oj-run: var(--oj-art-mode-sheet-1);\n    background-image: var(--oj-art), var(--oj-run);\n    background-size: contain, 800% 300%;\n    background-position: 50% 50%, 0% 0%;\n  }\n}'
  const RUNNER_STYLESHEET = '/* dsh-ohjingjing-team：标题栏跑道（第二块组件），由客户端束在运行时注入，勿手工编辑。 */\n/* 作用域：除 :root 参数外，所有规则都以自建的 [data-oj-runway] 为祖先——不碰官方界面里的任何东西。 */\n/*!oj:runner-params*/ /* 可调参数：鲸鲸边长、首次出现的槽位间距、一圈时长、子代理数上限；客户端挂载时从算得值读回它们，所以在自己的 CSS 里覆盖 :root 即可生效 */\n:root {\n  --oj-runner-size: 26px;\n  --oj-runners-gap: 26px;\n  --oj-lap-duration: 60.2s;\n  --oj-max-subagents: 20;\n  --oj-duration: 0.7s;\n}\n/*!oj:runner-art-idle-1*/ /* 跑道用的 idle 1× 素材 URL */\n:root {\n  --oj-art-idle-1: url("/ohjingjing-team/idle.113c758413.png");\n}\n/*!oj:runner-art-idle-2*/ /* 跑道用的 idle 2× 素材 URL */\n:root {\n  --oj-art-idle-2: url("/ohjingjing-team/idle@2x.4b67b106af.png");\n}\n/*!oj:runner-art-idle-3*/ /* 跑道用的 idle 3× 素材 URL */\n:root {\n  --oj-art-idle-3: url("/ohjingjing-team/idle@3x.11fe7373fd.png");\n}\n/*!oj:runner-art-warning-1*/ /* 跑道用的 warning 1× 素材 URL */\n:root {\n  --oj-art-warning-1: url("/ohjingjing-team/warning.7cf6302367.png");\n}\n/*!oj:runner-art-warning-2*/ /* 跑道用的 warning 2× 素材 URL */\n:root {\n  --oj-art-warning-2: url("/ohjingjing-team/warning@2x.9188218fbd.png");\n}\n/*!oj:runner-art-warning-3*/ /* 跑道用的 warning 3× 素材 URL */\n:root {\n  --oj-art-warning-3: url("/ohjingjing-team/warning@3x.9ae5c8a552.png");\n}\n/*!oj:runner-art-mode-sheet-1*/ /* 跑道用的 mode-sheet 1× 素材 URL */\n:root {\n  --oj-art-mode-sheet-1: url("/ohjingjing-team/mode-sheet.aa677855dc.png");\n}\n/*!oj:runner-art-mode-sheet-2*/ /* 跑道用的 mode-sheet 2× 素材 URL */\n:root {\n  --oj-art-mode-sheet-2: url("/ohjingjing-team/mode-sheet@2x.da97da3f8d.png");\n}\n/*!oj:runner-art-mode-sheet-3*/ /* 跑道用的 mode-sheet 3× 素材 URL */\n:root {\n  --oj-art-mode-sheet-3: url("/ohjingjing-team/mode-sheet@3x.b48da35023.png");\n}\n/* ── 容器、鲸鲸方框与三个层 ─────────────────────────────────── */\n/*!oj:runner-box*/ /* 跑道容器：贴在标签行的自由区里，向上溢出 1px 让 26px 的鲸鲸完整落在 25px 的行内 */\n[data-oj-runway] {\n  position: absolute;\n  top: -1px;\n  bottom: 0;\n  left: var(--oj-runway-left, 0px);\n  right: 0;\n  --oj-lap: 0px;\n  overflow: hidden;\n  pointer-events: none;\n}\n/*!oj:runner-box-body*/ /* 一只鲸鲸的方框：横坐标就是锚点。锚点由客户端在段落边界写入，样式里不做任何过渡（过渡会把改写变成滑动） */\n[data-oj-runway] > [data-oj-runner] {\n  position: absolute;\n  bottom: 0;\n  left: var(--oj-start, 0px);\n  width: var(--oj-runner-size);\n  height: var(--oj-runner-size);\n  pointer-events: none;\n}\n/*!oj:runner-move-layer*/ /* 位移层：一圈的 translateX 时间线与两端渐隐跑在这里 */\n[data-oj-runway] [data-oj-move] {\n  position: absolute;\n  inset: 0;\n}\n/*!oj:runner-body*/ /* 精灵层：素材与走帧/朝向由后面的规则按状态与玩法分派 */\n[data-oj-runway] [data-oj-body] {\n  position: absolute;\n  inset: 0;\n  background-repeat: no-repeat;\n  background-position: 50% 50%;\n  background-size: contain;\n}\n/* ── 站立与思考：整张方图，原地不动 ─────────────────────────── */\n/*!oj:runner-art-idle*/ /* idle：站立状态（空闲 / 停下思考）用整张方图，不挂任何动画 */\n[data-oj-runway] > [data-oj-runner][data-oj-art="idle"] [data-oj-body] {\n  --oj-art: var(--oj-art-idle-1);\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/idle.113c758413.png") 1x, url("/ohjingjing-team/idle@2x.4b67b106af.png") 2x, url("/ohjingjing-team/idle@3x.11fe7373fd.png") 3x);\n}\n/*!oj:runner-art-warning*/ /* warning：站立状态（空闲 / 停下思考）用整张方图，不挂任何动画 */\n[data-oj-runway] > [data-oj-runner][data-oj-art="warning"] [data-oj-body] {\n  --oj-art: var(--oj-art-warning-1);\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/warning.7cf6302367.png") 1x, url("/ohjingjing-team/warning@2x.9188218fbd.png") 2x, url("/ohjingjing-team/warning@3x.9ae5c8a552.png") 3x);\n}\n/*!oj:runner-art-sheet*/ /* 跑动状态：8 列 × 3 行玩法精灵图（走帧位置按玩法分派） */\n[data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"] [data-oj-body] {\n  background-size: 800% 300%;\n  background-image: var(--oj-art);\n  background-image: image-set(url("/ohjingjing-team/mode-sheet.aa677855dc.png") 1x, url("/ohjingjing-team/mode-sheet@2x.da97da3f8d.png") 2x, url("/ohjingjing-team/mode-sheet@3x.b48da35023.png") 3x);\n}\n/* ── 跑动状态：每种玩法一条走帧（+朝向）规则、一条位移规则 ───── */\n/*!oj:runner-mode-run*/ /* 玩法「正常跑」：8 步，静止时停在第 1 帧 */\n[data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="run"] [data-oj-body] {\n  background-position: 0% 0%;\n  animation: oj-r-run-pos var(--oj-duration) step-end infinite;\n}\n/*!oj:runner-move-run*/ /* 玩法「正常跑」的位移：一圈一条时间线（两端 4% 渐隐，重生看不见），时长 --oj-lap-duration */\n[data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="run"] [data-oj-move] {\n  animation: oj-r-run-lap var(--oj-lap-duration, 60.2s) linear infinite;\n}\n/*!oj:runner-mode-back*/ /* 玩法「左右来回跑」：56 步，静止时停在第 1 帧 */\n[data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="back"] [data-oj-body] {\n  background-position: 0% 50%;\n  animation: oj-r-back-pos calc(var(--oj-duration) * 56 / 7) step-end infinite, oj-r-back-flip calc(var(--oj-duration) * 56 / 7) step-end infinite;\n}\n/*!oj:runner-move-back*/ /* 玩法「左右来回跑」的位移：段边界硬折返，净位移为 0（折返点与朝向翻转同一刻） */\n[data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="back"] [data-oj-move] {\n  animation: oj-r-back-move calc(var(--oj-duration) * 56 / 7) linear infinite;\n}\n/*!oj:runner-mode-eat*/ /* 玩法「吃饭」：6 步，静止时停在第 1 帧 */\n[data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="eat"] [data-oj-body] {\n  background-position: 0% 100%;\n  animation: oj-r-eat-pos var(--oj-duration) step-end infinite;\n}\n  /* 正常跑：8 步（1 圈 × 8 帧） */\n  @keyframes oj-r-run-pos {\n    0% { background-position: 0% 0%; }\n    12.5% { background-position: 14.2857% 0%; }\n    25% { background-position: 28.5714% 0%; }\n    37.5% { background-position: 42.8571% 0%; }\n    50% { background-position: 57.1429% 0%; }\n    62.5% { background-position: 71.4286% 0%; }\n    75% { background-position: 85.7143% 0%; }\n    87.5% { background-position: 100% 0%; }\n    100% { background-position: 0% 0%; }\n  }\n  @keyframes oj-r-run-lap {\n    0% { transform: translateX(0px); opacity: 0; }\n    4% { opacity: 1; }\n    96% { opacity: 1; }\n    100% { transform: translateX(calc(var(--oj-lap, 0px) - var(--oj-start, 0px))); opacity: 0; }\n  }\n  /* 左右来回跑：56 步（4 圈 × 7 帧 + 4 圈 × 7 帧 镜像） */\n  @keyframes oj-r-back-pos {\n    0% { background-position: 0% 50%; }\n    1.7857% { background-position: 14.2857% 50%; }\n    3.5714% { background-position: 28.5714% 50%; }\n    5.3571% { background-position: 42.8571% 50%; }\n    7.1429% { background-position: 57.1429% 50%; }\n    8.9286% { background-position: 71.4286% 50%; }\n    10.7143% { background-position: 85.7143% 50%; }\n    12.5% { background-position: 0% 50%; }\n    14.2857% { background-position: 14.2857% 50%; }\n    16.0714% { background-position: 28.5714% 50%; }\n    17.8571% { background-position: 42.8571% 50%; }\n    19.6429% { background-position: 57.1429% 50%; }\n    21.4286% { background-position: 71.4286% 50%; }\n    23.2143% { background-position: 85.7143% 50%; }\n    25% { background-position: 0% 50%; }\n    26.7857% { background-position: 14.2857% 50%; }\n    28.5714% { background-position: 28.5714% 50%; }\n    30.3571% { background-position: 42.8571% 50%; }\n    32.1429% { background-position: 57.1429% 50%; }\n    33.9286% { background-position: 71.4286% 50%; }\n    35.7143% { background-position: 85.7143% 50%; }\n    37.5% { background-position: 0% 50%; }\n    39.2857% { background-position: 14.2857% 50%; }\n    41.0714% { background-position: 28.5714% 50%; }\n    42.8571% { background-position: 42.8571% 50%; }\n    44.6429% { background-position: 57.1429% 50%; }\n    46.4286% { background-position: 71.4286% 50%; }\n    48.2143% { background-position: 85.7143% 50%; }\n    50% { background-position: 0% 50%; }\n    51.7857% { background-position: 14.2857% 50%; }\n    53.5714% { background-position: 28.5714% 50%; }\n    55.3571% { background-position: 42.8571% 50%; }\n    57.1429% { background-position: 57.1429% 50%; }\n    58.9286% { background-position: 71.4286% 50%; }\n    60.7143% { background-position: 85.7143% 50%; }\n    62.5% { background-position: 0% 50%; }\n    64.2857% { background-position: 14.2857% 50%; }\n    66.0714% { background-position: 28.5714% 50%; }\n    67.8571% { background-position: 42.8571% 50%; }\n    69.6429% { background-position: 57.1429% 50%; }\n    71.4286% { background-position: 71.4286% 50%; }\n    73.2143% { background-position: 85.7143% 50%; }\n    75% { background-position: 0% 50%; }\n    76.7857% { background-position: 14.2857% 50%; }\n    78.5714% { background-position: 28.5714% 50%; }\n    80.3571% { background-position: 42.8571% 50%; }\n    82.1429% { background-position: 57.1429% 50%; }\n    83.9286% { background-position: 71.4286% 50%; }\n    85.7143% { background-position: 85.7143% 50%; }\n    87.5% { background-position: 0% 50%; }\n    89.2857% { background-position: 14.2857% 50%; }\n    91.0714% { background-position: 28.5714% 50%; }\n    92.8571% { background-position: 42.8571% 50%; }\n    94.6429% { background-position: 57.1429% 50%; }\n    96.4286% { background-position: 71.4286% 50%; }\n    98.2143% { background-position: 85.7143% 50%; }\n    100% { background-position: 0% 0%; }\n  }\n  @keyframes oj-r-back-flip {\n    0% { transform: scaleX(1); }\n    50% { transform: scaleX(-1); }\n    100% { transform: scaleX(1); }\n  }\n  @keyframes oj-r-back-move {\n    0% { transform: translateX(calc(var(--oj-stride) * -2)); }\n    50% { transform: translateX(calc(var(--oj-stride) * 2)); }\n    100% { transform: translateX(calc(var(--oj-stride) * -2)); }\n  }\n  /* 吃饭：6 步（1 圈 × 6 帧 原地） */\n  @keyframes oj-r-eat-pos {\n    0% { background-position: 0% 100%; }\n    16.6667% { background-position: 14.2857% 100%; }\n    33.3333% { background-position: 28.5714% 100%; }\n    50% { background-position: 42.8571% 100%; }\n    66.6667% { background-position: 57.1429% 100%; }\n    83.3333% { background-position: 71.4286% 100%; }\n    100% { background-position: 0% 0%; }\n  }\n  /* 与官方口径一致：用户要求减弱动效时全部停在原地（连位移一起停） */\n  @media (prefers-reduced-motion: reduce) {\n    /*!oj:runner-mode-run-reduced*/ /* 减弱动效：玩法「正常跑」停在原地 */\n    [data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="run"] [data-oj-move],\n  [data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="run"] [data-oj-body] {\n      animation: none;\n    }\n    /*!oj:runner-mode-back-reduced*/ /* 减弱动效：玩法「左右来回跑」停在原地 */\n    [data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="back"] [data-oj-move],\n  [data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="back"] [data-oj-body] {\n      animation: none;\n    }\n    /*!oj:runner-mode-eat-reduced*/ /* 减弱动效：玩法「吃饭」停在原地 */\n    [data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="eat"] [data-oj-move],\n  [data-oj-runway] > [data-oj-runner][data-oj-art="mode-sheet"][data-oj-mode="eat"] [data-oj-body] {\n      animation: none;\n    }\n  }'
  const CATALOG_STYLESHEET = '/* dsh-ohjingjing-team：子代理列表（第三块组件），由客户端束在运行时注入，勿手工编辑。 */\n/* 作用域：除 :root 参数外，所有规则都以官方下拉行的图标位 [class*="_rowActivitySlot"] 为祖先。 */\n/*!oj:catalog-params*/ /* 可调参数：列表图标位的边长与一圈时长；在自己的 CSS 里覆盖 :root 即可生效 */\n:root {\n  --oj-catalog-size: 26px;\n  --oj-duration: 0.7s;\n}\n/*!oj:catalog-art-idle-1*/ /* 列表用的 idle 1× 素材 URL */\n:root {\n  --oj-art-idle-1: url("/ohjingjing-team/idle.113c758413.png");\n}\n/*!oj:catalog-art-idle-2*/ /* 列表用的 idle 2× 素材 URL */\n:root {\n  --oj-art-idle-2: url("/ohjingjing-team/idle@2x.4b67b106af.png");\n}\n/*!oj:catalog-art-idle-3*/ /* 列表用的 idle 3× 素材 URL */\n:root {\n  --oj-art-idle-3: url("/ohjingjing-team/idle@3x.11fe7373fd.png");\n}\n/*!oj:catalog-art-mode-sheet-1*/ /* 列表用的 mode-sheet 1× 素材 URL */\n:root {\n  --oj-art-mode-sheet-1: url("/ohjingjing-team/mode-sheet.aa677855dc.png");\n}\n/*!oj:catalog-art-mode-sheet-2*/ /* 列表用的 mode-sheet 2× 素材 URL */\n:root {\n  --oj-art-mode-sheet-2: url("/ohjingjing-team/mode-sheet@2x.da97da3f8d.png");\n}\n/*!oj:catalog-art-mode-sheet-3*/ /* 列表用的 mode-sheet 3× 素材 URL */\n:root {\n  --oj-art-mode-sheet-3: url("/ohjingjing-team/mode-sheet@3x.b48da35023.png");\n}\n/* ── :has() 可用：官方点让位，图标位自己承载鲸鲸 ─────────────── */\n/*!oj:catalog-states*/ /* 官方状态 → 画什么：> svg[data-state="ongoing"] → 走帧动画；span[data-state="done"]、span[data-state="idle"] → idle 静态站立（已完成的子代理不画 done：子代理面里「不在跑」就是站着歇脚） */\n@supports selector(:has(*)) {\n  /*!oj:catalog-slot*/ /* 图标位：尺寸放大到 26px（官方只有 14×17），垂直居中于两行文字块；未在跑的行落 idle */\n  [class*="_rowActivitySlot"] {\n    box-sizing: border-box;\n    align-self: center;\n    position: relative;\n    width: var(--oj-catalog-size);\n    height: var(--oj-catalog-size);\n    background-repeat: no-repeat;\n    background-position: 50% 50%;\n    background-size: contain;\n    --oj-art: var(--oj-art-idle-1);\n    background-image: var(--oj-art);\n    background-image: image-set(url("/ohjingjing-team/idle.113c758413.png") 1x, url("/ohjingjing-team/idle@2x.4b67b106af.png") 2x, url("/ohjingjing-team/idle@3x.11fe7373fd.png") 3x);\n  }\n  /*!oj:catalog-hide-official*/ /* 让官方圆点与转圈不可见但保留占位（display:none 会让行内文字左移） */\n  [class*="_rowActivitySlot"] > svg,\n[class*="_rowActivitySlot"] > span[data-state] {\n    visibility: hidden !important;\n  }\n  /*!oj:catalog-running*/ /* 运行行默认播「正常跑」（8 步）：未命中行号规则的行都用它 */\n  [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]) {\n    background-size: 800% 300%;\n    background-position: 0% 0%;\n    --oj-art: var(--oj-art-mode-sheet-1);\n    background-image: var(--oj-art);\n    background-image: image-set(url("/ohjingjing-team/mode-sheet.aa677855dc.png") 1x, url("/ohjingjing-team/mode-sheet@2x.da97da3f8d.png") 2x, url("/ohjingjing-team/mode-sheet@3x.b48da35023.png") 3x);\n    animation: oj-c-run-pos var(--oj-duration) step-end infinite;\n  }\n  /*!oj:catalog-mode-back*/ /* 列表玩法「左右来回跑」：第 2、8、10 行，56 步 */\n  [class*="_menuBody"] > :nth-child(2) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]),\n  [class*="_menuBody"] > :nth-child(8) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]),\n  [class*="_menuBody"] > :nth-child(10) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]) {\n    animation: oj-c-back-pos calc(var(--oj-duration) * 56 / 7) step-end infinite, oj-c-back-flip calc(var(--oj-duration) * 56 / 7) step-end infinite;\n  }\n  /*!oj:catalog-mode-eat*/ /* 列表玩法「吃饭」：第 4、6、12 行，6 步 */\n  [class*="_menuBody"] > :nth-child(4) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]),\n  [class*="_menuBody"] > :nth-child(6) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]),\n  [class*="_menuBody"] > :nth-child(12) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]) {\n    animation: oj-c-eat-pos var(--oj-duration) step-end infinite;\n  }\n  @media (prefers-reduced-motion: reduce) {\n    /*!oj:catalog-mode-run-reduced*/ /* 减弱动效：列表玩法「正常跑」停在第 1 帧 */\n    [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]) {\n      animation: none;\n      background-position: 0% 0%;\n    }\n    /*!oj:catalog-mode-back-reduced*/ /* 减弱动效：列表玩法「左右来回跑」停在第 1 帧 */\n    [class*="_menuBody"] > :nth-child(2) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]),\n  [class*="_menuBody"] > :nth-child(8) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]),\n  [class*="_menuBody"] > :nth-child(10) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]) {\n      animation: none;\n      background-position: 0% 50%;\n    }\n    /*!oj:catalog-mode-eat-reduced*/ /* 减弱动效：列表玩法「吃饭」停在第 1 帧 */\n    [class*="_menuBody"] > :nth-child(4) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]),\n  [class*="_menuBody"] > :nth-child(6) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]),\n  [class*="_menuBody"] > :nth-child(12) [role="treeitem"][aria-level="1"] [class*="_rowActivitySlot"]:has(> svg[data-state="ongoing"]) {\n      animation: none;\n      background-position: 0% 100%;\n    }\n  }\n}\n  /* 正常跑：8 步（1 圈 × 8 帧） */\n  @keyframes oj-c-run-pos {\n    0% { background-position: 0% 0%; }\n    12.5% { background-position: 14.2857% 0%; }\n    25% { background-position: 28.5714% 0%; }\n    37.5% { background-position: 42.8571% 0%; }\n    50% { background-position: 57.1429% 0%; }\n    62.5% { background-position: 71.4286% 0%; }\n    75% { background-position: 85.7143% 0%; }\n    87.5% { background-position: 100% 0%; }\n    100% { background-position: 0% 0%; }\n  }\n  /* 左右来回跑：56 步（4 圈 × 7 帧 + 4 圈 × 7 帧 镜像） */\n  @keyframes oj-c-back-pos {\n    0% { background-position: 0% 50%; }\n    1.7857% { background-position: 14.2857% 50%; }\n    3.5714% { background-position: 28.5714% 50%; }\n    5.3571% { background-position: 42.8571% 50%; }\n    7.1429% { background-position: 57.1429% 50%; }\n    8.9286% { background-position: 71.4286% 50%; }\n    10.7143% { background-position: 85.7143% 50%; }\n    12.5% { background-position: 0% 50%; }\n    14.2857% { background-position: 14.2857% 50%; }\n    16.0714% { background-position: 28.5714% 50%; }\n    17.8571% { background-position: 42.8571% 50%; }\n    19.6429% { background-position: 57.1429% 50%; }\n    21.4286% { background-position: 71.4286% 50%; }\n    23.2143% { background-position: 85.7143% 50%; }\n    25% { background-position: 0% 50%; }\n    26.7857% { background-position: 14.2857% 50%; }\n    28.5714% { background-position: 28.5714% 50%; }\n    30.3571% { background-position: 42.8571% 50%; }\n    32.1429% { background-position: 57.1429% 50%; }\n    33.9286% { background-position: 71.4286% 50%; }\n    35.7143% { background-position: 85.7143% 50%; }\n    37.5% { background-position: 0% 50%; }\n    39.2857% { background-position: 14.2857% 50%; }\n    41.0714% { background-position: 28.5714% 50%; }\n    42.8571% { background-position: 42.8571% 50%; }\n    44.6429% { background-position: 57.1429% 50%; }\n    46.4286% { background-position: 71.4286% 50%; }\n    48.2143% { background-position: 85.7143% 50%; }\n    50% { background-position: 0% 50%; }\n    51.7857% { background-position: 14.2857% 50%; }\n    53.5714% { background-position: 28.5714% 50%; }\n    55.3571% { background-position: 42.8571% 50%; }\n    57.1429% { background-position: 57.1429% 50%; }\n    58.9286% { background-position: 71.4286% 50%; }\n    60.7143% { background-position: 85.7143% 50%; }\n    62.5% { background-position: 0% 50%; }\n    64.2857% { background-position: 14.2857% 50%; }\n    66.0714% { background-position: 28.5714% 50%; }\n    67.8571% { background-position: 42.8571% 50%; }\n    69.6429% { background-position: 57.1429% 50%; }\n    71.4286% { background-position: 71.4286% 50%; }\n    73.2143% { background-position: 85.7143% 50%; }\n    75% { background-position: 0% 50%; }\n    76.7857% { background-position: 14.2857% 50%; }\n    78.5714% { background-position: 28.5714% 50%; }\n    80.3571% { background-position: 42.8571% 50%; }\n    82.1429% { background-position: 57.1429% 50%; }\n    83.9286% { background-position: 71.4286% 50%; }\n    85.7143% { background-position: 85.7143% 50%; }\n    87.5% { background-position: 0% 50%; }\n    89.2857% { background-position: 14.2857% 50%; }\n    91.0714% { background-position: 28.5714% 50%; }\n    92.8571% { background-position: 42.8571% 50%; }\n    94.6429% { background-position: 57.1429% 50%; }\n    96.4286% { background-position: 71.4286% 50%; }\n    98.2143% { background-position: 85.7143% 50%; }\n    100% { background-position: 0% 0%; }\n  }\n  @keyframes oj-c-back-flip {\n    0% { transform: scaleX(1); }\n    50% { transform: scaleX(-1); }\n    100% { transform: scaleX(1); }\n  }\n  /* 吃饭：6 步（1 圈 × 6 帧） */\n  @keyframes oj-c-eat-pos {\n    0% { background-position: 0% 100%; }\n    16.6667% { background-position: 14.2857% 100%; }\n    33.3333% { background-position: 28.5714% 100%; }\n    50% { background-position: 42.8571% 100%; }\n    66.6667% { background-position: 57.1429% 100%; }\n    83.3333% { background-position: 71.4286% 100%; }\n    100% { background-position: 0% 0%; }\n  }'

  /** 跑道的运行期常量：剧本、每种玩法的位移形状、实测步幅与可调参数的默认值。 */
  const RUNNER_PLAN = {
    "script": {
      "totalLaps": 8.75,
      "segments": [
        {
          "index": 0,
          "mode": "run",
          "laps": 2,
          "start": 0,
          "end": 2
        },
        {
          "index": 1,
          "mode": "think",
          "laps": 0.5,
          "start": 2,
          "end": 2.5
        },
        {
          "index": 2,
          "mode": "run",
          "laps": 1,
          "start": 2.5,
          "end": 3.5
        },
        {
          "index": 3,
          "mode": "back",
          "laps": 0.5,
          "start": 3.5,
          "end": 4
        },
        {
          "index": 4,
          "mode": "run",
          "laps": 3,
          "start": 4,
          "end": 7
        },
        {
          "index": 5,
          "mode": "eat",
          "laps": 0.5,
          "start": 7,
          "end": 7.5
        },
        {
          "index": 6,
          "mode": "run",
          "laps": 1,
          "start": 7.5,
          "end": 8.5
        },
        {
          "index": 7,
          "mode": "back",
          "laps": 0.25,
          "start": 8.5,
          "end": 8.75
        }
      ]
    },
    "phaseStep": 0.6180339887498949,
    "modes": {
      "run": {
        "move": "lap"
      },
      "think": {
        "move": "none"
      },
      "back": {
        "move": "swing",
        "frameAt": [
          0,
          0.5,
          1
        ],
        "frameUnits": [
          -2,
          2,
          -2
        ],
        "span": 4,
        "entryUnits": -2,
        "cycleMs": 5600
      },
      "eat": {
        "move": "none"
      }
    },
    "spriteName": "mode-sheet",
    "idleArt": "idle",
    "thinkArt": "warning",
    "stridePx": 7.548,
    "sizePx": 26,
    "gapPx": 26,
    "lapMs": 60200,
    "maxSubagents": 20,
    "fade": 0.04
  }

  /**
   * 把一份样式装进文档，返回撤销函数。
   *
   * 幂等：同 tagId 的标签已存在时复用并覆盖内容，避免热重载后残留旧样式。三块样式表
   * 用各自的 tagId，所以可以分别装、分别撤。
   * @param {StyleDocument|undefined} doc - 目标文档；浏览器里传 document。
   * @param {string} tagId - style 标签标记。
   * @param {string} css - 样式表文本。
   * @returns {() => void} 移除样式标签的撤销函数。
   */
  function installStylesheet(doc, tagId, css) {
    if (doc === undefined || doc === null || doc.head === undefined || doc.head === null) return function () {}
    const selector = 'style[data-plugin-css="' + tagId + '"]'
    let tag = doc.head.querySelector(selector)
    if (tag === null) {
      tag = doc.createElement('style')
      tag.dataset.plugin = BUNDLE_ID
      tag.dataset.pluginCss = tagId
      doc.head.appendChild(tag)
    }
    tag.textContent = css
    return function () {
      tag.remove()
    }
  }

  /**
   * 读组件开关。
   *
   * 任何异常（离线、404、更早版本的宿主没有这个端点）一律当成「三块都关」：官方界面保持原样，
   * 不会出现「官方图标被隐藏而素材又取不到」的空位。第一次失败会在控制台留一行，
   * 之后静默——重探发生在每次重新聚焦页面时，不该刷屏。
   * @param {(flags: {skin: boolean, runners: boolean, catalog: boolean}) => void} done - 结果回调（永不抛）。
   */
  let probeWarned = false
  function readComponents(done) {
    const off = { skin: false, runners: false, catalog: false }
    if (typeof fetch !== 'function') {
      done(off)
      return
    }
    fetch(COMPONENTS_URL, { cache: 'no-store' }).then(function (response) {
      if (response.ok !== true) throw new Error('HTTP ' + response.status)
      return response.json()
    }).then(function (flags) {
      const on = flags !== null && typeof flags === 'object'
      done({
        skin: on && flags.skin === true,
        runners: on && flags.runners === true,
        catalog: on && flags.catalog === true,
      })
    }).catch(function (error) {
      /* 读不到清单就是「本插件什么都不做」：官方界面照旧，比半残好。 */
      if (!probeWarned) {
        probeWarned = true
        console.warn('ohjingjing-team: 读不到组件清单 ' + COMPONENTS_URL + '，本次不启用任何组件（' + String(error) + '）')
      }
      done(off)
    })
  }

  /**
   * 标题栏跑道：客户端半区的全部行为。
   *
   * 本文件**不是模块**，而是被 `tools/gen-client.mjs` 原样读进浏览器束、嵌在束的 IIFE 里的
   * 一段脚本：浏览器束不能含顶层 import/export（会污染同批拼接的整段脚本），而这段代码又必须
   * 待在 `factory(require)` 的闭包里——`react` 只能从外壳种子词里 require 进来。所以它既没有
   * import 也没有 export，约束由 `test-bundle.mjs`（用 vm 执行真实产物）与
   * `tools/verify/header*.mjs`（真机 DOM）兜住。
   *
   * ## 它做五件事
   *
   * 1. **挂一个隐藏锚点**：往官方槽位 `conversation.session.header.actions` 注册一条同槽条目，
   *    渲染一个 `display:none` 的 span。官方不给插件 DOM 句柄，所以只能从锚点往上找本头部的
   *    标签行（`[data-conversation-tabs]`）——多头部布局下也不会画到别人家里。
   * 2. **订阅名册**：**lead（本会话）永远在跑道上**，后面跟着目录里**最新的 N 个子代理**
   *    （DSH 会把历史子代理留在总数里，所以取尾部；`--oj-max-subagents` 是 N）。
   * 3. **画跑道**：在标签行自由区里插一个绝对定位容器，最多 1 + N 只鲸鲸，共用一条轨道。
   * 4. **排戏**：一只鲸鲸「在跑」时按剧本走（跑为主，周期性停下思考/吃饭），每只的相位由
   *    **绝对位次**决定；不在跑时就地站住（idle 素材）。剧本与相位在 `tools/runway-script.mjs`。
   * 5. **算几何**：轨道右端（`--oj-lap`）由自由宽度与鲸鲸边长算出来；每只的横坐标只有锚点
   *    `--oj-start` 一个来源，锚点只在「看不见的时刻」改写（见下）。
   *
   * ## 锚点：位置唯一的来源，而且只在看不见的时刻改
   *
   * 鲸鲸的横坐标 = 锚点 + 动画产生的位移。换段时动画会被换掉（`data-oj-mode` 一变，旧动画
   * 立刻消失、transform 回到 0），所以换段的同一刻必须把锚点写成「当前画面位置 − 新动画在
   * t=0 的位移」，否则会看到瞬移。三种换段时刻都是安全的：
   *
   * - **跑完一圈**：一圈两端有 4% 的渐隐（`RUN_FADE`），跑到右端时鲸鲸正好是全透明的，
   *   此时代码把锚点改成 0——下一圈就从**起点最左侧**出发（用户要的「跑完一圈回起点重生」）。
   * - **站着的时候**：思考/吃饭/agent 结束都不产生位移，锚点就是当时的横坐标（原地停）。
   * - **来回跑**：位移时间线是闭合的，结束时刻的位置等于进入时刻的位置。
   *
   * ## 只在变化时写 DOM
   *
   * 每 250ms 一个 tick，从**绝对时间**推出每只该在剧本的哪一段（不累加状态，因此页面被
   * 挂起、定时器被节流之后会自动对齐，不会漂）。段落或运行状态没变时**一个属性都不碰**——
   * 动画因此不会被打断，浏览器也不会因为「每帧改样式」而重排。
   */

  /**
   * 造一个槽位条目组件。
   * @param {object} React - 外壳种子词 `react`。
   * @param {object} plan - 生成期烘进来的剧本与几何参数，见 `tools/gen-client.mjs` 的 `RUNNER_PLAN`。
   * @returns {(props: object) => unknown} 可以直接交给 `ctx.slots.register` 的组件。
   */
  function createRunnerEntry(React, plan) {
    /** 最后一个标签到跑道之间的留白：标签之间是 36px，跑道短一点才不会显得和标签是一组。 */
    const GAP_PX = 24
    /** 容器与跑者节点上的固定标记，同时用于「跳过自己」的遍历。 */
    const BOX_ATTR = 'data-oj-runway'
    const ANCHOR_ATTR = 'data-oj-anchor'
    /** 调度间隔。250ms 的分辨率对「一段几百秒的剧本」绰绰有余，也不会让样式反复失效。 */
    const TICK_MS = 250
    /** 换段时要清掉的自定义属性（锚点除外，它是每只都有的状态）。 */
    const MODE_VARS = ['--oj-stride']
    /** 初始槽位最多占到轨道的哪一部分：留出剩下的部分给第一圈，避免最后一只从最右端出发。 */
    const SLOT_MAX_SHARE = 0.85

    /** 解析算得值里的数值参数：非法或非正一律退回生成期烘进来的默认值。 */
    function readParam(style, name, fallback) {
      const parsed = Number.parseFloat(style.getPropertyValue(name))
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
    }

    /**
     * 解析算得值里的时长（秒）：CSS 的 `<time>` 可以是 `60.2s` 也可以是 `60200ms`。
     * @param {object} style - 算得样式。
     * @param {string} name - 自定义属性名。
     * @param {number} fallbackMs - 兜底毫秒数。
     * @returns {number} 毫秒。
     */
    function readDurationMs(style, name, fallbackMs) {
      const text = String(style.getPropertyValue(name) ?? '').trim()
      const parsed = Number.parseFloat(text)
      if (!Number.isFinite(parsed) || parsed <= 0) return fallbackMs
      return /ms$/i.test(text) ? parsed : parsed * 1000
    }

    /** 保留两位小数：几何量是除出来的，写进 CSS 时不必带一长串小数。 */
    const round2 = (value) => Math.round(value * 100) / 100

    /** 用户是否要求减弱动效：要求时整条跑道静止（不换段、不改锚点，鲸鲸站在它的槽位上）。 */
    function prefersReducedMotion() {
      if (typeof matchMedia !== 'function') return false
      const query = matchMedia('(prefers-reduced-motion: reduce)')
      return query !== null && query !== undefined && query.matches === true
    }

    /** 剧本总圈数。 */
    const TOTAL_LAPS = plan.script.totalLaps

    /**
     * 跑道最多画多少个**子代理**（lead 之外）。
     *
     * 从 `:root` 的算得值读回（`--oj-max-subagents`），于是它是真正的旋钮：在自己的 CSS 里
     * 覆盖即可，不必重新打包。名册在 React 那一层就被裁到 N 个，画布那一层因此不需要知道上限。
     * @returns {number} 子代理数上限。
     */
    function maxSubagents() {
      if (typeof getComputedStyle === 'function' && typeof document !== 'undefined' && document.documentElement !== null) {
        const parsed = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--oj-max-subagents'))
        if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed)
      }
      return plan.maxSubagents
    }

    /**
     * 把任意圈数折回一轮之内。
     * @param {number} laps - 剧本刻度（圈）。
     * @returns {number} `[0, totalLaps)` 内的刻度。
     */
    function wrapLaps(laps) {
      const wrapped = laps % TOTAL_LAPS
      return wrapped < 0 ? wrapped + TOTAL_LAPS : wrapped
    }

    /**
     * 某个时刻处在剧本的哪一段。
     * @param {number} laps - 剧本刻度（圈）。
     * @returns {{index: number, mode: string, laps: number, start: number, end: number}} 段落。
     */
    function segmentAt(laps) {
      const at = wrapLaps(laps)
      const segments = plan.script.segments
      for (const segment of segments) {
        if (at < segment.end) return segment
      }
      return segments[segments.length - 1]
    }

    /**
     * 从某个刻度起，下一个跑动段的起点（已经在跑动段里就返回刻度本身）。
     *
     * 新出现的鲸鲸用它对齐相位：一露面就先跑起来，而不是先站着。
     * @param {number} laps - 剧本刻度（圈）。
     * @returns {number} 不小于 `laps` 的跑动段起点。
     */
    function nextRunStart(laps) {
      const segment = segmentAt(laps)
      if (segment.mode === 'run') return laps
      const base = laps - (wrapLaps(laps) - segment.start)
      for (const entry of plan.script.segments) {
        if (entry.mode === 'run' && entry.start >= segment.end) return base + entry.start
      }
      return base
    }

    /**
     * 一只鲸鲸的相位（0–1），由**绝对位次**决定：lead 是 0，目录里第 i 个子代理是 i + 1。
     *
     * 无名理数（黄金比的小数部分）做步长：相邻位次错开 0.618，越远越难重合，而且**与名册
     * 长度无关**——第 3 位的相位永远是 `frac(3 × 0.618)`，前面掉了几个人也不会整体平移。
     * @param {number} index - 绝对位次。
     * @returns {number} `[0, 1)` 的相位。
     */
    function phaseOf(index) {
      const raw = (index * plan.phaseStep) % 1
      return raw < 0 ? raw + 1 : raw
    }

    /**
     * 名册 → 跑道条目。
     *
     * **lead 永远第一只**（用户要的「0 个子智能体也有一个鲸鲸在跑道上」），运行状态取本会话
     * 自己的状态；子代理取目录**尾部**的 N 个——DSH 会把历史子代理留在总数里，
     * 从头取会让跑道被早已结束的旧会话占满。位次 `index` 用的是**目录里的绝对下标 + 1**，
     * 不是裁剪后的位置：名册滚动时，留在场上的鲸鲸相位不变。
     *
     * 运行判据与官方面板逐字一致：运行取 `sessionStatus`，缺了退到 `byId[id].running`。
     * @param {string} sessionId - 本会话（lead）的 id。
     * @param {object} projections - `useSessions(snapshot => snapshot.projectionsBySession)`。
     * @param {object} summaries - `useSessions(snapshot => snapshot.byId)`。
     * @param {Map} statuses - `useSessionStatus(snapshot => snapshot)`。
     * @returns {{id: string, index: number, running: boolean}[]} 跑道上的名册，lead 在前。
     */
    function readEntries(sessionId, projections, summaries, statuses) {
      const isRunning = (id) => {
        const status = statuses !== null && statuses !== undefined && typeof statuses.get === 'function' ? statuses.get(id) : undefined
        const summary = summaries === null || summaries === undefined ? undefined : summaries[id]
        return (status === undefined || status === null ? summary?.running : status.running) === true
      }
      const projection = projections === null || projections === undefined ? undefined : projections[sessionId]
      const catalog = (projection === null || projection === undefined ? undefined : projection.values?.subagentCatalog) ?? []
      const limit = maxSubagents()
      const shown = catalog.length > limit ? catalog.slice(catalog.length - limit) : catalog
      const dropped = catalog.length - shown.length
      return [
        { id: String(sessionId), index: 0, running: isRunning(sessionId) },
        ...shown.map((entry, at) => ({ id: String(entry.id), index: dropped + at + 1, running: isRunning(entry.id) })),
      ]
    }

    /**
     * 跑道控制器：DOM、几何与剧本调度都在这里，组件只负责在每次渲染后把它叫醒。
     *
     * 节点按条目 id 复用（换人只改属性、不重建元素），所以状态变化不会打断正在播的动画；
     * 甲板宽度变化只改自定义属性，同理。
     */
    function createController() {
      const state = {
        holder: null,
        container: null,
        anchor: null,
        observer: null,
        timer: null,
        entries: [],
        runners: new Map(),
        params: null,
        lapPx: 0,
      }

      /**
       * 从锚点往上找**本头部**的标签行：第一个「子树里恰好有一个标签行」的祖先。
       *
       * 往上数而不是往下找，是为了多头部布局（右栏聊天面板也有一份头部）：第一个符合条件的
       * 祖先就是自己这一份。若某个祖先里已经有两个以上，说明再往上也分不清归属，直接放弃
       * （宁可不画，也不画到别的会话头上）。
       * @param {Element} node - 隐藏锚点节点。
       * @returns {Element|null} 标签行元素。
       */
      function findAnchor(node) {
        let element = node === null ? null : node.parentElement
        while (element !== null && element !== undefined) {
          const found = element.querySelectorAll('[data-conversation-tabs]')
          if (found.length === 1) return found[0]
          if (found.length > 1) return null
          element = element.parentElement
        }
        return null
      }

      /**
       * 保证容器存在、且**仍然挂在本头部的标签行上**。
       *
       * 两种情况要重新挂：标签行被官方重建（节点断开连接），或者标签行本身消失了
       * （会话视图只剩一个时官方就不渲染这一行）。后者必须把容器摘掉——留在 DOM 里
       * 就是一个再也没人管的孤儿。
       * @returns {Element|null} 容器；找不到标签行时为 null。
       */
      function ensureContainer() {
        const anchor = findAnchor(state.holder)
        if (anchor === null) {
          if (state.container !== null) drop()
          return null
        }
        if (state.container !== null && state.container.isConnected === true && state.container.parentElement === anchor) return state.container
        if (state.container !== null) drop()
        const container = document.createElement('div')
        container.setAttribute(BOX_ATTR, '')
        anchor.appendChild(container)
        state.anchor = anchor
        state.container = container
        const style = getComputedStyle(container)
        state.params = {
          sizePx: readParam(style, '--oj-runner-size', plan.sizePx),
          gapPx: readParam(style, '--oj-runners-gap', plan.gapPx),
          lapMs: readDurationMs(style, '--oj-lap-duration', plan.lapMs),
          maxSubagents: Math.max(0, Math.round(readParam(style, '--oj-max-subagents', plan.maxSubagents))),
          stridePx: plan.stridePx,
          fade: plan.fade,
          reduced: prefersReducedMotion(),
        }
        observe(anchor)
        // 首帧量到的宽度可能早于布局/字体稳定（实测：挂载时视口还没到最终尺寸，而此后
        // **不会**再有 resize 事件可依赖——观察者只对「观察开始之后的变化」负责），
        // 所以在下一帧再量一次。幂等，只把轨道长度与真实宽度对齐。
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(function () {
            if (state.container === container && container.isConnected === true) paint(container, measure(container))
          })
        }
        return container
      }

      /** 摘掉容器、观察者与定时器，但保留名册（下次同步会重新挂）。 */
      function drop() {
        stopTicker()
        if (state.observer !== null && state.observer !== undefined) state.observer.disconnect()
        state.observer = null
        if (state.container !== null) state.container.remove()
        state.container = null
        state.anchor = null
        state.params = null
        state.lapPx = 0
        state.runners.clear()
      }

      /** 量自由宽度：从最后一个标签的右边缘（跳过自己）到标签行右边缘，再留一个 GAP。 */
      function measure(container) {
        const anchor = state.anchor
        if (anchor === null) return 0
        const rect = anchor.getBoundingClientRect()
        let right = rect.left
        for (const child of anchor.children) {
          if (child.hasAttribute !== undefined && child.hasAttribute(BOX_ATTR)) continue
          const childRect = child.getBoundingClientRect()
          if (childRect.right > right) right = childRect.right
        }
        const left = Math.max(0, right - rect.left + GAP_PX)
        container.style.setProperty('--oj-runway-left', round2(left) + 'px')
        return Math.max(0, rect.width - left)
      }

      /** 建一只鲸鲸的节点：方框 → 位移层 → 精灵层（三层各管一个属性，见样式表注释）。 */
      function createNode() {
        const node = document.createElement('div')
        node.setAttribute('data-oj-runner', '')
        const move = document.createElement('div')
        move.setAttribute('data-oj-move', '')
        const body = document.createElement('div')
        body.setAttribute('data-oj-body', '')
        move.appendChild(body)
        node.appendChild(move)
        return node
      }

      /** 写锚点：这是鲸鲸横坐标的唯一来源，只允许在「看不见的时刻」调用（见文件头）。 */
      function writeAnchor(runner, px) {
        runner.anchorPx = px
        runner.node.style.setProperty('--oj-start', round2(px) + 'px')
      }

      /**
       * 一只鲸鲸的初始位置：按渲染位次排开的槽位。
       *
       * 间距是 `--oj-runners-gap`（默认一只鲸鲸的宽度，相邻两只刚好相接），但**按轨道长度收窄**：
       * 名册满员（1 + `--oj-max-subagents` 只）时也要让最后一只落在轨道内、并且留出一截可以跑，
       * 否则它会从最右端出发——位移为 0，画面上是「原地跑」一整圈。
       * @param {number} position - 渲染位次（lead 是 0）。
       * @returns {number} 槽位横坐标（px）。
       */
      function slotPx(position) {
        const count = state.entries.length
        const room = state.lapPx * SLOT_MAX_SHARE
        const gap = count > 1 ? Math.min(state.params.gapPx, room / (count - 1)) : state.params.gapPx
        return position * gap
      }

      /**
       * 取（必要时新建）一只鲸鲸的运行时状态。
       *
       * 新出现的鲸鲸从**下一个跑动段**开始（`nextRunStart`）：一露面就先跑起来，配合槽位
       * offset，正好是「先出现在自己的位置上，再一路跑到右边、回起点重生」。
       */
      function ensureRunner(entry, position, now) {
        let runner = state.runners.get(entry.id)
        if (runner === undefined) {
          const node = createNode()
          state.container.appendChild(node)
          runner = {
            id: entry.id,
            node,
            position,
            running: entry.running,
            startMs: now,
            offsetLaps: nextRunStart(phaseOf(entry.index) * TOTAL_LAPS),
            segment: -1,
            mode: null,
            modeStartedMs: now,
            zeroed: false,
            stridePx: state.params.stridePx,
          }
          writeAnchor(runner, slotPx(position))
          node.setAttribute('data-oj-art', plan.idleArt)
          state.runners.set(entry.id, runner)
        }
        runner.running = entry.running
        runner.position = position
        return runner
      }

      /**
       * 一只鲸鲸**此刻画面上**的横坐标。
       *
       * 换段时要用它把锚点接上，所以必须与 CSS 的关键帧逐字同源：位移层相对锚点算。
       * - `run`：一圈从锚点线性跑到轨道右端（`frac × (轨道长 − 锚点)`）；
       * - `back`：位移是闭合的振荡时间线，按 `--oj-stride` 的倍数取；
       * - `eat` / `think` / `idle`：原地不动。
       * @param {object} runner - 运行时状态。
       * @param {number} now - 当前时刻（毫秒）。
       * @returns {number} 横坐标（px，相对跑道左端）。
       */
      function currentX(runner, now) {
        const elapsed = Math.max(0, now - runner.modeStartedMs)
        if (runner.mode === 'run') {
          const lapMs = state.params.lapMs
          const frac = lapMs > 0 ? (elapsed % lapMs) / lapMs : 0
          return runner.anchorPx + frac * (state.lapPx - runner.anchorPx)
        }
        if (runner.mode === 'back') {
          const shape = plan.modes.back
          const cycle = shape.cycleMs
          const frac = cycle > 0 ? (elapsed % cycle) / cycle : 0
          return runner.anchorPx + unitsAt(shape, frac) * runner.stridePx
        }
        return runner.anchorPx
      }

      /**
       * 换段时要接上的位置：**跑满一圈的那一刻按「回起点重生」处理**。
       *
       * 一圈两端有 4% 的渐隐（`RUN_FADE`），跑到右端时鲸鲸几乎全透明，此刻把它挪到起点最左侧
       * 是设计——用户要的「跑完一圈在起点最左侧重新生成、没有初始 offset」就落在这一条上。
       * 反过来，**agent 结束时不能用它**：那时鲸鲸可能正在渐隐帧里（半透明但看得见），
       * 挪到 0 是一次看得见的跳位，而用户要的是「原地站住」。
       * @param {object} runner - 运行时状态。
       * @param {number} now - 当前时刻（毫秒）。
       * @returns {number} 横坐标（px）。
       */
      function respawnX(runner, now) {
        if (runner.mode === 'run') {
          const lapMs = state.params.lapMs
          const frac = lapMs > 0 ? ((now - runner.modeStartedMs) % lapMs) / lapMs : 0
          if (frac <= state.params.fade || frac >= 1 - state.params.fade) return 0
        }
        return currentX(runner, now)
      }

      /** 振荡时间线在某个相位上的位移（单位是「一圈位移」的倍数），段内线性插值。 */
      function unitsAt(shape, frac) {
        const at = shape.frameAt
        const units = shape.frameUnits
        for (let index = 1; index < at.length; index++) {
          if (frac <= at[index] || index === at.length - 1) {
            const span = at[index] - at[index - 1]
            const share = span > 0 ? (frac - at[index - 1]) / span : 0
            return units[index - 1] + share * (units[index] - units[index - 1])
          }
        }
        return units[units.length - 1]
      }

      /** 换素材、换玩法。玩法属性一变，旧动画立刻停止、新动画从第 0 帧开始。 */
      function setArt(runner, art) {
        if (runner.node.getAttribute('data-oj-art') !== art) runner.node.setAttribute('data-oj-art', art)
      }

      function setMode(runner, mode, now) {
        if (runner.node.getAttribute('data-oj-mode') !== mode) {
          runner.node.setAttribute('data-oj-mode', mode)
        }
        runner.mode = mode
        runner.modeStartedMs = now
      }

      /** 站住：去掉玩法属性（动画消失，transform 归零），素材换成指定的一张。 */
      function stand(runner, art, x, now, mode) {
        writeAnchor(runner, x)
        if (runner.node.hasAttribute('data-oj-mode')) runner.node.removeAttribute('data-oj-mode')
        for (const name of MODE_VARS) runner.node.style.removeProperty(name)
        setArt(runner, art)
        runner.mode = mode
        runner.modeStartedMs = now
        runner.zeroed = false
      }

      /**
       * 进入一个剧本段落。
       *
       * 锚点的算法只有一条：**新动画在 t=0 的位移是 0（或 `entryUnits × stride`），所以锚点取
       * 「当前画面位置 − 那个位移」**。于是换段永远不会看到瞬移，无论上一段是跑、是来回跑还是站着。
       * @param {object} runner - 运行时状态。
       * @param {object} segment - 目标段落。
       * @param {number} now - 当前时刻（毫秒）。
       */
      function enterSegment(runner, segment, now) {
        const x = respawnX(runner, now)
        if (segment.mode === 'think') {
          stand(runner, plan.thinkArt, x, now, 'think')
          return
        }
        if (segment.mode === 'eat') {
          writeAnchor(runner, x)
          setArt(runner, plan.spriteName)
          setMode(runner, 'eat', now)
          runner.zeroed = false
          return
        }
        if (segment.mode === 'back') {
          const shape = plan.modes.back
          // 来回跑只向**右边**摆：时间线的起点是它的最低点，取「锚点 = 当前位置 + 振幅」，
          // 摆动区间就是 `[当前位置, 当前位置 + 跨度 × 步幅]`，永远不会探出轨道左端。
          const room = Math.max(0, state.lapPx - x)
          const stride = Math.min(state.params.stridePx, room / shape.span)
          if (stride < state.params.stridePx * 0.5) {
            // 右边没地方摆了（只可能出现在「被节流很久之后落在轨道右端」这种极端情况）：
            // 原地停下思考，而不是在边界上抽搐——暂停是有界的，不会一直站着。
            stand(runner, plan.thinkArt, x, now, 'think')
            return
          }
          runner.stridePx = stride
          runner.node.style.setProperty('--oj-stride', round2(stride) + 'px')
          writeAnchor(runner, x - shape.entryUnits * stride)
          setArt(runner, plan.spriteName)
          setMode(runner, 'back', now)
          runner.zeroed = false
          return
        }
        writeAnchor(runner, x)
        setArt(runner, plan.spriteName)
        setMode(runner, 'run', now)
        runner.zeroed = false
      }

      /** 一只鲸鲸此刻的剧本刻度（圈）。 */
      function lapsOf(runner, now) {
        return (now - runner.startMs) / state.params.lapMs + runner.offsetLaps
      }

      /**
       * 推进一只鲸鲸。这是「运行时状态切换」的全部逻辑：
       *
       * - agent 不在跑 → 站住（原地，素材 idle）——已结束的子代理也是这一档；
       * - agent 在跑 → 按剧本取当前段落，段落一变就换段（写属性 = 重启动画，正是想要的信号）；
       * - 段落没变 → **一个属性都不碰**；只有正常跑在首圈结束时把锚点置 0（回起点重生）。
       * @param {object} runner - 运行时状态。
       * @param {number} now - 当前时刻（毫秒）。
       * @returns {boolean} 这只鲸鲸是否还会继续动（用来决定要不要留着定时器）。
       */
      function advance(runner, now) {
        if (runner.running !== true) {
          if (runner.mode !== 'idle') {
            stand(runner, plan.idleArt, currentX(runner, now), now, 'idle')
            // 名册里的段落标记清掉：agent 重新跑起来时要按当时的刻度重新入段，
            // 否则「同一个段落」会拦住换段，鲸鲸就一直站着。
            runner.segment = -1
          }
          return false
        }
        const segment = segmentAt(lapsOf(runner, now))
        if (segment.index !== runner.segment) {
          runner.segment = segment.index
          enterSegment(runner, segment, now)
          return true
        }
        if (segment.mode === 'run' && runner.zeroed !== true && now - runner.modeStartedMs >= state.params.lapMs) {
          // 跑满一圈：此刻鲸鲸在右端、处于渐隐帧（全透明），把锚点改成 0 —— 下一圈从起点
          // 最左侧出发，看不到任何 offset。这正是用户要的「跑完一圈回起点重生」。
          writeAnchor(runner, 0)
          runner.zeroed = true
        }
        return true
      }

      /**
       * 减弱动效：整条跑道静止——不换段、不改锚点，鲸鲸站在它当时的位置上。
       *
       * **每次同步与每个 tick 都重新问一次** `matchMedia`：用户在系统设置里打开／关掉它时，
       * 宿主不会重新挂载插件，容器上的算得值也就不会变。缓存这一次读数的代价是「关了减弱动效
       * 之后鲸鲸一直站着」——而且此时 CSS 侧的动画已经被媒体查询停掉，JS 再改锚点就是纯跳位。
       * @returns {boolean} 是否处于减弱动效。
       */
      function refreshReduced() {
        if (state.params === null) return false
        state.params.reduced = prefersReducedMotion()
        if (state.params.reduced !== true) return false
        stopTicker()
        const now = Date.now()
        for (const runner of state.runners.values()) {
          if (runner.mode !== 'idle') stand(runner, plan.idleArt, runner.anchorPx, now, 'idle')
          runner.segment = -1
        }
        return true
      }

      /** 一个 tick：推进所有鲸鲸；全都静止了就停表（下一次 sync 会重新起表）。 */
      function tick() {
        if (state.container === null || state.container.isConnected !== true) {
          stopTicker()
          return
        }
        if (state.params === null) return
        if (refreshReduced()) return
        const now = Date.now()
        let moving = false
        for (const runner of state.runners.values()) {
          if (advance(runner, now)) moving = true
        }
        if (!moving) stopTicker()
      }

      function startTicker() {
        if (state.timer !== null || typeof setInterval !== 'function') return
        state.timer = setInterval(tick, TICK_MS)
      }

      function stopTicker() {
        if (state.timer === null) return
        if (typeof clearInterval === 'function') clearInterval(state.timer)
        state.timer = null
      }

      /** 依名册建/删节点，并把轨道长度写进容器。 */
      function paint(container, freeWidth) {
        const params = state.params
        if (params === null) return
        // 轨道右端 = 自由宽度 − 鲸鲸边长：跑到这里就是「到头了」。
        state.lapPx = Math.max(0, freeWidth - params.sizePx)
        container.style.setProperty('--oj-lap', round2(state.lapPx) + 'px')
        const now = Date.now()
        // 连一只鲸鲸都放不下（标签行太窄）时一只都不画——挤在边界上比不显示更难看。
        const fits = freeWidth >= params.sizePx
        const alive = new Set()
        for (const [position, entry] of state.entries.entries()) {
          if (!fits) break
          alive.add(entry.id)
          ensureRunner(entry, position, now)
        }
        for (const [id, runner] of state.runners) {
          if (alive.has(id)) continue
          runner.node.remove()
          state.runners.delete(id)
        }
        if (refreshReduced()) return
        startTicker()
        tick()
      }

      /** 轨道长度跟着标签行的宽度变；容器是绝对定位的，不会把观察者自己再触发一遍。 */
      function observe(anchor) {
        if (state.observer !== null && state.observer !== undefined) state.observer.disconnect()
        state.observer = null
        if (typeof ResizeObserver !== 'function') return
        state.observer = new ResizeObserver(function () {
          if (state.container === null || state.container.isConnected !== true) return
          paint(state.container, measure(state.container))
        })
        state.observer.observe(anchor)
      }

      /** 卸载：撤掉容器、观察者与定时器，下次 sync 会重新挂。 */
      function destroy() {
        drop()
        state.entries = []
      }

      return {
        /** 每次渲染后调用：更新名册、几何与节点。 */
        sync(holder, entries) {
          state.holder = holder
          state.entries = entries
          if (holder === null || holder === undefined) {
            destroy()
            return
          }
          const container = ensureContainer()
          if (container === null) return
          paint(container, measure(container))
        },
        destroy,
      }
    }

    /**
     * 内层组件：钩子只能在这里调用。外层先确认两个钩子真的在 props 里（外壳没装 ui-session 时
     * 就没有），缺了就不渲染它——不在渲染里做条件调用钩子的事。
     */
    function RunnerLayer(props) {
      const holder = React.useRef(null)
      const controller = React.useRef(null)
      const projections = props.useSessions(function (snapshot) {
        return snapshot.projectionsBySession
      })
      const summaries = props.useSessions(function (snapshot) {
        return snapshot.byId
      })
      const statuses = props.useSessionStatus(function (snapshot) {
        return snapshot
      })
      if (controller.current === null) controller.current = createController()
      // 无依赖数组 = 每次渲染后都同步一次：名册或状态一变就重画，DOM 节点按 id 复用。
      React.useEffect(function () {
        controller.current.sync(holder.current, readEntries(props.sessionId, projections, summaries, statuses))
      })
      // 依赖数组为空 = 只在卸载时跑清理。
      React.useEffect(function () {
        return function () {
          controller.current.destroy()
        }
      }, [])
      return React.createElement('span', { ref: holder, [ANCHOR_ATTR]: '', style: { display: 'none' } })
    }

    /**
     * 槽位条目本体：一个隐藏锚点 + 一层订阅。
     * @param {object} props - 外壳合并进来的 props（会话号、两个 store 钩子）。
     * @returns {unknown} 渲染结果。
     */
    function RunnerEntry(props) {
      if (typeof props.useSessions !== 'function' || typeof props.useSessionStatus !== 'function') return null
      return React.createElement(RunnerLayer, {
        sessionId: props.sessionId,
        useSessions: props.useSessions,
        useSessionStatus: props.useSessionStatus,
      })
    }

    return RunnerEntry
  }

  window.__ModuleLoader__.load({
    id: BUNDLE_ID,
    factory: function (require) {
      /** 外壳种子词：只有平台单例能 require，其余一切必须走 ctx。 */
      const React = require('react')

      /** @type {{ exports: { inject?: string[], apply?: (ctx: ClientContext) => void } }} */
      const module = { exports: {} }
      Object.defineProperty(module.exports, Symbol.toStringTag, { value: 'Module' })

      /** 跑道条目组件；React 由外壳种子词提供。 */
      const RunnerEntry = createRunnerEntry(React, RUNNER_PLAN)

      /**
       * 本插件不硬依赖任何客户端服务：两份样式表只需要 document，跑道在 `ctx.inject(['slots'], …)`
       * 里等槽位服务——它没到位时两块皮肤照常工作，不会带着整个插件一起 pending。
       * @type {string[]}
       */
      const inject = []

      /**
       * 装入三块组件，移除动作交给 Cordis effect 管理（插件卸载即还原）。
       * @param {ClientContext} ctx - 客户端根 Context。
       */
      function apply(ctx) {
        ctx.effect(function () {
          /** 皮肤样式表的撤销函数；null 表示未装。 */
          let skinOff = null
          /** 跑道样式表的撤销函数；null 表示未装。 */
          let runnerOff = null
          /** 列表样式表的撤销函数；null 表示未装。 */
          let catalogOff = null
          /** 跑道条目所在 fiber；null 表示未挂。 */
          let runnerFiber = null

          function setSkin(on) {
            if (on === (skinOff !== null)) return
            if (on) skinOff = installStylesheet(document, SKIN_STYLE_ID, SKIN_STYLESHEET)
            else {
              skinOff()
              skinOff = null
            }
          }

          function setCatalog(on) {
            if (on === (catalogOff !== null)) return
            if (on) catalogOff = installStylesheet(document, CATALOG_STYLE_ID, CATALOG_STYLESHEET)
            else {
              catalogOff()
              catalogOff = null
            }
          }

          function setRunners(on) {
            if (on === (runnerFiber !== null)) return
            if (!on) {
              runnerFiber.dispose()
              runnerFiber = null
              runnerOff()
              runnerOff = null
              return
            }
            // 样式表先装：条目的组件在挂载时会读算得值里的 --oj-* 参数。
            runnerOff = installStylesheet(document, RUNNER_STYLE_ID, RUNNER_STYLESHEET)
            // 同槽条目：不声明子槽（子槽键只能被声明一次，再声明会让整个客户端起不来），
            // 只往已声明的列表槽里加一格。disposer 归 fiber，卸载时自动撤销。
            runnerFiber = ctx.inject(['slots'], function (scoped) {
              scoped.effect(function () {
                return scoped.slots.inject(SLOT_KEY, function () {
                  return scoped.slots.register({ name: SLOT_KEY, id: SLOT_ENTRY_ID }, RunnerEntry)
                })
              }, BUNDLE_ID + ': runner entry')
            })
          }

          function applyFlags(flags) {
            setSkin(flags.skin === true)
            setRunners(flags.runners === true)
            setCatalog(flags.catalog === true)
          }

          readComponents(applyFlags)
          // 插件管理页改开关只重载宿主半区，浏览器束不会重跑——重新聚焦时重探一次，
          // 于是开关在运行期就生效，不必刷新页面。
          const reprobe = function () {
            if (document.visibilityState === 'visible') readComponents(applyFlags)
          }
          document.addEventListener('visibilitychange', reprobe)
          window.addEventListener('focus', reprobe)

          return function () {
            document.removeEventListener('visibilitychange', reprobe)
            window.removeEventListener('focus', reprobe)
            setSkin(false)
            setRunners(false)
            setCatalog(false)
          }
        }, BUNDLE_ID + ': components')
      }

      module.exports.inject = inject
      module.exports.apply = apply
      return module.exports
    },
  })
})()
