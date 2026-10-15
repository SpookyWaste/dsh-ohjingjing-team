/**
 * `dsh-ohjingjing-team/catalog` 子路径入口：同一个实现模块的再导出。
 *
 * ## 为什么一个包要用子路径拆成三条 entry
 *
 * 插件管理页里**每个 switch 就是一条 cordis entry**，而每条 entry 的显示名与说明来自
 * `<条目名>/locale/<语言>.json`（`readPluginMeta()` 解析 `<specifier>/locale/en.json`，
 * 见 `@deepseek-ai/dsh-app-boot`）。同一个包名写三条 entry 时三行会显示同一份包名与描述——
 * 于是「各自真实的名字」只能靠**不同的模块规格符**：`dsh-ohjingjing-team/catalog` 与
 * `dsh-ohjingjing-team/runners` 各自读自己的 `locale/`。
 *
 * ## 客户端半区为什么必须留在裸包名上
 *
 * `dsh-client-modules` 只把**裸包名**（`exactPackageSpecifier()` 不接受斜杠）认成客户端来源，
 * 而且按包名去重：同一个包出现两个来源就直接抛
 * `package dsh-ohjingjing-team resolves from multiple active Loader sources`，整个 Web 客户端起不来。
 * 所以子路径条目**不会**注册客户端模块、也不会撞上那条约束；客户端那一份（样式表 + 跑道运行时）
 * 由裸名那条 entry 担着，它按宿主半区的 `components.json` 决定装哪几块。
 *
 * ## 这里只再导出，不复制实现
 *
 * 三条子路径与裸名条目都解析到 `src/index.ts` 这**同一个文件**，Node 的模块缓存因此给出
 * **同一个实例**：素材路由的引用计数与 `activeComponents` 注册表才能跨四条 entry 协调。
 * @module dsh-ohjingjing-team/catalog
 */
export { Config, apply, inject, name } from './index.js';
