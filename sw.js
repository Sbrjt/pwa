self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open('pwa').then((cache) => {
			return cache.addAll([
				'/',
				'/index.html',
				'/404.html',
				'/manifest.json',
				'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
				'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
			])
		})
	)
})

self.addEventListener('fetch', (e) => {
	// if user is offline send response from the cache
	// if resource is not found, return 404.html

	if (!navigator.onLine) {
		e.respondWith(caches.match(e.request).then((res) => res || caches.match('/404.html')))
	}
})

//
