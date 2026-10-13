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
/** 配置默认值；默认值是用户大概率会保留的那一档。 */
export const Config = Schema.object({
    assetRoute: Schema.string().default('/ohjingjing-team'),
    cacheControl: Schema.string().default('no-cache'),
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
 * 注册素材路由，并把撤销动作交给 Cordis effect 管理（插件卸载即撤销注册）。
 * @param ctx - 宿主根 Context，需已注入 `webServer`。
 * @param config - 已校验的配置。
 */
export function apply(ctx, config) {
    const assetDir = join(packageRoot(), 'assets');
    ctx.effect(() => ctx.webServer.register({
        kind: 'prefix',
        path: config.assetRoute,
        handler: (req, res) => {
            if (req.method !== 'GET' && req.method !== 'HEAD') {
                res.writeHead(405, { allow: 'GET, HEAD' });
                res.end();
                return;
            }
            // prefix 路由把 `${assetRoute}/<name>` 全部交给我们；只认清单里的别名，
            // 未登记的路径一律 404，天然杜绝路径穿越。
            const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
            const alias = pathname.slice(config.assetRoute.length).replace(/^\/+/, '');
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
    }), 'ohjingjing-team: asset route');
}
