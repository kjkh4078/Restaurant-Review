import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDS6wJYPJuOQLPS-gfh6toOq_taP0cbvkM",
  authDomain: "crawling-d59b6.firebaseapp.com",
  projectId: "crawling-d59b6",
  storageBucket: "crawling-d59b6.appspot.com",
  messagingSenderId: "546537284543",
  appId: "1:546537284543:web:f28e4f3fd27ec1b4efb70a",
  measurementId: "G-2ZGEP8RL91"
};

export const fireBase = initializeApp(firebaseConfig);
export const authService = getAuth();
export const storageService = getStorage();
export const dbService = getFirestore();
