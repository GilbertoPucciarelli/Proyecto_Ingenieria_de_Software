import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Router } from '@angular/router';
import { Usuario } from '../Models/models'
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, map, buffer } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import * as firebase from 'firebase';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
 idUserActivo: string
 fechaNaci;
 userActivo: Usuario = {}
 arrayUsuarios = []
 ref: AngularFireStorageReference;
 task: AngularFireUploadTask;
 uploadProgress: Observable<number>;
 uploadState: Observable<string>;
 downloadURL: Observable<string>;
 opcionSeleccionado: string;
 verSeleccion: string = '';
 azul
 rojo
 verde
 morado
 userOriginal
 tema
  
  constructor(private firebase: FirebaseServiceService, public router: Router, private afStorage: AngularFireStorage, private fileChooser: FileChooser, private file: File) {
    this.azul = false
    this.rojo = false
    this.verde = false
    this.morado = false
    this.userActivo.tema = 'default'
    this.idUserActivo = this.firebase.getUser()
    console.log(this.idUserActivo)
    this.firebase.getAllUsers().subscribe(usuarios => {
      this.userActivo = this.findUser(this.idUserActivo, usuarios)
      console.log(this.userActivo)
      this.userOriginal = JSON.parse(JSON.stringify(this.userActivo))
      this.opcionSeleccionado = this.userActivo.gender
      this.verSeleccion = this.userActivo.gender
      console.log(this.opcionSeleccionado)
      this.cambiarTema(this.userActivo.tema)
    })
    this.opcionSeleccionado = this.userActivo.gender
  }


  Gender() {
    this.verSeleccion = this.opcionSeleccionado;
    return this.verSeleccion
  }

  findUser(iduserActivo, arrayUsuarios) {
    for (var i = 0; i < arrayUsuarios.length; i++) {
      if (arrayUsuarios[i].id == iduserActivo) {
        return arrayUsuarios[i]
      }
    }
  }

  cambiarTema(tema){
    console.log(tema)
    switch(tema){
      case "default":
        this.azul = true
        this.rojo = false
        this.verde = false
        this.morado = false
        this.tema = "default"
        this.update2(this.tema)
        break
      case "red":
        this.azul = false
        this.rojo = true
        this.verde = false
        this.morado = false
        this.tema = "red"
        this.update2(this.tema)
        break
      case "green":
        this.azul = false
        this.rojo = false
        this.verde = true
        this.morado = false
        this.tema = "green"
        this.update2(this.tema)
        break
      case "tur":
          this.azul = false
          this.rojo = false
          this.verde = false
          this.morado = true
          this.tema = "tur"
          this.update2(this.tema)
          break
    }
    console.log("azul",this.azul)
    console.log("rojo",this.rojo)
    console.log("verde",this.verde)
    console.log("morado",this.morado)
  }

  choose(){
    this.fileChooser.open().then((uri) =>{
      alert(uri)

      this.file.resolveLocalFilesystemUrl(uri).then((newUrl) => {
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
          this.userActivo.img = url;
        });
      })
    ).subscribe();
  }

  update(){
    this.userActivo.gender= this.verSeleccion
    this.userActivo.tema = this.tema
    console.log(this.userActivo,this.userActivo.id)
    this.firebase.updateUsuario(this.userActivo,this.userActivo.id)
    this.userOriginal = JSON.parse(JSON.stringify(this.userActivo))
  }

  update2(tema){
    this.userOriginal.tema = tema
    console.log(this.userOriginal,this.userActivo.id)
    this.firebase.updateUsuario2(this.userOriginal,this.userActivo.id)
  }

  cerrarSesion() {
    return this.firebase.logOut()
  }

  ngOnInit() {

  }
}

