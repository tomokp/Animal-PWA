'use strict';
self.importScripts('./js/fetchGQL.js');
self.importScripts('./js/idb.js');
var cacheName = 'hello-pwa';
var filesToCache = [
    '/',
    './index.html',
    './css/font.css',
    './css/style.css',
    './js/main.js',
    './js/idb.js',
    './fonts/open-sans-v18-latin-regular.woff2',
    './images/background.png',
    './images/compass.svg',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', (e) => {
    e.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(cacheName);
                return cache.addAll(filesToCache);
            } catch (error) {
                console.error(error);
            }
        })()
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', (e) => {
    e.respondWith(
        (async () => {
            try {
                const response = await caches.match(e.request);
                return response || fetch(e.request);
            } catch (error) {
                console.error(error);
            }
        })()
    );
});

self.addEventListener("sync", (event) => {
    if (event.tag === "send-message") {
        event.waitUntil(sendToServer())
    }
})

const sendToServer = async () => {
    try {
        const outbox = await loadNewAnimalData("outbox")
        console.log("outbox", outbox)
        const sentMessages = await Promise.all(
            outbox.map(async (message) => {
                console.log("message", message)
                await addAnimal(message)
            })
        )
        console.log("sent messages", sentMessages)
        await clearNewAnimalData("outbox")
        await clearNewAnimalData("cache")
    } catch (e) {
        console.log(e.message);
    }
};
