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

    if (Notification.permission === 'granted') {
        subscribe();
    }
}

function subscribe() {
    messaging.requestPermission()
        .then(function () {
            messaging.getToken()
                .then(function (currentToken) {
                    console.log(currentToken);

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.warn('Could not get token');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function (err) {
                    console.warn('Getting token error: ', err);
                    setTokenSentToServer(false);
                });
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
