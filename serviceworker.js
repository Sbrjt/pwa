self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open('pwa').then(function (cache) {
			return cache.addAll(['/'])
		})
	)
})

self.addEventListener('fetch', async (e) => {
	e.respondWith(
		(async () => {
			const response = await caches.match(e.request)
			return response || fetch(e.request)
		})()
	)
})
