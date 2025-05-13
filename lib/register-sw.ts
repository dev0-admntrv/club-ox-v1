"use client"

export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado com sucesso:", registration)
        })
        .catch((error) => {
          console.error("Erro ao registrar Service Worker:", error)
        })
    })
  }
}
