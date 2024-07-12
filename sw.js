importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js')

workbox.setConfig({ debug: true })

const {
	routing: { registerRoute, setCatchHandler },
	strategies: { CacheFirst, NetworkFirst, StaleWhileRevalidate },
	cacheableResponse: { CacheableResponse, CacheableResponsePlugin },
	expiration: { ExpirationPlugin, CacheExpiration },
	precaching: { matchPrecache, precacheAndRoute }
} = workbox

precacheAndRoute([{ url: '404.html', revision: null }])

// Cache page navigations (html) with a Network First strategy
registerRoute(
	({ request, url }) => request.mode === 'navigate',
	new StaleWhileRevalidate({
		cacheName: 'pages',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200]
			})
		]
	})
)

// Cache CSS, JS, Manifest, and Web Worker
registerRoute(
	({ request }) =>
		request.destination === 'script' ||
		request.destination === 'style' ||
		request.destination === 'manifest' ||
		request.destination === 'worker',
	new CacheFirst({
		cacheName: 'static-assets',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200]
			}),
			new ExpirationPlugin({
				maxEntries: 32,
				maxAgeSeconds: 24 * 60 * 60 // 24 hours
			})
		]
	})
)

// Catch routing errors, like if the user is offline
setCatchHandler(async ({ event }) => {
	// Return the precached offline page if a document is being requested
	if (event.request.destination === 'document') {
		return matchPrecache('pwa/404.html')
	}

	return Response.error()
})
