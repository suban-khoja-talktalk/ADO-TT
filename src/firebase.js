const firebaseConfig = {
  apiKey: "AIzaSyCZ2HXCcsbMsIHMxAdqiStOOx7AA5Xhkms",
  authDomain: "tick-todo-app.firebaseapp.com",
  projectId: "tick-todo-app",
  storageBucket: "tick-todo-app.appspot.com",
  messagingSenderId: "114323470299",
  appId: "1:114323470299:web:5db79253e64602c2f199fe",
  measurementId: "G-SHK9S7SRYF"
};
  
  Object.freeze(firebaseConfig);
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  export const signinUser = (email,password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };
  
  export const signoutUser = () => {
    firebase.auth().signOut();
  };

  export const AUTH = firebase.auth();
  