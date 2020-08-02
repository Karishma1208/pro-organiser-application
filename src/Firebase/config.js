import firebase from 'firebase';
import 'firebase/auth';

 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyAq-FNumNRE9YUVeQ-VyMfX0xgRlQqR1fo",
  authDomain: "pro-organiser-app-ab5c1.firebaseapp.com",
  databaseURL: "https://pro-organiser-app-ab5c1.firebaseio.com",
  projectId: "pro-organiser-app-ab5c1",
  storageBucket: "pro-organiser-app-ab5c1.appspot.com",
  messagingSenderId: "556193683740",
  appId: "1:556193683740:web:641ffabe450fc5193542d9"
  
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();