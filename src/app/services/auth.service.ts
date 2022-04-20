import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
} from '@firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  documentId,
  where,
  query,
} from '@firebase/firestore';

interface Profile {
  title: String;
  description: String;
  location: String;
  urlImg: String;
  whatsapp: String;
  phone: String;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  getCurrentUser() {
    return getAuth(this.auth.app).currentUser;
  }

  async getProfile() {
    const uid = this.getCurrentUser()?.uid;
    if (uid) {
      return (await getDoc(doc(this.firestore, 'profile', uid))).data();
    }
    return undefined;
  }

  async getProfileOfPost(uid: string) {
    let profileSearch = await getDoc(doc(this.firestore, 'profile/' + uid));
    return profileSearch.data();
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async recoverPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }

  async createOrUpdateProfile(profile: Profile) {
    const uid = this.getCurrentUser()?.uid;
    if (uid) {
      const profileRef = doc(this.firestore, 'profile', uid);
      setDoc(profileRef, profile, { merge: true });
    }
  }

  async getMyProperties() {
    const myProperties: any = [];
    const queryFilter = query(
      collection(this.firestore, 'properties'),
      where('uid', '==', this.getCurrentUser()?.uid)
    );
    const querySnapshot = await getDocs(queryFilter);
    querySnapshot.forEach((doc) => {
      myProperties.push({ ...doc.data(), id: doc.id });
    });
    return myProperties;
  }
}
