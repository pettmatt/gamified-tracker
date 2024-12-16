/* eslint-disable no-console */
// import { register } from "register-service-worker"

if ("seviceWorker" in navigator) {
    navigator.serviceWorker
        .register(`gamified-test-${new Date().getTime()}-service-worker.js`, {
            ready() {
                console.log(
                    "App is being served from cache by a service worker.\n" +
                        "For more details, visit https://goo.gl/AFskqB"
                )
            },
            registered() {
                console.log("Service worker has been registered.")
            },
            cached() {
                console.log("Content has been cached for offline use.")
            },
            updatefound() {
                console.log("New content is downloading.")
            },
            updated() {
                console.log("New content is available; please refresh.")
            },
            offline() {
                console.log("No internet connection found. App is running in offline mode.")
            },
            error(error) {
                console.error("Error during service worker registration:", error)
            }
        })
        .then((registration) => {
            console.log("Service worker registration completed:", registration)
        })
        .catch((error) => {
            console.error("Service worker registration failed:", error)
        })

    if (navigator.serviceWorker.controller) {
        console.log("The page is currently controlled by:", navigator.serviceWorker.controller)
    }

    navigator.serviceWorker.oncontrollerchange = () => {
        console.log("The page is now controller by:", navigator.serviceWorker.controller)
    }
} else {
    console.log("Service workers are not supported in this browser.")
}
