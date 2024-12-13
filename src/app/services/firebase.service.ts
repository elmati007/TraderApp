import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {getStorage, uploadString, ref, getDownloadURL, deleteObject} from "firebase/storage";

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  // ============== autenticacion ==========

  getAuth() {
    return getAuth();
  }

  // ==== acceder =====

  singIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ==== crear Usuario =====

  singUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ==== actualizar Usuario =====

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // ==== enviar email para reestablecer contraseñas =====

  sentRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // ==== cerrar sesion =====

  singOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // ====================== base de datos ====================

  // ==== obtener documentos de una coleccion =====
  getCollectionData(path : string, CollectionQuery? : any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref,CollectionQuery), {idField: 'id'})

  }

  // ==== setear un documento =====
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // ==== actualizar un documento° (carpeta de atributos) =====
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // ==== eliminar un documento =====
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  // ==== obtener un documento =====
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

     // ==== agregar un documento =====
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // =================== almacenamiento ======================

     // ==== subir una imagen =====
  async uploadImage(path : string, data_url : string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }
  
   // ==== obtener ruta de la imagen con url =====
   async getFilePath(url: string){
    return ref(getStorage(), url).fullPath

   }

   // ==== eliminar un archivo =====
   deleteFile(path: string){
    return deleteObject(ref(getStorage(), path));

   }
}
