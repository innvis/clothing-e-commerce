import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6v5m0YSGKYhcma0xOv0dMo9btASIDPMU",
  authDomain: "crown-clothing-db-65013.firebaseapp.com",
  projectId: "crown-clothing-db-65013",
  storageBucket: "crown-clothing-db-65013.appspot.com",
  messagingSenderId: "628386538549",
  appId: "1:628386538549:web:67a727637310778fba3d7c"
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
  const userDocRef = doc(db, 'users', userAuth.uid);

  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);

  console.log(userSnapshot)
  console.log(userSnapshot.exists()); // see user doc snapshot object if whether or not doc exists

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, { displayName, email, createdAt });
    }
    catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  return userDocRef;
}
