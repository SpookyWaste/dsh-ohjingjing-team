/**
 * dsh-ohjingjing-team 的宿主半区：把 `assets/` 下的状态精灵图挂成一条静态路由，
 * 并回答客户端半区的组件能力清单。
 *
 * 为什么不在浏览器束里内联图片：素材的内联形态（15 张 × 三档）会让 client 束涨到
 * 约 1 MB，而它们是懒加载资源——只有团队面板真的打开、图标位真的存在时
 * `var(--oj-art)` 才会兑现成一次请求。走路由后 client 束约 57 KB，素材可被浏览器缓存，
 * 换图也不必重新打包（改 `assets/` 即可）。
 *
 * 浏览器半区不能读本文件的值（客户端束没有配置通道，只能 require 外壳种子词），
 * 所以 `assetRoute` 的默认值在两处各写一次：这里定义**服务端**路径，
 * `tools/gen-client.mjs` 生成**客户端**用的同一路径。改路径要同时改两处，
 * `test-manifest.mjs` 会断言两者一致。
 *
 * ## 三块组件、三条 entry、一份路由
 *
 * `cordis.patch.yml` 里插入了**三条同名 entry**（同名是硬要求：客户端按「解析基 + 条目名」
 * 认定来源，不同名会被判成「同一个包来自多个活跃来源」而让整个 Web 客户端起不来），
 * 各自用 `config.component` 声明自己贡献哪一块组件。三条 entry 解析到同一个模块实例，
 * 因此这里用一个模块级注册表协调它们：
 *
 * - 素材路由**引用计数**：任一组件活跃，路由就在；最后一个卸载才撤销；
 * - `GET <assetRoute>/components.json` 报告当前活跃的组件，客户端束按它决定启用哪些。
 *
 * 于是插件管理页里关掉一块组件会立刻反映到清单上（宿主半区重载 → 清单变化 → 客户端
 * 重新聚焦时重探），而「只留一行 entry」的老写法（不带 `component`）仍然三块都要，
 * 行为与 0.4.0 的两块一致。
 */
import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import '@deepseek-ai/dsh-host-webserver';
/** 插件名：需与 package.json 的 name、bundle patch 的行名、浏览器模块 id 一致。 */
export declare const name = "dsh-ohjingjing-team";
/** 本插件需要 Web 服务器来托管素材；没有它就没有可注册的路由。 */
export declare const inject: string[];
/** 本插件贡献的三块组件。 */
export declare const COMPONENTS: readonly ['skin', 'runners', 'catalog'];
/** 组件名。 */
export type ComponentName = (typeof COMPONENTS)[number];
/** 组件能力清单的路径（相对素材路由）；客户端束按它门控三块组件。 */
export declare const COMPONENTS_PATH = "components.json";
/** 状态皮肤的可配置项。 */
export interface Config {
    /** 素材路由的路径前缀；浏览器半区按同一路径取图。 */
    assetRoute: string;
    /**
     * `Cache-Control` 值。
     * 默认 `no-cache` 让浏览器每次都带 `If-None-Match` 回验：命中返回 304（无正文）。
     * 素材文件名本身带内容哈希（见 `tools/gen-client.mjs`），所以长缓存也是安全的；
     * 保留回验只是让「就地替换 assets/ 里的图、不重新打包」也能立刻生效。
     */
    cacheControl: string;
    /**
     * 本 entry 贡献哪一块组件。
     *
     * - `skin` / `runners` / `catalog`：三块可分别开关的组件，`cordis.patch.yml` 里各占一条 entry；
     * - `client`：**前端资源**那条 entry。`dsh-client-modules` 只把**裸包名**认成客户端来源
     *   （子路径规格符一律不认），所以浏览器半区必须由写下包名的那条 entry 担着；它按
     *   `components.json` 决定装哪几块样式表，自己不是一项能力，因此不进活跃组件表；
     * - `all`（默认）：三块组件都要，兼容只写一行 entry 的旧清单。
     */
    component: ComponentName | 'client' | 'all';
}
/** 配置默认值；默认值是用户大概率会保留的那一档。 */
export declare const Config: Schema<Config>;
/**
 * 注册素材路由，并把撤销动作交给 Cordis effect 管理（插件卸载即撤销注册）。
 * @param ctx - 宿主根 Context，需已注入 `webServer`。
 * @param config - 已校验的配置。
 */
export declare function apply(ctx: Context, config: Config): void;
