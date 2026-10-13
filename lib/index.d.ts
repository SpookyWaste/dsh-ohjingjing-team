/**
 * dsh-ohjingjing-team 的宿主半区：把 `assets/` 下的状态精灵图挂成一条静态路由。
 *
 * 为什么不在浏览器束里内联图片：素材的内联形态（15 张 × 三档）会让 client 束涨到
 * 约 1 MB，而它们是懒加载资源——只有团队面板真的打开、图标位真的存在时
 * `var(--oj-art)` 才会兑现成一次请求。走路由后 client 束约 46 KB，素材可被浏览器缓存，
 * 换图也不必重新打包（改 `assets/` 即可）。
 *
 * 浏览器半区不能读本文件的值（客户端束没有配置通道，只能 require 外壳种子词），
 * 所以 `assetRoute` 的默认值在两处各写一次：这里定义**服务端**路径，
 * `tools/gen-client.mjs` 生成**客户端**用的同一路径。改路径要同时改两处，
 * `test-manifest.mjs` 会断言两者一致。
 */
import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import '@deepseek-ai/dsh-host-webserver';
/** 插件名：需与 package.json 的 name、bundle patch 的行名、浏览器模块 id 一致。 */
export declare const name = "dsh-ohjingjing-team";
/** 本插件需要 Web 服务器来托管素材；没有它就没有可注册的路由。 */
export declare const inject: string[];
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
}
/** 配置默认值；默认值是用户大概率会保留的那一档。 */
export declare const Config: Schema<Config>;
/**
 * 注册素材路由，并把撤销动作交给 Cordis effect 管理（插件卸载即撤销注册）。
 * @param ctx - 宿主根 Context，需已注入 `webServer`。
 * @param config - 已校验的配置。
 */
export declare function apply(ctx: Context, config: Config): void;
