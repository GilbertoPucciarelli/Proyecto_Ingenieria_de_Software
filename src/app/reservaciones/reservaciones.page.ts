import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Locales } from '../Models/models';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
})
export class ReservacionesPage implements OnInit {

  localIdActivo;
  reservas = []
  extras = []
  extrasString = ' '

  local: Locales
  locales = []
  disponible
  servicios = []
  horas = []

  constructor(private firebase: FirebaseServiceService) {

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

    this.localIdActivo = this.firebase.getIdLocalActivo()
    console.log(this.localIdActivo)
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

  ngOnInit() {

    var id = this.firebase.getUser()
    this.firebase.getReservasLocales(this.localIdActivo).subscribe(reservasLocal => {

      this.reservas = reservasLocal;
      console.log(this.reservas)
    })
  }

}
