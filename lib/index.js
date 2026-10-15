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
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Schema from '@deepseek-ai/schemastery';
// 只为 `Context.webServer` 的模块增补：这个包声明了它，但运行期由宿主提供。
import '@deepseek-ai/dsh-host-webserver';
/** 插件名：需与 package.json 的 name、bundle patch 的行名、浏览器模块 id 一致。 */
export const name = 'dsh-ohjingjing-team';
/** 本插件需要 Web 服务器来托管素材；没有它就没有可注册的路由。 */
export const inject = ['webServer'];
/** 本插件贡献的三块组件。 */
export const COMPONENTS = ['skin', 'runners', 'catalog'];
/** 组件能力清单的路径（相对素材路由）；客户端束按它门控三块组件。 */
export const COMPONENTS_PATH = 'components.json';
/**
 * 活跃组件注册表：四条 entry 加载同一个模块实例，靠它互相协调。
 *
 * 只在模块级记「谁在」；路由的注册与撤销由引用计数决定，所以任一组件活跃时素材都取得到，
 * 而四条都关掉之后（那时客户端束根本不会加载）不留一条空路由。客户端资源那条 entry
 * （`config.component: 'client'`）只参与引用计数，不往这张表里加东西——它不是一个能力。
 */
const activeComponents = new Set();
/** 素材路由的引用计数；0 → 1 注册，1 → 0 撤销。 */
let routeRefs = 0;
/** 三块组件的入口名（供日志与清单）；与 `COMPONENTS` 一一对应。 */
const COMPONENT_LABELS = { skin: '状态皮肤', runners: '标题栏跑道', catalog: '子代理列表' };
/** 客户端资源那条 entry 的入口名（供日志）；它不贡献组件，只让浏览器半区能被注册。 */
const CLIENT_LABEL = '前端资源';
/** 配置默认值；默认值是用户大概率会保留的那一档。 */
export const Config = Schema.object({
    assetRoute: Schema.string().default('/ohjingjing-team'),
    cacheControl: Schema.string().default('no-cache'),
    component: Schema.union(['skin', 'runners', 'catalog', 'client', 'all']).default('all'),
});
/** 文件扩展名到 MIME 类型；当前只有 PNG，保留映射表以便扩类型。 */
const MIME = {
    '.png': 'image/png',
};
/** 包根目录：本文件位于 `lib/`（或 tsc 前的 `src/`），上一级即包根。 */
function packageRoot() {
    return fileURLToPath(new URL('..', import.meta.url));
}
/**
 * 读取别名清单。
 *
 * 在运行期读 `assets/manifest.assets.json`，而不是 `import ... with { type: 'json' }`：
 * JSON 导入会被编译器复制到 `outDir` 下（`lib/assets/…`），把 `lib/` 的产物形状弄乱；
 * 而且别名表本来就与磁盘上的素材同源，和图片一起读更一致。首次读取后缓存。
 * @returns 清单内容。
 */
let manifestPromise;
function assetManifest() {
    manifestPromise ??= readFile(join(packageRoot(), 'assets', 'manifest.assets.json'), 'utf8').then((text) => JSON.parse(text));
    return manifestPromise;
}
/**
 * 由文件内容派生 ETag。
 * @param body - 文件字节。
 * @returns 带引号的强 ETag。
 */
function etagOf(body) {
    return `"${createHash('sha256').update(body).digest('hex').slice(0, 16)}"`;
}
/**
 * 按请求路径提供一张素材图。
 * @param assetDir - `assets/` 的绝对路径。
 * @param fileName - 已经过白名单校验的文件名。
 * @param cacheControl - 响应头的 `Cache-Control` 值。
 * @param req - 请求；用于读取 `If-None-Match`。
 * @param res - 响应；本处理器独占其生命周期。
 * @returns 响应写完后 resolve。
 */
async function sendAsset(assetDir, fileName, cacheControl, req, res) {
    const file = join(assetDir, fileName);
    let body;
    let mtimeMs;
    try {
        const info = await stat(file);
        if (!info.isFile())
            throw new Error(`${fileName} 不是普通文件`);
        body = await readFile(file);
        mtimeMs = info.mtimeMs;
    }
    catch {
        // 素材缺失是「包装错了/被裁剪过」的部署问题：响 404 并留下服务端日志，
        // 不用 500——浏览器端表现为「图标没换」，与官方原样一致，不至于把面板打坏。
        console.warn(`ohjingjing-team: 素材缺失 ${file}`);
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('asset not found');
        return;
    }
    const etag = etagOf(body);
    const headers = {
        'content-type': MIME[extname(fileName)] ?? 'application/octet-stream',
        'cache-control': cacheControl,
        etag,
        'last-modified': new Date(mtimeMs).toUTCString(),
    };
    if (req.headers['if-none-match'] === etag) {
        res.writeHead(304, headers);
        res.end();
        return;
    }
    headers['content-length'] = String(body.byteLength);
    res.writeHead(200, headers);
    res.end(body);
}
/**
 * 组件能力清单：客户端束按它门控三块组件。
 * @param res - 响应；本处理器独占其生命周期。
 */
function sendComponents(res) {
    const body = JSON.stringify({
        skin: activeComponents.has('skin'),
        runners: activeComponents.has('runners'),
        catalog: activeComponents.has('catalog'),
    });
    res.writeHead(200, {
        'content-type': 'application/json; charset=utf-8',
        // 清单随组件开关变化，不能缓存：客户端每次重新聚焦都会重探。
        'cache-control': 'no-store',
        'content-length': String(Buffer.byteLength(body)),
    });
    res.end(body);
}
/**
 * 注册素材路由，并把撤销动作交给 Cordis effect 管理（插件卸载即撤销注册）。
 * @param ctx - 宿主根 Context，需已注入 `webServer`。
 * @param config - 已校验的配置。
 */
export function apply(ctx, config) {
    const assetDir = join(packageRoot(), 'assets');
    /** 本次 entry 贡献的组件；`all` 表示三块都要（兼容只写一行 entry 的旧清单）。 */
    const mine = config.component === 'all' ? COMPONENTS : config.component === 'client' ? [] : [config.component];
    ctx.effect(() => {
        for (const component of mine)
            activeComponents.add(component);
        routeRefs += 1;
        /**
         * 素材路由由**第一个**活跃的 entry 注册，由最后一个撤销。
         * 四条 entry 的 `assetRoute` 一致（patch 里都没覆盖它，走 schema 默认值）；
         * 真被改成不同路径时，先注册的那条生效，其余条的素材 URL 会在浏览器里 404
         * —— 而这正是下面 `assetRoute !== manifest.assetRoute` 那条响亮失败的判据之一。
         */
        const disposeRoute = routeRefs === 1
            ? ctx.webServer.register({
                kind: 'prefix',
                path: config.assetRoute,
                handler: (req, res) => {
                    if (req.method !== 'GET' && req.method !== 'HEAD') {
                        res.writeHead(405, { allow: 'GET, HEAD' });
                        res.end();
                        return;
                    }
                    // prefix 路由把 `${assetRoute}/<name>` 全部交给我们：先应答组件清单，
                    // 其余只认清单里的别名，未登记的路径一律 404，天然杜绝路径穿越。
                    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
                    const alias = pathname.slice(config.assetRoute.length).replace(/^\/+/, '');
                    if (alias === COMPONENTS_PATH) {
                        sendComponents(res);
                        return;
                    }
                    void (async () => {
                        let manifest;
                        try {
                            manifest = await assetManifest();
                        }
                        catch (error) {
                            // 清单读不到说明包装不完整：响 500 并说明原因，别伪装成「素材不存在」。
                            console.error(`ohjingjing-team: 读不到素材清单：${String(error)}`);
                            res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
                            res.end('asset manifest unreadable');
                            return;
                        }
                        // 浏览器束里的 URL 用的是生成期的 assetRoute（生成物的一部分）。若配置改成了
                        // 别的路径，请求会正常路由到这里但别名永远对不上——那是「图标静默不换」，
                        // 比启动失败更难查，所以这里响亮失败。
                        if (config.assetRoute !== manifest.assetRoute) {
                            console.error(`ohjingjing-team: assetRoute 配置为 "${config.assetRoute}"，但生成期用的是 "${manifest.assetRoute}"——` +
                                '浏览器束里的素材 URL 按生成期路径写死；改路径需同时改 tools/gen-client.mjs 的 ASSET_ROUTE 并重新构建');
                            res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
                            res.end('asset route mismatch');
                            return;
                        }
                        const fileName = manifest.files.find((entry) => entry.alias === alias)?.file;
                        if (fileName === undefined) {
                            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
                            res.end('asset not found');
                            return;
                        }
                        await sendAsset(assetDir, fileName, config.cacheControl, req, res);
                    })();
                },
            })
            : undefined;
        return () => {
            for (const component of mine)
                activeComponents.delete(component);
            routeRefs -= 1;
            disposeRoute?.();
        };
    }, `ohjingjing-team: ${config.component === 'client' ? CLIENT_LABEL : mine.map((component) => COMPONENT_LABELS[component]).join(' + ')}`);
}
