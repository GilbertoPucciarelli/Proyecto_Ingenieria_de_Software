import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Router } from '@angular/router';
import { ReservasUsuarios, Usuario } from '../Models/models';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  reservas = []
  reserva = {} as ReservasUsuarios;;
  reservasCancelar = {} as ReservasUsuarios;
  var = 0
  idreserva
  extras = []
  idUserActivo: string
  userActivo: Usuario = {}
  arrayUsuarios = []
  extrasString = ' '
  datetime;
  horaActual;

  constructor(private firebase: FirebaseServiceService, public router: Router, private alertController: AlertController, public toastController: ToastController) {
    this.userActivo.tema = 'default'
    this.idUserActivo = this.firebase.getUser()
    console.log(this.idUserActivo)
    this.firebase.getAllUsers().subscribe(usuarios => {
      console.log(this.arrayUsuarios)
      this.userActivo = this.findUser(this.idUserActivo, usuarios)
      console.log(this.userActivo)
    })
  }

  verificarFecha() {
    var currentdate = new Date();

    if (currentdate.getDate() == 1 || currentdate.getDate() == 2 || currentdate.getDate() == 3 || currentdate.getDate() == 4 || currentdate.getDate() == 5 || currentdate.getDate() == 6 || currentdate.getDate() == 7 || currentdate.getDate() == 8 || currentdate.getDate() == 9) {
      var datetime = currentdate.getFullYear() + "-"
        + "0" + (currentdate.getMonth() + 1) + "-" + "0" +
        + currentdate.getDate()
    } else {
      var datetime = currentdate.getFullYear() + "-"
        + "0" + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate()
    }

    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ':' + minutes


    this.datetime = datetime;
    this.horaActual = strTime;
  }

  findUser(iduserActivo, arrayUsuarios) {
    for (var i = 0; i < arrayUsuarios.length; i++) {
      if (arrayUsuarios[i].id == iduserActivo) {
        return arrayUsuarios[i]
      }
    }
  }

  ngOnInit() {
    var id = this.firebase.getUser()
    this.firebase.getReservasUsuarios(id).subscribe(reservas => {

      this.reservas = reservas;
      console.log(this.reservas)

      var c;
      // METODO PARA ORDENAR
      for (var i = 1; i < this.reservas.length; i++) {
        for (var j = 0; j < this.reservas.length - i; j++) {
          if (this.reservas[j].fecha < this.reservas[j + 1].fecha) {
            c = this.reservas[j + 1]
            this.reservas[j + 1] = this.reservas[j];
            this.reservas[j] = c
          }
        }
      }

      for (var i = 1; i < this.reservas.length; i++) {
        for (var j = 0; j < this.reservas.length - i; j++) {
          if (this.reservas[j].hora < this.reservas[j + 1].hora) {
            c = this.reservas[j + 1]
            this.reservas[j + 1] = this.reservas[j];
            this.reservas[j] = c
          }
        }
      }
    })
    this.verificarFecha()
  }

  //VERIFICAR SI LA RESEVA TIENE EXTRAS
  tieneextras(reserva) {
    this.extrasString = ' '
    this.extras = JSON.parse(JSON.stringify(reserva.extras))
    for (let i = 0; i < this.extras.length; i++) {
      if (i + 1 == this.extras.length) {
        this.extrasString = this.extrasString + this.extras[i] + '.'
      } else {
        this.extrasString = this.extrasString + this.extras[i] + ', '
      }
    }
  }

  //PROCESO DE CANCELACION DE RESERVA

  cancelarReserva(idreserva) {
    this.idreserva = idreserva
    this.alertaCancelacion()
  }

  eliminarReserva() {
    var id = this.firebase.getUser()
    console.log(id)
    console.log(this.idreserva)
    this.firebase.eliminarReserva(id, this.idreserva)
    this.presentToastCancelar()
  }

  async alertaCancelacion() {
    this.var = 0
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: '¿Estas seguro de cancelar la reserva?',
      buttons: [
        {
          text: 'Si',
          role: 'cancel',
          handler: () => {
            this.eliminarReserva()
          }
        }, {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToastCancelar() {
    const toast = await this.toastController.create({
      message: 'La reserva se ha cancelado correctamente',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

}
