import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Locales, Usuario, Reseñas, Mensajes } from '../Models/models';
import { map } from 'rxjs/operators';
import { ReservasUsuarios } from '../Models/models';
import { __values } from 'tslib';
import { stringify } from '@angular/core/src/render3/util';
import { AlertController, NavController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-resenas',
  templateUrl: './resenas.page.html',
  styleUrls: ['./resenas.page.scss'],
})
export class ResenasPage implements OnInit {

  id
  idLocal: string;
  mensaje;
  local
  dataRecv;
  horas = []
  serviciosoriginales = []
  servicios = []
  reseñas = {} as Reseñas;

  idUserActivo: string
  userActivo: Usuario = {}
  arrayUsuarios = []
  arrayLocales = []

  @ViewChild("content") content: any;
  messages = [];
  aux = [];
  mensajes = [];
  mensajeEnviado = {} as Mensajes;

  constructor(public navCtrl: NavController, private router: Router, public activateRoute: ActivatedRoute, private firebase: FirebaseServiceService, private alertController: AlertController) {

    this.idUserActivo = this.firebase.getUser()
    console.log(this.idUserActivo)
    this.firebase.getAllUsers().subscribe(usuarios => {
      this.userActivo = this.findUser(this.idUserActivo, usuarios)
      console.log(this.userActivo)
    })
  }

  // OBTENER MENSAJES
  //getMessages() {
  //
  //var id = this.firebase.getUser();
  //this.firebase.getMessages(id, this.idLocal);
  //}

  scrollToBottom() {
    var contentEnd = document.getElementById("content-end").offsetTop;
    this.content.scrollTo(0, contentEnd, 300);
  }

  // ENVIAR MENSAJE
  sendMessage(mensaje, idLocal) {

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
      + (currentdate.getMonth() + 1) + "-"
      + currentdate.getDate()

    var horaActual = currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds() + ":"
      + currentdate.getMilliseconds();

    var id = this.firebase.getUser();
    this.mensajeEnviado.mensaje = mensaje;
    this.mensajeEnviado.idUsuario = id;
    this.mensajeEnviado.fecha = datetime;
    this.mensajeEnviado.hora = horaActual;
    this.firebase.sendMessages(this.mensajeEnviado, id, idLocal);
    this.mensaje = ''
  }

  findUser(iduserActivo, arrayUsuarios) {
    for (var i = 0; i < arrayUsuarios.length; i++) {
      if (arrayUsuarios[i].id == iduserActivo) {
        return arrayUsuarios[i]
      }
    }
  }

  back(nombre) {
    nombre = nombre;
    this.router.navigate(["/tabs/local", nombre]);
  }

  getlocal(locales) {
    for (let i = 0; i < locales.length; i++) {
      if (locales[i].nombre == this.dataRecv) {
        this.local = locales[i]
        this.horas = JSON.parse(JSON.stringify(locales[i].horas))
        this.serviciosoriginales = JSON.parse(JSON.stringify(locales[i].servicios))
        this.servicios = JSON.parse(JSON.stringify(locales[i].servicios))
        this.idLocal = JSON.parse(JSON.stringify(locales[i].id))

        console.log(this.idLocal)
      }
    }
    return this.idLocal;
  }

  ngOnInit() {
    this.dataRecv = this.activateRoute.snapshot.paramMap.get('nombre')
    console.log(this.dataRecv)
    this.id = this.firebase.getUser();
    var locales = this.firebase.localess;
    this.idLocal = this.getlocal(locales)
    console.log(this.idLocal);

    this.firebase.getMessages(this.id, this.local.id).subscribe(mensajes => {

      this.messages = mensajes;
      console.log("El array del bd es: ", this.messages)
      var c;

      // METODO PARA ORDENAR
      for (var i = 1; i < this.messages.length; i++) {
        for (var j = 0; j < this.messages.length - i; j++) {
          if (this.messages[j].fecha > this.messages[j + 1].fecha) {
            c = this.messages[j + 1]
            this.messages[j + 1] = this.messages[j];
            this.messages[j] = c
          }
        }
      }

      for (var i = 1; i < this.messages.length; i++) {
        for (var j = 0; j < this.messages.length - i; j++) {
          if (this.messages[j].hora > this.messages[j + 1].hora) {
            c = this.messages[j + 1]
            this.messages[j + 1] = this.messages[j];
            this.messages[j] = c
          }
        }
      }

      console.log("El array ordenado es: ", this.messages)
    })
  }
}