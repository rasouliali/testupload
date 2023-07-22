// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCoToca60GglwD8g0Yug3sVb1VhyuTBwdE",
    authDomain: "messenger-706cf.firebaseapp.com",
    projectId: "messenger-706cf",
    storageBucket: "messenger-706cf.appspot.com",
    messagingSenderId: "1004836193135",
    appId: "1:1004836193135:web:3cbad83fae423a4c2f9e9a",
    measurementId: "G-FVFJWFC0RF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const messaging = firebase.messaging();
messaging.requestPermission()
    .then(function () { console.log("have permission"); return messaging.getToken() })
    .then(function (token) { $.post('/Home/SetFCMToken', { token }, function () { }); })
    .catch(function (err) { console.log(err); });
messaging.onMessage(function (payload) {
    console.log('onMessage');
    console.log(payload);

});