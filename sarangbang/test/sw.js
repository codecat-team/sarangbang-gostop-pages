// 사랑방 고스톱 웹 앱 서비스 워커 (B19 PWA). 빌드 때 vite.config.ts 가 목록·버전을 채워 dist/sw.js 로 쓴다 (src/pwa/precache.ts).
// - 설치: 앱 파일 전부를 새 캐시에 받아 둔다 → 인터넷이 끊겨도 판을 열고 둘 수 있다.
// - 첫 화면(index.html): 인터넷이 되면 늘 새로 받고(새 버전이 바로 보이게), 안 되거나 4초 넘게 걸리면 받아 둔 것.
// - 나머지 파일: 받아 둔 것을 먼저 쓰고, 없으면 받아서 넣어 둔다.
// - 새 버전: 받아 두기가 끝나면 바로 넘겨받고 옛 캐시를 지운다. 열려 있던 화면은 하던 그대로 두고, 다음에 열 때 새 버전이 뜬다.
//   (판 도중 강제 새로 고침 없음. 앱 코드는 시작 때 다 불러 두므로 옛 화면이 나중에 옛 파일을 찾을 일이 없다)
const VERSION = "1.0.0-49ca2b5e28c6";
const PRECACHE = ["./","apple-touch-icon.png","assets/BitmapFont-BrmMh3GB.js","assets/BitmapFont-DMFvp00D.js","assets/Cache-CqzsG7Ma.js","assets/CanvasPool-DNNJ9Ntj.js","assets/CanvasRenderer--I2g3ND0.js","assets/CanvasRenderer-DmR_wgGf.js","assets/Filter-k9A4pRjt.js","assets/GCManagedHash-Dx_nabd7.js","assets/GraphicsContext-DYpTmK13.js","assets/RenderTargetSystem-CnMWlPMh.js","assets/WebGLRenderer-CVUnOuC9.js","assets/WebGLRenderer-CsIa-vMn.js","assets/WebGPURenderer-CEHVZ54u.js","assets/WebGPURenderer-DyUO5AsI.js","assets/browserAll-sFYNzCW7.js","assets/canvasUtils-CqWe3Mmq.js","assets/capacitor-DTjMw1cR.js","assets/consent-status.enum-CdMsqkrY.js","assets/definitions-BdWVgBTV.js","assets/dist-DHjjB8zm.js","assets/getPo2TextureFromSource-Dsy3U_lU.js","assets/getTexelRangeRects-uyY4RQk6.js","assets/getTextureBatchBindGroup-DPTJa0eo.js","assets/index-ChdG5JON.css","assets/index-DpOMW93g.js","assets/init-CHEaKx1a.js","assets/noto-serif-kr-0-700-normal-BBpAz5GP.woff2","assets/noto-serif-kr-1-700-normal-DNMaq9vR.woff2","assets/noto-serif-kr-10-700-normal-BiRg8Mc2.woff2","assets/noto-serif-kr-100-700-normal-BSTibo37.woff2","assets/noto-serif-kr-101-700-normal-DIHW2MJr.woff2","assets/noto-serif-kr-102-700-normal-Pg1KlKjw.woff2","assets/noto-serif-kr-103-700-normal-mKQPbnX0.woff2","assets/noto-serif-kr-104-700-normal-DJ4sLlL0.woff2","assets/noto-serif-kr-105-700-normal-BhUN_Fz7.woff2","assets/noto-serif-kr-106-700-normal-B2EOZhvr.woff2","assets/noto-serif-kr-107-700-normal-DNmCV7d5.woff2","assets/noto-serif-kr-108-700-normal-D9QETiMk.woff2","assets/noto-serif-kr-109-700-normal-BD09X4x9.woff2","assets/noto-serif-kr-11-700-normal-KpLxUqbI.woff2","assets/noto-serif-kr-110-700-normal-DFOofkPp.woff2","assets/noto-serif-kr-111-700-normal-CrgFioLv.woff2","assets/noto-serif-kr-112-700-normal-DF9vNhih.woff2","assets/noto-serif-kr-113-700-normal-C3bUPOJ1.woff2","assets/noto-serif-kr-114-700-normal-BqU8x6n7.woff2","assets/noto-serif-kr-115-700-normal-DMGaDpLH.woff2","assets/noto-serif-kr-116-700-normal-DJM7i8dS.woff2","assets/noto-serif-kr-117-700-normal-BOmIwkst.woff2","assets/noto-serif-kr-118-700-normal-Dv6IzmGX.woff2","assets/noto-serif-kr-119-700-normal-CuFEP7ih.woff2","assets/noto-serif-kr-12-700-normal-DVyZQZ_Z.woff2","assets/noto-serif-kr-13-700-normal-BYehz_er.woff2","assets/noto-serif-kr-14-700-normal-C8kjNMQD.woff2","assets/noto-serif-kr-15-700-normal-DOME8sxZ.woff2","assets/noto-serif-kr-16-700-normal-0WmWSHBr.woff2","assets/noto-serif-kr-17-700-normal-UbaS0Luz.woff2","assets/noto-serif-kr-18-700-normal-CEznm4Sc.woff2","assets/noto-serif-kr-19-700-normal-BaYAnmp5.woff2","assets/noto-serif-kr-2-700-normal-D7zgWc7p.woff2","assets/noto-serif-kr-20-700-normal-BrfrhTiW.woff2","assets/noto-serif-kr-21-700-normal-DVcT8mbX.woff2","assets/noto-serif-kr-22-700-normal-D8wIWLZb.woff2","assets/noto-serif-kr-23-700-normal-tVOQvzwC.woff2","assets/noto-serif-kr-24-700-normal-OlvgQz5N.woff2","assets/noto-serif-kr-25-700-normal-9zOM7she.woff2","assets/noto-serif-kr-26-700-normal-BxpyZIKO.woff2","assets/noto-serif-kr-27-700-normal-oB5essUl.woff2","assets/noto-serif-kr-28-700-normal-BwTWWamm.woff2","assets/noto-serif-kr-29-700-normal-iR24AOyH.woff2","assets/noto-serif-kr-3-700-normal-C1KUs9mE.woff2","assets/noto-serif-kr-30-700-normal-DrMnEJg9.woff2","assets/noto-serif-kr-31-700-normal-iojG2QC5.woff2","assets/noto-serif-kr-32-700-normal-aoHANk62.woff2","assets/noto-serif-kr-33-700-normal-DN0K7WgU.woff2","assets/noto-serif-kr-34-700-normal-si5ATijV.woff2","assets/noto-serif-kr-35-700-normal-BPM66acW.woff2","assets/noto-serif-kr-36-700-normal-w6AknxBj.woff2","assets/noto-serif-kr-37-700-normal-BwDlvnxn.woff2","assets/noto-serif-kr-38-700-normal-CXUN76rD.woff2","assets/noto-serif-kr-39-700-normal-BOoBm1bw.woff2","assets/noto-serif-kr-4-700-normal-CCjJjJ4L.woff2","assets/noto-serif-kr-40-700-normal-me3katFl.woff2","assets/noto-serif-kr-41-700-normal-BdMOtd4A.woff2","assets/noto-serif-kr-42-700-normal-CMMoOYpV.woff2","assets/noto-serif-kr-43-700-normal-Cq0LByFF.woff2","assets/noto-serif-kr-44-700-normal-BQHBi0xq.woff2","assets/noto-serif-kr-45-700-normal-Bzik2AF7.woff2","assets/noto-serif-kr-46-700-normal-DuBnvUMF.woff2","assets/noto-serif-kr-47-700-normal-DP7y9uxA.woff2","assets/noto-serif-kr-48-700-normal-dsm7RRSA.woff2","assets/noto-serif-kr-49-700-normal-DrpI3pMQ.woff2","assets/noto-serif-kr-5-700-normal-DByLr--O.woff2","assets/noto-serif-kr-50-700-normal-iaj1X7Rs.woff2","assets/noto-serif-kr-51-700-normal-D4AZQeyl.woff2","assets/noto-serif-kr-52-700-normal-DMmsI6KC.woff2","assets/noto-serif-kr-53-700-normal-enN0-J9z.woff2","assets/noto-serif-kr-54-700-normal-CCKpeuel.woff2","assets/noto-serif-kr-55-700-normal-CDuPwz91.woff2","assets/noto-serif-kr-56-700-normal-Czs85_wp.woff2","assets/noto-serif-kr-57-700-normal-B5DAV6ME.woff2","assets/noto-serif-kr-58-700-normal-BBXJGaVk.woff2","assets/noto-serif-kr-59-700-normal-XUcZJ8P0.woff2","assets/noto-serif-kr-6-700-normal-CK9ybQfs.woff2","assets/noto-serif-kr-60-700-normal-CnigKROG.woff2","assets/noto-serif-kr-61-700-normal-C-wj3yNt.woff2","assets/noto-serif-kr-62-700-normal-BuY_zSKo.woff2","assets/noto-serif-kr-63-700-normal-CepNhy30.woff2","assets/noto-serif-kr-64-700-normal-i5qJlSlN.woff2","assets/noto-serif-kr-65-700-normal-DLoIrYDv.woff2","assets/noto-serif-kr-66-700-normal-yxADPvmR.woff2","assets/noto-serif-kr-67-700-normal-BGjztkxD.woff2","assets/noto-serif-kr-68-700-normal-Cfx9Y3e7.woff2","assets/noto-serif-kr-69-700-normal-CXyT2UO8.woff2","assets/noto-serif-kr-7-700-normal-BzTuWdZd.woff2","assets/noto-serif-kr-70-700-normal-C4U3i0tZ.woff2","assets/noto-serif-kr-71-700-normal-CggvmYNW.woff2","assets/noto-serif-kr-72-700-normal-Dc4uoKan.woff2","assets/noto-serif-kr-73-700-normal-D9V92x1w.woff2","assets/noto-serif-kr-74-700-normal-sHyszA2d.woff2","assets/noto-serif-kr-75-700-normal-DlxRPHp3.woff2","assets/noto-serif-kr-76-700-normal-SK5y9Zua.woff2","assets/noto-serif-kr-77-700-normal-BYWoU-_T.woff2","assets/noto-serif-kr-78-700-normal-CpouzdX0.woff2","assets/noto-serif-kr-79-700-normal-DYEtJYXU.woff2","assets/noto-serif-kr-8-700-normal-Cv5-WmXg.woff2","assets/noto-serif-kr-80-700-normal-CDGClDDl.woff2","assets/noto-serif-kr-81-700-normal-BO388p5k.woff2","assets/noto-serif-kr-82-700-normal-CwRimvX7.woff2","assets/noto-serif-kr-83-700-normal-Co9T5Gcz.woff2","assets/noto-serif-kr-84-700-normal-Cf4KcfoS.woff2","assets/noto-serif-kr-85-700-normal-D1iiXDWZ.woff2","assets/noto-serif-kr-86-700-normal-z5u1tiYQ.woff2","assets/noto-serif-kr-87-700-normal-B1HRG8FY.woff2","assets/noto-serif-kr-88-700-normal-BDZEmXAE.woff2","assets/noto-serif-kr-89-700-normal-amg7QoJh.woff2","assets/noto-serif-kr-9-700-normal-DkOEsexR.woff2","assets/noto-serif-kr-90-700-normal-DePHxV2z.woff2","assets/noto-serif-kr-91-700-normal-CWi1mV3E.woff2","assets/noto-serif-kr-92-700-normal-BPw54f7R.woff2","assets/noto-serif-kr-93-700-normal-BVZK-Guy.woff2","assets/noto-serif-kr-94-700-normal-Di-tjKMQ.woff2","assets/noto-serif-kr-95-700-normal-WJb0ngBt.woff2","assets/noto-serif-kr-96-700-normal-DbTPhPsJ.woff2","assets/noto-serif-kr-97-700-normal-AGysnyvy.woff2","assets/noto-serif-kr-98-700-normal-BdCxlR0K.woff2","assets/noto-serif-kr-99-700-normal-CKMOM0lB.woff2","assets/noto-serif-kr-cyrillic-700-normal-Dl5z72p1.woff2","assets/noto-serif-kr-latin-700-normal-CESDpZYM.woff2","assets/noto-serif-kr-latin-ext-700-normal-BN00K3Tu.woff2","assets/noto-serif-kr-vietnamese-700-normal-DXV4uGs6.woff2","assets/webworkerAll-BUobJLv6.js","cards-own/0.svg","cards-own/1.svg","cards-own/10.svg","cards-own/11.svg","cards-own/12.svg","cards-own/13.svg","cards-own/14.svg","cards-own/15.svg","cards-own/16.svg","cards-own/17.svg","cards-own/18.svg","cards-own/19.svg","cards-own/2.svg","cards-own/20.svg","cards-own/21.svg","cards-own/22.svg","cards-own/23.svg","cards-own/24.svg","cards-own/25.svg","cards-own/26.svg","cards-own/27.svg","cards-own/28.svg","cards-own/29.svg","cards-own/3.svg","cards-own/30.svg","cards-own/31.svg","cards-own/32.svg","cards-own/33.svg","cards-own/34.svg","cards-own/35.svg","cards-own/36.svg","cards-own/37.svg","cards-own/38.svg","cards-own/39.svg","cards-own/4.svg","cards-own/40.svg","cards-own/41.svg","cards-own/42.svg","cards-own/43.svg","cards-own/44.svg","cards-own/45.svg","cards-own/46.svg","cards-own/47.svg","cards-own/5.svg","cards-own/6.svg","cards-own/7.svg","cards-own/8.svg","cards-own/9.svg","cards-own/back.svg","cards-own/index.json","cards/Hwatu_April_Kasu_1.svg","cards/Hwatu_April_Kasu_2.svg","cards/Hwatu_April_Tane.svg","cards/Hwatu_April_Tanzaku.svg","cards/Hwatu_August_Hikari.svg","cards/Hwatu_August_Kasu_1.svg","cards/Hwatu_August_Kasu_2.svg","cards/Hwatu_August_Tane.svg","cards/Hwatu_December_Hikari.svg","cards/Hwatu_December_Kasu.svg","cards/Hwatu_December_Tane.svg","cards/Hwatu_December_Tanzaku.svg","cards/Hwatu_February_Kasu_1.svg","cards/Hwatu_February_Kasu_2.svg","cards/Hwatu_February_Tane.svg","cards/Hwatu_February_Tanzaku.svg","cards/Hwatu_January_Hikari.svg","cards/Hwatu_January_Kasu_1.svg","cards/Hwatu_January_Kasu_2.svg","cards/Hwatu_January_Tanzaku.svg","cards/Hwatu_July_Kasu_1.svg","cards/Hwatu_July_Kasu_2.svg","cards/Hwatu_July_Tane.svg","cards/Hwatu_July_Tanzaku.svg","cards/Hwatu_June_Kasu_1.svg","cards/Hwatu_June_Kasu_2.svg","cards/Hwatu_June_Tane.svg","cards/Hwatu_June_Tanzaku.svg","cards/Hwatu_March_Hikari.svg","cards/Hwatu_March_Kasu_1.svg","cards/Hwatu_March_Kasu_2.svg","cards/Hwatu_March_Tanzaku.svg","cards/Hwatu_May_Kasu_1.svg","cards/Hwatu_May_Kasu_2.svg","cards/Hwatu_May_Tane.svg","cards/Hwatu_May_Tanzaku.svg","cards/Hwatu_November_Hikari.svg","cards/Hwatu_November_Kasu_1.svg","cards/Hwatu_November_Kasu_2.svg","cards/Hwatu_November_Kasu_3.svg","cards/Hwatu_October_Kasu_1.svg","cards/Hwatu_October_Kasu_2.svg","cards/Hwatu_October_Tane.svg","cards/Hwatu_October_Tanzaku.svg","cards/Hwatu_September_Kasu_1.svg","cards/Hwatu_September_Kasu_2.svg","cards/Hwatu_September_Tane.svg","cards/Hwatu_September_Tanzaku.svg","cards/README.md","favicon.png","favicon.svg","fonts/Pretendard-Bold.subset.woff2","fonts/Pretendard-Regular.subset.woff2","icon-192.png","icon-512.png","icon-maskable-512.png","manifest.webmanifest","privacy.html","sounds/capture.wav","sounds/flip.wav","sounds/slam-2.wav","sounds/slam-3.wav","sounds/slam-soft.wav","sounds/slam.wav","sounds/steal.wav","sounds/ttadak.wav"];
const CACHE = `sarangbang-${VERSION}`;
const NAV_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // cache: 'reload' = 브라우저 HTTP 캐시의 옛 파일 말고 서버에서 새로
      .then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sarangbang-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** 첫 화면: 인터넷 먼저(제한 시간), 안 되면 받아 둔 첫 화면 */
async function navigate(request) {
  const cache = await caches.open(CACHE);
  // 시작 주소(범위 맨 위, ?뒤는 무시)만 첫 화면 자리에 넣는다 — privacy.html 같은 다른 HTML 을 열어도 오프라인 첫 화면이 안 바뀌게
  const isStart = new URL(request.url).pathname === new URL('./', self.registration.scope).pathname;
  try {
    const res = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NAV_TIMEOUT_MS)),
    ]);
    if (res.ok) {
      // 첫 화면 자리에는 HTML 만 (주소창으로 연 그림·글 파일이 오프라인 첫 화면이 되지 않게)
      if (isStart && (res.headers.get('content-type') ?? '').includes('text/html')) void cache.put('./', res.clone());
      return res;
    }
  } catch {
    /* 오프라인·느림 → 아래 */
  }
  // 오프라인: 시작 주소가 아니면 받아 둔 그 파일(방침 등)을 먼저, 없으면 첫 화면
  const own = isStart ? undefined : await cache.match(request, { ignoreSearch: true, ignoreVary: true });
  return own ?? (await cache.match('./', { ignoreVary: true })) ?? Response.error();
}

/** 나머지: 받아 둔 것 먼저, 없으면 받아서 넣어 둔다 (글꼴 조각 등 목록에 없던 것) */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  // ignoreVary: 서버가 'Vary: Origin' 을 붙이면, 받아 둘 때(Origin 없음)와 모듈 스크립트 요청(Origin 있음)이 달라 못 찾는다 (오프라인 빈 화면)
  const hit = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && res.type === 'basic') void cache.put(request, res.clone());
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 다른 곳(광고 등)은 손대지 않는다
  if (req.mode === 'navigate') event.respondWith(navigate(req));
  else event.respondWith(cacheFirst(req));
});
