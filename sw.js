const scope = globalThis;
const BASE = new URL('./', scope.location.href), PREFIX = 'qfg-shell:' + BASE.pathname + ':', CACHE = PREFIX + '0599f4e05f6d58bf', ASSETS = ["app/game.html", "assets/index-BpBou3AB.css", "assets/index-SW8usjIL.js", "audio/medieval_fantasy_victory_fanfare_3s.wav", "fonts/body.ttf", "fonts/cinzel.ttf", "fonts/gothic.ttf", "fonts/righteous.woff2", "icons/icon-192.png", "icons/icon-512.png", "icons/location-city.svg", "icons/location-dungeon.svg", "icons/meeple-hero.svg", "icons/meeple-ranger.svg", "icons/meeple-spellcaster.svg", "index.html", "manifest.webmanifest"].map(file => file.replaceAll('\\', '/'));
scope.addEventListener('install', event => event.waitUntil((async () => { const cache = await caches.open(CACHE); await cache.addAll(ASSETS.map(file => new URL(file, BASE).href)); })()));
scope.addEventListener('activate', event => event.waitUntil((async () => { await scope.clients.claim(); const keys = await caches.keys(); const previous = keys.filter(key => key.startsWith(PREFIX) && key !== CACHE); for (const key of previous.slice(0, -2))
    await caches.delete(key); })()));
scope.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING')
    scope.skipWaiting(); if (event.data?.type === 'CHECK_OFFLINE')
    event.waitUntil((async () => { const missing = []; try {
        const cache = await caches.open(CACHE);
        await Promise.all(ASSETS.map(async (file) => { const url = new URL(file, BASE).href; if (await cache.match(url))
            return; if (event.data.repair) {
            try {
                const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
                if (response.ok) {
                    await cache.put(url, response);
                    return;
                }
            }
            catch { }
        } missing.push(file); }));
        event.ports[0]?.postMessage({ type: 'OFFLINE_STATUS', ready: missing.length === 0, missing });
    }
    catch {
        event.ports[0]?.postMessage({ type: 'OFFLINE_STATUS', ready: false, missing: ASSETS });
    } })()); });
scope.addEventListener('fetch', event => { const request = event.request, url = new URL(request.url); if (request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname))
    return; const relative = url.pathname.slice(BASE.pathname.length); if (relative.startsWith('data/')) {
    event.respondWith(fetch(new Request(request, { cache: 'no-store' })));
    return;
} if (request.mode === 'navigate') {
    event.respondWith((async () => { const cache = await caches.open(CACHE); return await cache.match(new URL('index.html', BASE).href) || fetch(request); })());
    return;
} if (!ASSETS.includes(relative) && !['app/', 'assets/', 'fonts/', 'audio/', 'icons/'].some(prefix => relative.startsWith(prefix)))
    return; event.respondWith((async () => { const cache = await caches.open(CACHE); const current = await cache.match(new URL(relative, BASE).href); if (current)
    return current; for (const key of (await caches.keys()).filter(key => key.startsWith(PREFIX) && key !== CACHE).reverse()) {
    const previous = await (await caches.open(key)).match(request, { ignoreSearch: true });
    if (previous)
        return previous;
} return fetch(request); })()); });

