import firebase from 'firebase/app';

const apiKey = 'AIzaSyAs7dR__0c_f4KCf2v5Kc-v3r-kn6YSFEk';
const projectId = 'lists-3832e';

export const initializeFirebase = () => {
  firebase.initializeApp({
    apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    databaseURL: `https://${projectId}.firebaseio.com`,
    projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: '36022833797',
    appID: '1:36022833797:web:2b1539f90118c710',
  });
}
