/* 新加坡闹钟 · 离线缓存脚本
 * 策略：联网时先取最新文件（并更新缓存），断网时才用缓存。
 * 每次改版：把 VERSION 改成和 index.html 里 APP_VERSION 一样的新号。
 */
const VERSION = '1.3.0';
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
  '09_Fetch_the_gym_student.mp3',
  '10_Fetch_the_robotic_students.mp3',
  '11_Janelle_Lim_level3_gym.mp3',
  '12_Kidz_Amaze_count_heads.mp3',
  '13_Kidz_Amaze_back_teabreak.mp3',
  '14_Olivia_Lim_Julia_level3_gym.mp3',
  '15_Ann_Yee_level3_gym.mp3',
  '16_Watch_for_Julia.mp3',
  '17_Yu_Cheng_level3_ICR.mp3',
  '18_Shane_ICR.mp3',
  '19_Ann_Yu_Clarys_gym.mp3',
  '20_Teabreak_milk.mp3',
  '21_Pack_Shane_bag.mp3',
  '22_Seraphina_Jing_Ting_swim.mp3',
  '23_Level3_ICR_four_students.mp3',
  '24_Level2_water_play.mp3',
  '25_Thursday_swimmers.mp3',
  '26_Water_play_shower.mp3',
  '27_Water_play_upstairs.mp3',
  '28_Water_play_teabreak.mp3',
  '29_Five_pm_swimmers_upstairs.mp3',
  '30_Nathanael_level3_ICR.mp3',
  '31_Desiree_go_home.mp3',
  '32_Yi_Zhen_Jun_Yi_swimming.mp3',
  '33_Four_pm_swimmers_change.mp3',
  '34_Taekwondo.mp3',
  '35_Send_four_pm_swimmers.mp3',
  '36_Teabreak_TV_milk.mp3',
  '37_Shane_bag_PS_teacher.mp3'
].map(f => './' + f);
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  ...AUDIO
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(CORE.map(u => c.add(new Request(u, {cache: 'reload'})))))
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
