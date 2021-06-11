// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBrHhjJDnYsxGyzbkhgsp8vTSV_JJs0GMw",
    authDomain: "pushnotifications-efe92.firebaseapp.com",
    projectId: "pushnotifications-efe92",
    storageBucket: "pushnotifications-efe92.appspot.com",
    messagingSenderId: "105409250819",
    appId: "1:105409250819:web:aee2ff70ba8c165e6c7036"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle notification
messaging.onMessage(function(payload) {
    console.log('Message received. ', payload);
    new Notification(payload.notification.title, payload.notification);
});