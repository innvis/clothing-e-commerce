import { createContext, useState, useEffect } from "react";
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from "../utils/firebase/firebase.utils";

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    // Set up an authentication state change listener using the 'onAuthStateChangedListener' function
    const unsubsribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user); //If a user is authenticated, create a user document from the user authentication information
      }
      setCurrentUser(user); //Update the 'currentUser' state with the user object (or null if no user is authenticated)
    });

    return unsubsribe; //Return a cleanup function to unsubscribe the authentication state change listener
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
