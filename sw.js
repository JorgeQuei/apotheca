/* Apotheca — service worker.
   Existe por dois motivos: permitir o aviso do sistema no iPhone
   (a Apple exige que o app esteja instalado na tela de início e que a
   notificação saia daqui) e reabrir o app no lugar certo ao tocar no aviso. */
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil((async () => {
    const abas = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of abas) {
      if (c.url.includes("/apotheca")) { await c.focus(); c.postMessage({ ir: "comunidade" }); return; }
    }
    await self.clients.openWindow("./#comunidade");
  })());
});

/* Preparado para o envio pelo servidor (etapa seguinte): se um push chegar,
   mostra o aviso mesmo com o aplicativo fechado. */
self.addEventListener("push", e => {
  let d = { titulo: "🍷 Apotheca", corpo: "Você tem novidades na comunidade." };
  try { if (e.data) d = Object.assign(d, e.data.json()); } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.titulo, {
    body: d.corpo, icon: "icon-192.png", badge: "icon-192.png", tag: "apotheca", renotify: true
  }));
});
