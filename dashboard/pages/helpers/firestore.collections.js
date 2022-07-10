import {collection, addDoc, updateDoc, getDocs} from "firebase/firestore";
import {db} from "../auth/firebase";
import { toastErrorNotify, toastSuccessNotify } from "../helpers/ToastNotify";

export const movieCollectionRef = collection(db, 'movies');
export const commentCollectionRef = collection(db, 'comments');
export const userCollectionRef = collection(db, 'users');

export function updateMovie(docRef, data) {
    updateDoc(docRef, data).then(response => {
    toastSuccessNotify("Movie updated")
}).catch(error => {
    toastErrorNotify(error.message)
})
}

export function addDocument(collectionRef, data) {
    addDoc(collectionRef, data).then(response => {
        toastSuccessNotify("added with id: " + JSON.stringify(response.id))
    }).catch(error => {
        toastErrorNotify(error.message)
    })
}

