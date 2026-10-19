# 新加坡闹钟（PWA）

文件：
- index.html — 应用本体（单文件，HTML + JS）
- sw.js — 离线缓存脚本（联网先取最新，断网用缓存）
- manifest.webmanifest — 主屏幕应用信息
- icons/icon-180.png、icon-192.png、icon-512.png — 图标
- audio/ — 9 个预置语音（mp3），随应用离线缓存

## 上传到 GitHub Pages
1. 登录 github.com → 右上角 “+” → New repository，起名如 `sg-alarm`，选 Public，创建。
2. 进入仓库 → Add file → Upload files，把 index.html、sw.js、manifest.webmanifest 以及整个 icons 和 audio 文件夹拖进去（保持文件夹结构）→ Commit changes。
3. 仓库 Settings → Pages → Source 选 “Deploy from a branch”，Branch 选 `main`、目录 `/ (root)` → Save。
4. 等 1–2 分钟，页面顶部会出现网址：`https://你的用户名.github.io/sg-alarm/`。
5. 用 iPhone 的 Safari 打开该网址 → 分享按钮 → “添加到主屏幕”。之后从主屏幕图标打开。
6. 首次打开后联网停留几秒，让离线缓存下载完；之后断网也能打开。

## 改版
同时修改 index.html 里的 `APP_VERSION` 和 sw.js 里的 `VERSION`（两处保持一致），再上传覆盖。
新增预置音频时：文件放进 audio/，并在 index.html 的 `PRESETS` 和 sw.js 的 `AUDIO` 两个列表里各加一行。页面底部会显示新版本号。
