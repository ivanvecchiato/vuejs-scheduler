import firebase from '@firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAyjEanyCt9txiGHhFAsvjABW2Fl7mRLOE",
  authDomain: "vuejs-3d944.firebaseapp.com",
  databaseURL: "https://vuejs-3d944.firebaseio.com",
  projectId: "vuejs-3d944",
  storageBucket: "vuejs-3d944.appspot.com",
  messagingSenderId: "212015278069",
  appId: "1:212015278069:web:0eae1a12465725b91322bc"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.firestore().enablePersistence()

export default {
    db: firebaseApp.firestore(),
    auth: firebase.auth(),
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
      .then(function(result) {
        console.log(result);
      })
      .catch(function(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
        })
    },
    logout() {
      firebase.auth().signOut()
      .then(function() {})
      .catch(function(error) {
        console.log(error)});
    }
}