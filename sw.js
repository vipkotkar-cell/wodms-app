const CACHE = "wodms-pwa-v1";
const CORE = ["./", "./index.html"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e){
  if(e.request.url.includes("script.google.com")){
    e.respondWith(fetch(e.request).catch(function(){
      return new Response(JSON.stringify({error:"You are offline. Please reconnect."}), {headers:{"Content-Type":"application/json"}});
    }));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(r){ return r || fetch(e.request); })
  );
});
