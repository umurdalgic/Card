import { initializeApp, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCJqgpUa77JpqdxdmOA25o9MOHuwXMvn80",
    authDomain: "casestudy-8f596.firebaseapp.com",
    projectId: "casestudy-8f596",
    storageBucket: "casestudy-8f596.appspot.com",
    messagingSenderId: "841256219790",
    appId: "1:841256219790:web:de836c559db4a75e7685df"
  };

  const firebaseApp=initializeApp(firebaseConfig);
  const db=getFirestore(firebaseApp);
  const storage=getStorage(firebaseApp);
  export default db;
  export {
    storage
  }