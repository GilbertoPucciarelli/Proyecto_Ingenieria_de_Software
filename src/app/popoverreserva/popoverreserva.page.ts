import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular'
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Usuario } from '../Models/models';

@Component({
  selector: 'app-popoverreserva',
  templateUrl: './popoverreserva.page.html',
  styleUrls: ['./popoverreserva.page.scss'],
})
export class PopoverreservaPage implements OnInit {

  reserva: string
  local: string
  actividad: string
  fecha: string
  servicio: string
  hora: string
  extras: string
  extrasString = ' '
  idUserActivo
  userActivo: Usuario = {}

  constructor(private popoverController: PopoverController,private navParams: NavParams, private firebase: FirebaseServiceService) { 
    this.userActivo.tema = 'default'
    this.idUserActivo = this.firebase.getUser()
    console.log(this.idUserActivo)
    this.firebase.getAllUsers().subscribe(usuarios => {
      this.userActivo = this.findUser(this.idUserActivo, usuarios)
      console.log(this.userActivo)
    })
  }

  findUser(iduserActivo, arrayUsuarios) {
    for (var i = 0; i < arrayUsuarios.length; i++) {
      if (arrayUsuarios[i].id == iduserActivo) {
        return arrayUsuarios[i]
      }
    }
  }

  async closePopOver() {
    await this.popoverController.dismiss();
  }

  tieneextras() {
    this.extrasString = ' '
    for (let i = 0; i < this.extras.length; i++) {
      if (i + 1 == this.extras.length) {
        this.extrasString = this.extrasString + this.extras[i] + '.'
      } else {
        this.extrasString = this.extrasString + this.extras[i] + ', '
      }
    }
  }

  ngOnInit() {
    this.reserva = this.navParams.get('reserva')
    this.local = this.navParams.get('local')
    this.actividad = this.navParams.get('actividad')
    this.fecha = this.navParams.get('fecha')
    this.servicio = this.navParams.get('servicio')
    this.hora = this.navParams.get('hora')
    this.extras = JSON.parse(JSON.stringify(this.navParams.get('extras')))
    console.log(this.reserva)
  }

}
