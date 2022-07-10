import {initializeApp} from "firebase/app";
import {getFirestore, doc, setDoc} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile,} from "firebase/auth";
import {toastErrorNotify, toastSuccessNotify, toastWarnNotify} from "../helpers/ToastNotify";
const firebaseConfig = {
    apiKey: "AIzaSyAieELB25Vb4HO6Qj51afIvBmVeQAgnKYM",
    authDomain: "imageuploader-1be3a.firebaseapp.com",
    projectId: "imageuploader-1be3a",
    storageBucket: "imageuploader-1be3a.appspot.com",
    messagingSenderId: "10125010222",
    appId: "1:10125010222:web:6c2eeb3dfc283e019c06bf",
    measurementId: "G-1Q4GCR16K2"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)

export const createUser = async (email, password, displayName) => {
    try { // create a new user
        let userCredential = await createUserWithEmailAndPassword(auth, email, password).then((user) => {
            const userData = {
                email,
                uid: user.user.uid,
                picture: "https://i.pinimg.com/474x/8f/1b/09/8f1b09269d8df868039a5f9db169a772.jpg",
                displayName,
                liked: [],
                disliked: [],
                watchedMovies: [],
                rating: [{movieId: "ry18UCRUnzCSR8Uv0EWe", rating: 5}]
            };
            setDoc(doc(db, "users", user.user.uid), userData)
        .catch((e) => toastWarnNotify(e.code))
        });
        // update user profile
        await updateProfile(auth.currentUser, {displayName: displayName});
        toastSuccessNotify("Registered successfully!");
    } catch (err) {
        toastErrorNotify(err.message);
    }
};

export const signIn = async (email, password) => {
    try { // sign in method
        let userCredential = await signInWithEmailAndPassword(auth, email, password);
        toastSuccessNotify("Logged in successfully!");
    } catch (err) {
        toastErrorNotify(err.message);
    }
};

export const logOut = () => {
    signOut(auth);
    toastSuccessNotify("Logged out successfully!");
};

export const userObserver = (setCurrentUser) => {
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setCurrentUser(currentUser);
        } else { // User is signed out
            setCurrentUser(false);
        }
    });
};

export const signUpProvider = () => { 
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
    }).catch((error) => {
        console.log(error);
    });
};

export const forgotPassword = (email) => {
    sendPasswordResetEmail(auth, email).then(() => { // Password reset email sent!
        toastWarnNotify("Please check your mail box!");
    }).catch((err) => {
        toastErrorNotify(err.message);
    });
};
