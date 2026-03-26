importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyBbELRLCA_M5ZAE5tuZd1XJDBjITjFq_W4",
  authDomain: "concept-builders-b6d0f.firebaseapp.com",
  projectId: "concept-builders-b6d0f",
  storageBucket: "concept-builders-b6d0f.firebasestorage.app",
  messagingSenderId: "957504675166",
  appId: "1:957504675166:web:f6507cdeb860cc76ee03cf",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon:
      payload.notification.icon || "/images/concept-builders-logo-free-bg.webp", // Fallback icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
