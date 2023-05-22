import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, } from "firebase/auth"; //library packages for authentication
import { getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs } from "firebase/firestore"; //

const firebaseConfig = {
  apiKey: "AIzaSyD6v5m0YSGKYhcma0xOv0dMo9btASIDPMU",
  authDomain: "crown-clothing-db-65013.firebaseapp.com",
  projectId: "crown-clothing-db-65013",
  storageBucket: "crown-clothing-db-65013.appspot.com",
  messagingSenderId: "628386538549",
  appId: "1:628386538549:web:67a727637310778fba3d7c"
};

const firebaseApp = initializeApp(firebaseConfig); // initialize firebase

const googleProvider = new GoogleAuthProvider(); //class from firebase its connected to google auth itself, you can choose different providers e.g github

googleProvider.setCustomParameters({
  prompt: "select_account"
}) //everytime someone interacts always force them to select an account


export const auth = getAuth(); // this is the same auth for one application.
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider); // here we pass the google provider, you can pass different provider based on what you sign in
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore(); // this points to database, get/set docs


//shop authentication, adding prodcuts to firebase db 
export const addCollectionAndDocuments = async (collectionKey, objectsToAdd, field) => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, collectionKey);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object[field].toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done");
};


export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {})
  return categoryMap;
}

//see if there is any exsiting doc reference
export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  if (!userAuth) return; // If userAuth is falsy, return early

  const userDocRef = doc(db, 'users', userAuth.uid); // Create a document reference using the 'users' collection and the unique user ID (uid)

  const userSnapshot = await getDoc(userDocRef); // Retrieve the document snapshot for the user document

  if (!userSnapshot.exists()) { // If the user document does not exist
    const { displayName, email } = userAuth; // Extract the displayName and email from userAuth object
    const createdAt = new Date(); // Create a new Date object representing the current date and time

    try {
      await setDoc(userDocRef, { displayName, email, createdAt, ...additionalInformation }); // Set the user document with the provided data, including displayName, email, createdAt, and additionalInformation
    }
    catch (error) {
      console.log("error creating the user", error.message); // Log an error message if there's an error creating the user document
    }
  }

  return userDocRef; // Return the user document reference
}


export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password)
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return; // if false indicates the input is invalid or incomplete

  return await signInWithEmailAndPassword(auth, email, password) //if valid returns user
};

export const signOutUser = async () => await signOut(auth); //signs out


//serves as a wrapper  function to simplify the process of registering an authentication state change listener.
export const onAuthStateChangedListener = (callback) => {

  onAuthStateChanged(auth, callback);
} // whenever user sign is or signs out,callback gets called, function take care of even listener and appropriate event when needed,
