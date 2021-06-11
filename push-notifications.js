firebase.initializeApp({
    apiKey: "AIzaSyBrHhjJDnYsxGyzbkhgsp8vTSV_JJs0GMw",
    authDomain: "pushnotifications-efe92.firebaseapp.com",
    projectId: "pushnotifications-efe92",
    storageBucket: "pushnotifications-efe92.appspot.com",
    messagingSenderId: "105409250819",
    appId: "1:105409250819:web:aee2ff70ba8c165e6c7036"
});

if ('Notification' in window) {
    var messaging = firebase.messaging();

    if (Notification.permission === 'denied') {
        console.warn('The user has blocked notifications.');
    }

    if (Notification.permission === 'granted') {
        //...
    }

    // Handle notification
    messaging.onMessage(payload => {
        console.log('Message received. ', payload);

        const data = JSON.parse(payload.data.notification);

        // register fake ServiceWorker for show notification on mobile devices
        navigator.serviceWorker.register('/firebase-messaging-sw.js');
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(data.title, data);
        }).catch(function(error) {
            // registration failed
            console.error('ServiceWorker registration failed', error);
        });

        // new Notification(data.title, data);
    });
}

function notify() {
    messaging.requestPermission()
        .then(function () {
            const savedToken = window.localStorage.getItem('sentFirebaseMessagingToken');

            if (savedToken !== null && savedToken !== '') {
                sendNotification(savedToken);
            } else {
                // Get registration token. Initially this makes a network call, once retrieved
                // subsequent calls to getToken will return from cache.
                messaging.getToken({vapidKey: 'BDckMhqZPwbFtVZNbfvLYG9fqB87OcllXELyfn32Zeu27NDnfsbOMRs8GJuezAnL1u4xCwA-3CgmYS48PFde3tw'}).then((currentToken) => {
                    if (currentToken) {
                        sendTokenToServer(currentToken);
                        sendNotification(currentToken);
                    } else {
                        // Show permission request UI
                        console.log('No registration token available. Request permission to generate one.');
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    setTokenSentToServer(false);
                });
            }
        })
        .catch(function (err) {
            console.warn('Could not get permission for sending notification: ', err);
        });
}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Sending token to the server...');

        // save token on the server
        // var serverUrl = '';
        // $.post(serverUrl, {
        //     token: currentToken
        // });

        setTokenSentToServer(currentToken);
    } else {
        console.log('Token is already sent to the server');
    }
}

function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') === currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}

function sendNotification(token) {
    fetch(
        'https://slavik.pythonanywhere.com/api/v1.0/send_notification?user_token='+token
    ).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.error(error);
    });
}
