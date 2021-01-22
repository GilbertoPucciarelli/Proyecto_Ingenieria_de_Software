import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Router } from '@angular/router';
import { AngularFireUploadTask, AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Locales } from '../Models/models';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { ModalController } from '@ionic/angular'
import { ModalPage } from '../modal/modal.page';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  uploadState: Observable<string>;
  downloadURL: Observable<string>;
  local: Locales
  locales = []
  disponible

  servicios = []
  horas = []
  extras = []

  dataReturned
  localIdActivo;

  constructor(private firebase: FirebaseServiceService, public router: Router, private afStorage: AngularFireStorage, private fileChooser: FileChooser, private file: File, private modalController: ModalController) {

    var id = this.firebase.getUser()
    var usuarios = []
    usuarios = this.firebase.users
    var usuario = this.finduser(id, usuarios)
    this.locales = this.firebase.localess
    this.local = this.localuser(usuario, this.locales)
    console.log(this.local)
    this.disponible = this.local.disponibilidad
    this.servicios = JSON.parse(JSON.stringify(this.local.servicios))
    this.horas = JSON.parse(JSON.stringify(this.local.horas))
    this.extras = JSON.parse(JSON.stringify(this.local.extras))
    this.localIdActivo = JSON.parse(JSON.stringify(this.local.id))
    this.firebase.setIdLocalActivo(this.localIdActivo);
  }

   cerrarSesion(){
    return this.firebase.logOut()
  }

   choose(){
    this.fileChooser.open().then((url) =>{
      alert(url)

      this.file.resolveLocalFilesystemUrl(url).then((newUrl) => {
        alert(JSON.stringify(newUrl));

        let dirPath = newUrl.nativeURL;
        let dirPathSegments = dirPath.split('/')
        dirPathSegments.pop()
        dirPath = dirPathSegments.join('/')

        this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async (buffer) => {
          await this.upload(buffer, newUrl.name);
        })
      })
    })
  }

  async upload(buffer, name) {
    let blob = new Blob([buffer], { type: "image/jpeg" });

    let storage = firebase.storage();

    storage.ref('images/' + name).put(blob).then((d) => {
      alert("Done");

    }).catch((error) => {
      alert(JSON.stringify(error))
    })
  }

  upload2(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
      })
    ).subscribe();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.local.img = url;
        });
      })
    ).subscribe();
  }

  finduser(id, usuarios) {
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].id == id) {
        return usuarios[i]
      }
    }
  }

  localuser(usuario, locales) {
    for (let i = 0; i < locales.length; i++) {
      if (locales[i].id == usuario.idlocal) {
        return locales[i]
      }
    }
  }

  update() {
    console.log(this.local)
    console.log(this.servicios)
    console.log(this.horas)
    console.log(this.extras)
    this.local.servicios = JSON.parse(JSON.stringify(this.servicios))
    this.local.horas = JSON.parse(JSON.stringify(this.horas))
    this.local.extras = JSON.parse(JSON.stringify(this.extras))
    this.firebase.updateLocal(this.local, this.local.id)
  }

  cambiar() {
    if (this.disponible == true) {
      this.local.disponibilidad = false
      this.disponible = false
    } else {
      this.local.disponibilidad = true
      this.disponible = true
    }
    this.firebase.updateLocal2(this.local, this.local.id)
  }

  back() {
    this.router.navigate(["/login"]);
  }


  async openModal(array, info) {

    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        array: JSON.parse(JSON.stringify(array)),
        info: info
      }
    })

    modal.onDidDismiss().then((dataReturned) => {
      try {
        console.log(dataReturned.data)
        if (dataReturned.data[0] == "back") {
          console.log("back")
          if (dataReturned.data[1] == "Servicio") {
            this.servicios = JSON.parse(JSON.stringify(array))
            console.log("servicios")
          }
          if (dataReturned.data[1] == "Hora") {
            this.horas = JSON.parse(JSON.stringify(array))
            console.log("horas")
          }
          if (dataReturned.data[1] == "Extra") {
            this.extras = JSON.parse(JSON.stringify(array))
            console.log("extras")
          }
        } else {
          if (dataReturned.data[0] == "Servicio") {
            this.dataReturned = JSON.parse(JSON.stringify(dataReturned.data))
            this.dataReturned.splice(0, 1)
            this.servicios = JSON.parse(JSON.stringify(this.dataReturned))
            console.log(this.servicios)
          } else {
            if (dataReturned.data[0] == "Hora") {
              this.dataReturned = JSON.parse(JSON.stringify(dataReturned.data))
              this.dataReturned.splice(0, 1)
              this.horas = JSON.parse(JSON.stringify(this.dataReturned))
              console.log(this.horas)
            } else {
              if (dataReturned.data[0] == "Extra") {
                this.dataReturned = JSON.parse(JSON.stringify(dataReturned.data))
                this.dataReturned.splice(0, 1)
                this.extras = JSON.parse(JSON.stringify(this.dataReturned))
                console.log(this.extras)
              } else {
                console.log("error")
              }
            }
          }
        }


      } catch (error) {
      }
    });

    await modal.present()
  }

  ngOnInit() {

  }

}
