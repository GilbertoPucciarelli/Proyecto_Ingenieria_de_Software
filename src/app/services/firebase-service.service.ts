import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Usuario, ReservasUsuarios, Reseñas, Mensajes, ReservasLocales } from '../Models/models';
import { Locales } from '../Models/models';
import { Observable, of } from 'rxjs';
import * as firebase from 'firebase';
import { switchMap, map } from 'rxjs/operators';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { getLocalRefs } from '@angular/core/src/render3/discovery_utils';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  usuariosCollection: AngularFirestoreCollection<Usuario>;
  usuarios: Observable<Usuario[]>;
  user: Observable<Usuario>;
  users = [];
  userDoc: AngularFirestoreDocument;

  confirmar: boolean = false;

  localesCollection: AngularFirestoreCollection<Locales>;
  locales: Observable<Locales[]>;
  localess = [];
  local
  LocalDoc: AngularFirestoreDocument;

  reservasUsuariosCollection: AngularFirestoreCollection<ReservasUsuarios>;
  reservasUsuarioActual: AngularFirestoreCollection<ReservasUsuarios>;
  reservasActuales: Observable<ReservasUsuarios[]>;

  reseñas_1: AngularFirestoreCollection<Reseñas>;
  reseñas_2: Observable<Reseñas[]>;
  reseñasCollection: AngularFirestoreCollection<Reseñas>;

  mensajesCollection: AngularFirestoreCollection<Mensajes>;
  mensajesUsuarioActual: AngularFirestoreCollection<Mensajes>;
  mensajes: Observable<Mensajes[]>;

  localActual: Observable<Locales[]>;

  localIdActivo;
  reservasLocalesCollection: AngularFirestoreCollection<ReservasLocales>;
  reservasLocalActual: AngularFirestoreCollection<ReservasLocales>;
  reservasActualesLocal: Observable<ReservasLocales[]>;

  mensajesLocalActual: AngularFirestoreCollection<Mensajes>;
  mensajesLocal: Observable<Mensajes[]>;

  constructor(public db: AngularFirestore, public fireAuth: AngularFireAuth, private router: Router, private alertController: AlertController, public toastController: ToastController) {

    this.usuariosCollection = this.db.collection('Users');
    this.localesCollection = this.db.collection('Local');
    this.reservasUsuariosCollection = this.db.collection('Reservas Usuarios');
    this.reseñasCollection = this.db.collection('Comentarios');
    this.mensajesCollection = this.db.collection('Mensajes');
    this.reservasLocalesCollection = this.db.collection('Reservas Locales');

    this.user = this.fireAuth.authState.pipe(
      switchMap(usuario => {
        if (usuario) {
          return this.db.doc<Usuario>(`Users/${usuario.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.getUsers().subscribe(data => {
      data.forEach(element => {
        this.users.push(element.payload.doc.data())
      });
    });

    this.getLocales().subscribe(data => {
      data.forEach(element => {
        this.localess.push(element.payload.doc.data())
      });
    });
  }

  getUsers() {
    return this.db.collection('Users').snapshotChanges();
  }

  getLocales() {
    return this.db.collection('Local').snapshotChanges();
  }

  //funciones observables
  getAllLocales() {
    this.localesCollection = this.db.collection('Local')
    this.locales = this.localesCollection.valueChanges();
    return this.locales
  }

  getAllUsers() {
    this.usuariosCollection = this.db.collection('Users')
    this.usuarios = this.usuariosCollection.valueChanges();
    return this.usuarios
  }

  //OBTENER RESERVAS DEL USUARIO ACTUAL
  getReservasUsuarios(id) {

    this.reservasUsuarioActual = this.reservasUsuariosCollection.doc(id).collection("Reservas Usuarios");
    this.reservasActuales = this.reservasUsuarioActual.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as ReservasUsuarios;
        data.id = a.payload.doc.id;
        return data;
      })
    }))

    return this.reservasActuales;
  }

  //OBTENER RESERVA DEL LOCAL
  getReservasLocales(id){

    this.reservasLocalActual = this.reservasLocalesCollection.doc(id).collection("Reservas Locales");
    this.reservasActualesLocal = this.reservasLocalActual.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as ReservasLocales;
        data.id = a.payload.doc.id;
        return data;
      })
    }))

    return this.reservasActualesLocal;
  }

  // getLocal(id){
  //   var data
  //   data = this.localesCollection.doc(id).ref.get().then(function(doc) {
  //     if (doc.exists) {
  //       console.log("Document data:", doc.data());
  //       return doc.data()
  //     } else {
  //       console.log("No such document!");
  //     }
  //   }).catch(function(error) {
  //     console.log("Error getting document:", error);
  //   });
  //   data.then(data => console.log(data))
  //   return data
  // }

  //LOGIN
  login(email: string, password: string) {
    return this.fireAuth.auth
      .signInWithEmailAndPassword(email, password)

      .then(credential => {
        var usuario = this.isAdmin(email)
        console.log(usuario)
        if (usuario.admin == true) {
          this.router.navigate(["/tabs/worker"])
          return this.updateUserData(credential.user);
        } else {
          this.router.navigate(["/tabs/home"]);
          return this.updateUserData(credential.user);
        }
      })
      .catch(error => this.handleError(error));
  }

  isAdmin(email) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email == email) {
        return this.users[i]
      }
    }
  }

  updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<Usuario> = this.db.doc(`Users/${user.uid}`);
    const data: Usuario = {
      id: user.uid,
      email: user.email,
    }
    console.log(user.uid);
    return userRef.set(data, { merge: true })
  }

  //REGISTER
  register(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          console.log(res.user.uid);
          resolve(res);
        }, err => reject(err))
    })
  }

  //CREAR USUARIO EN LA BD
  crearUsuario(name: string, lastname: string, gender: string, birthday: string, email: string, password: string, img: string, tema: string) {
    this.register(email, password)
      .then(res => {
        this.usuariosCollection.doc(res.user.uid).set({ admin: false, birthday: birthday, developed: false, email: email, gender: gender, id: res.user.uid, lastname: lastname, name: name, password: password, img: img, tema: tema })
        this.router.navigate(["/tabs/home"]);
      }, err => {
        this.presentToastPassword()

      })
  }

  //CREAR RESERVA
  crearReserva(reservas, id, idLocal, reservaLocal) {

    this.reservasUsuariosCollection.doc(id).collection("Reservas Usuarios").add(reservas);
    this.reservasLocalesCollection.doc(idLocal).collection("Reservas Locales").add(reservaLocal);
  }

  getUser() { //obtiene al usuario activo 
    if (this.fireAuth.auth.currentUser == null) {
      this.router.navigate(['/login']);
    }
    return this.fireAuth.auth.currentUser.uid;
  }

  //Update local
  updateLocal(datos: Locales, id) {
    this.LocalDoc = this.db.doc(`Local/${id}`);
    this.LocalDoc.update(datos).then(() => {
      this.presentToast()
    }).catch(() => {
      this.presentToast2()
    })
  }

  updateUsuario(datos: Usuario, id) {
    this.userDoc = this.db.doc(`Users/${id}`);
    this.userDoc.update(datos).then(() => {
      this.presentToast()
    }).catch(() => {
      this.presentToast2()
    })
  }

  updateLocal2(datos: Locales, id) {
    this.LocalDoc = this.db.doc(`Local/${id}`);
    this.LocalDoc.update(datos).then(() => {
    }).catch(() => {
      this.presentToast2()
    })
  }

  updateUsuario2(datos: Usuario, id) {
    this.userDoc = this.db.doc(`Users/${id}`);
    this.userDoc.update(datos).then(() => {
    }).catch(() => {
      this.presentToast2()
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Se han actualizado los datos correctamente',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }

  async presentToast2() {
    const toast = await this.toastController.create({
      message: 'Error',
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  async presentToastPassword() {
    const toast = await this.toastController.create({
      message: 'La contraseña debe contener al menos 6 caracteres',
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  //ALERTAS SI INGRESAN DATOS MAL
  async handleError(error: Error) {

    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Login',
      message: 'Error: ' + error,
      buttons: ['OK']
    })

    await alert.present();
  }

  //ELIMINAR RESERVA
  eliminarReserva(id: string, reserva: string) {

    this.reservasUsuariosCollection.doc(id).collection("Reservas Usuarios").doc(reserva).delete()
  }

  //Cerrar sesion
  logOut() {

    this.fireAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    })
  }

  //CREAR RESEÑA
  crearReseña(reseña: Reseñas) {

    this.reseñasCollection.doc(reseña.id).collection("Reseñas").add(reseña)
  }

  //OBTENER RESEÑAS
  getReseñas(id) {

    this.reseñas_1 = this.reseñasCollection.doc(id).collection("Reseñas");
    this.reseñas_2 = this.reseñas_1.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Reseñas;
        data.id = a.payload.doc.id;
        return data;
      })
    }))

    return this.reseñas_2;
  }

  // OBTENER COLECCION MENSAJES 
  getMessages(userId, localId) {

    this.mensajesUsuarioActual = this.mensajesCollection.doc(userId).collection("Conversaciones").doc(localId).collection("Historial");
    this.mensajes = this.mensajesUsuarioActual.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Mensajes;
        data.id = a.payload.doc.id;
        return data;
      })
    }))

    return this.mensajes;
  }

  getMessagesLocal(userId, localId){

    this.mensajesLocalActual = this.mensajesCollection.doc(userId).collection("Conversaciones").doc(localId).collection("Historial");
    this.mensajesLocal = this.mensajesLocalActual.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Mensajes;
        data.id = a.payload.doc.id;
        return data;
      })
    }))

    return this.mensajesLocal;
  }

  // AÑADIR A LA COLECCION MENSAJES
  sendMessages(mensaje: Mensajes, userId, localId) {

    this.mensajesCollection.doc(userId).collection("Conversaciones").doc(localId).collection("Historial").add(mensaje);
  }

  setIdLocalActivo(id) {
    this.localIdActivo = id;
  }
  getIdLocalActivo() {
    return this.localIdActivo;
  }
}