const staticPage = "M3D Viewer"
const assets = [
  "/",
  "index.html",
  "src/js/scripts.js",
  "src/styles/styles.css",
  "model/model.obj"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticPage).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
