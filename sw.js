/* 新加坡闹钟 · 离线缓存脚本
 * 策略：联网时先取最新文件（并更新缓存），断网时才用缓存。
 * 每次改版：把 VERSION 改成和 index.html 里 APP_VERSION 一样的新号。
 */
const VERSION = '1.1.1';
const CACHE = 'sg-alarm-v' + VERSION;
const AUDIO = [
  '01_Time_to_go_carpark.mp3',
  '02_Math_lesson.mp3',
  '03_Gym_lesson.mp3',
  '04_Seraphina_to_Jing_Ting_grandfather.mp3',
  '05_Robotic_lesson.mp3',
  '06_Remember_the_milk.mp3',
  '07_Transport_go_toilet.mp3',
  '08_Transport_go_to_lobby.mp3',
  '09_Fetch_the_gym_student.mp3'
].map(f => './audio/' + f);
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  ...AUDIO
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE.map(u => new Request(u, {cache: 'reload'}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('sg-alarm-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      // 联网：绕过浏览器的 HTTP 缓存，拿服务器上的最新版本
      const fresh = await fetch(req, {cache: 'no-store'});
      if (fresh && fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      // 断网：用缓存
      const hit = await cache.match(req, {ignoreSearch: true});
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const page = (await cache.match('./index.html')) || (await cache.match('./'));
        if (page) return page;
      }
      return new Response('离线且没有缓存', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
    }
  })());
});
