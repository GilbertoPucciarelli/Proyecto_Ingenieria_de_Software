import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Locales, Usuario, ReservasLocales } from '../Models/models';
import { map } from 'rxjs/operators';
import { ReservasUsuarios } from '../Models/models';
import { __values } from 'tslib';
import { stringify } from '@angular/core/src/render3/util';
import { AlertController, PopoverController } from '@ionic/angular';
import { PopoverPage } from '../popover/popover.page';
import { PopoverreservaPage } from '../popoverreserva/popoverreserva.page';
import { ToastController } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-local',
  templateUrl: './local.page.html',
  styleUrls: ['./local.page.scss']
})
export class LocalPage implements OnInit {


  local
  dataRecv
  usuarios = []
  allreservas = []
  myDate: String = new Date().toISOString();
  reservas = {} as ReservasUsuarios;
  horas = []
  serviciosoriginales = []
  horasoriginales = []
  verSeleccion1: string = '';
  horaSeleccionada: string = 'Hora';
  foriginal
  fsemana
  servicios = []
  verSeleccion2: string = '';
  mesaSeleccionada: string = 'Servicio';
  fav = false
  extras = false
  extrass = []
  extrasString = ' '
  producto
  var = 0
  idUserActivo: string
  userActivo: Usuario = {}
  arrayUsuarios = []
  idLocal;
  reservaLocal = {} as ReservasLocales;

  constructor(private router: Router, public activateRoute: ActivatedRoute, private firebase: FirebaseServiceService, private alertController: AlertController, private popoverController: PopoverController, public toastController: ToastController, route: ActivatedRoute) {
    this.userActivo.tema = 'default'
    route.params.subscribe(val => {
      this.horaSeleccionada = 'Hora'
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      this.reservas.fecha = yyyy + '-' + mm + '-' + dd;
      this.foriginal = yyyy + '-' + mm + '-' + dd;
      console.log(this.reservas.fecha)
      this.nextweek()
      for (let i = 0; i < this.extrass.length; i++) {
        this.extrass[i].isChecked = false
      }
      this.extrasString = ' '
      this.allreservas.length = 0
      this.horasDisponibles()
    });
    this.idUserActivo = this.firebase.getUser()
    console.log(this.idUserActivo)
    this.firebase.getAllUsers().subscribe(usuarios => {
      this.userActivo = this.findUser(this.idUserActivo, usuarios)
      console.log(this.userActivo)
    })
  }

  // ENVIAR A LOS MENSAJES DIRECTOS
  seleccion(nombre) {
    nombre = nombre
    this.router.navigate(["/tabs/resenas", nombre]);
  }

  findUser(iduserActivo, arrayUsuarios) {
    for (var i = 0; i < arrayUsuarios.length; i++) {
      if (arrayUsuarios[i].id == iduserActivo) {
        return arrayUsuarios[i]
      }
    }
  }

  //OBTENER FECHA TOPE DE INGRESO PARA RESERVAR
  nextweek() {
    var today = new Date();
    var dd = today.getDate() + 7
    var mm = today.getMonth() + 1
    var yyyy = today.getFullYear();

    if (mm == 1 && dd > 31 || mm == 2 && dd > 28 || mm == 3 && dd > 31 || mm == 4 && dd > 30 || mm == 5 && dd > 31 || mm == 6 && dd > 30 || mm == 7 && dd > 31 || mm == 8 && dd > 31 || mm == 9 && dd > 30 || mm == 10 && dd > 31 || mm == 11 && dd > 30 || mm == 12 && dd > 31) {
      console.log("ja weno se dio lo que no se daba")
      if (mm != 12) {
        if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10) {
          mm = mm + 1
          dd = dd - 31
        } else {
          mm = mm + 1
          dd = dd - 30
        }
      } else {
        mm = 1
        dd = dd - 31
        yyyy = yyyy + 1
      }
    }

    var day = String(dd).padStart(2, '0')
    var month = String(mm).padStart(2, '0')

    this.fsemana = yyyy + '-' + month + '-' + day;
    console.log(this.fsemana)
  }

  //VOLVER A LA PAGINA DE LOCALES
  back() {
    this.router.navigate(["/tabs/home"]);
  }

  //OBTENER DATOS DEL LOCAL SELECCIONADO
  getlocal(locales) {
    for (let i = 0; i < locales.length; i++) {
      if (locales[i].nombre == this.dataRecv) {
        this.local = locales[i]
        this.horas = JSON.parse(JSON.stringify(locales[i].horas))
        this.horasoriginales = JSON.parse(JSON.stringify(locales[i].horas))
        this.serviciosoriginales = JSON.parse(JSON.stringify(locales[i].servicios))
        this.servicios = JSON.parse(JSON.stringify(locales[i].servicios))
        console.log(this.horas)

        if (this.local.extras.length != 0) {
          this.extras = true
          for (let i = 0; i < this.local.extras.length; i++) {
            this.extrass.push({ name: this.local.extras[i], isChecked: false })
          }
        }
      }
    }
  }

  //CAMBIAR VALOR DE LA HORA SELECCIONADA
  Hora() {
    this.verSeleccion1 = this.horaSeleccionada;
    return this.verSeleccion1
  }

  //CAMBIAR VALOR DE LA MESA SELECCIONADA
  Mesa() {
    this.verSeleccion2 = this.mesaSeleccionada;
    return this.verSeleccion2
  }

  //VERIFICACION DE RESERVACION
  reservar() {

    //SETEAR RESERVA DEL USUARIO
    this.reservas.actividad = this.local.actividad
    this.reservas.hora = this.Hora();
    this.reservas.servicio = this.servicios[0]
    this.reservas.local = this.local.nombre;
    this.reservas.reserva = Math.floor(Math.random() * 999999) + 1;
    this.reservas.extras = [];
    this.idLocal = this.local.id
    for (let i = 0; i < this.extrass.length; i++) {
      if (this.extrass[i].isChecked) {
        this.reservas.extras.push(this.extrass[i].name)
      }
    }
    if(this.mesaSeleccionada != "Servicio"){
      this.reservas.servicio = this.mesaSeleccionada
    }

    //SETEAR RESERVA DEL LOCAL
    this.reservaLocal.actividad = this.reservas.actividad;
    this.reservaLocal.hora = this.reservas.hora;
    this.reservaLocal.servicio = this.reservas.servicio;
    this.reservaLocal.local = this.reservas.local;
    this.reservaLocal.reserva = this.reservas.reserva;
    this.reservaLocal.extras = this.reservas.extras;
    this.reservaLocal.nombre = this.userActivo.name;
    this.reservaLocal.apellido = this.userActivo.lastname;
    this.reservaLocal.fecha = this.reservas.fecha;

    if (this.reservas.fecha != null && this.reservas.hora != 'Hora' && this.reservas.local != null && this.reservas.servicio != 'Servicio' && this.reservas.reserva != null) {
      this.alertaReserva(this.idLocal, this.reservaLocal)
    } else {
      this.presentToastError()
    }

  }

  //REALIZAR RESERVACION
  realizarReserva(idLocal, reservaLocal) {
    var id = this.firebase.getUser()
    console.log(this.reservas)
    this.firebase.crearReserva(this.reservas, id, idLocal, reservaLocal); // PRUEBA PARA VER SI realizarReservaA 
    this.presentToastReservacion()
    this.openPopoverReserva()
    this.router.navigate(["/tabs/reserva"]);
  }

  //OBTENER TODAS LAS RESERVAS REALIZADAS
  horasDisponibles() {
    for (let i = 0; i < this.usuarios.length; i++) {
      this.firebase.getReservasUsuarios(this.usuarios[i].id).subscribe(reservas => {
        var reservass = reservas
        this.aux(reservass)
      })
    }
    console.log(this.allreservas)
  }

  //FUNCION AUXILIAR DE HORASDISPONIBLES
  aux(agregado) {
    if (agregado.length != 0) {
      for (let i = 0; i < agregado.length; i++) {
        this.allreservas.push(agregado[i])
      }
    }
  }

  // verificar() {

  //   this.reservas.hora = this.Hora()
  //   var fecha = this.reservas.fecha
  //   console.log(fecha)
  //   console.log(this.reservas.hora = this.Hora())

  //   if (this.reservas.hora != 'Hora' && fecha != null) {
  //     console.log("wenas")
  //     for (let i = 0; i < this.allreservas.length; i++) {
  //       if (fecha == this.allreservas[i].fecha && this.reservas.hora == this.allreservas[i].hora && this.local.nombre == this.allreservas[i].local) {
  //         console.log("entro")
  //         for (let j = 0; j < this.servicios.length; j++) {
  //           console.log(this.allreservas[i].servicio)
  //           console.log(this.servicios[j])
  //           if (this.allreservas[i].servicio == this.servicios[j]) {
  //             console.log("aqui tambien entro we")
  //             this.servicios.splice(j, 1)
  //           }
  //         }
  //       }
  //     }
  //     console.log(this.servicios)
  //   }
  // }

  //VERIFICAR LOS SERVICIOS DISPONIBLES CON LOS DATOS INGRESADOS
  verificar2() {
    var fecha = this.reservas.fecha
    console.log(this.allreservas.length)
    this.horas = JSON.parse(JSON.stringify(this.horasoriginales))
    this.servicios = JSON.parse(JSON.stringify(this.serviciosoriginales))
    for (let i = 0; i < this.horas.length; i++) {
      var aux = 0
      console.log(this.horas[i])
      for (let j = 0; j < this.allreservas.length; j++) {
        if (this.horas[i] == this.allreservas[j].hora && this.local.nombre == this.allreservas[j].local && fecha == this.allreservas[j].fecha) {
          aux++
          console.log("entro")
        }
      }
      console.log(aux)
      console.log(this.servicios.length)
      if (aux == this.servicios.length) {
        this.horas.splice(i, 1)
        i--
        console.log("entro 1 vez")
      }
    }
    console.log(this.horas)
    this.cambiar()
    this.cambiar2()
  }

  //FUNCION AUXILIAR DE VERIFICAR
  cambiar() {
    var fecha = this.reservas.fecha
    console.log(this.horaSeleccionada)
    console.log(this.reservas.hora)

    this.reservas.hora = this.Hora()

    if (this.horaSeleccionada != 'Hora') {
      console.log("wenas")
      for (let i = 0; i < this.allreservas.length; i++) {
        if (fecha == this.allreservas[i].fecha && this.reservas.hora == this.allreservas[i].hora && this.local.nombre == this.allreservas[i].local) {
          console.log("entro")
          for (let j = 0; j < this.servicios.length; j++) {
            console.log(this.allreservas[i].servicio)
            console.log(this.servicios[j])
            if (this.allreservas[i].servicio == this.servicios[j]) {
              console.log("aqui tambien entro we")
              this.servicios.splice(j, 1)
            }
          }
        }
      }
      console.log(this.servicios)
    }
  }

  //SETEAR HORASELECCIONADA
  cambiar2() {
    if(this.local.picks == true){
      this.mesaSeleccionada = this.servicios[0]
    }
  }

  //AGREGAR LOCAL FAVORITO DEL USUARIO
  favorito() {
    var id = this.firebase.getUser()
    this.local.favoritos.push(id)
    console.log(this.local)
    this.firebase.updateLocal2(this.local, this.local.id)
    this.verficarFavorito()
  }

  //ELIMINAR LOCAL FAVORITO DEL USUARIO
  delfavorito() {
    var id = this.firebase.getUser()
    for (let i = 0; i < this.local.favoritos.length; i++) {
      if (this.local.favoritos[i] == id) {
        this.local.favoritos.splice(i, 1)
      }
    }
    console.log(this.local)
    this.firebase.updateLocal2(this.local, this.local.id)
    this.verficarFavorito()
  }

  //VERIFICAR SI EL LOCAL SELECCIONADO ES FAVORITO DEL USUARIO
  verficarFavorito() {
    var id = this.firebase.getUser()
    this.fav = false
    for (let i = 0; i < this.local.favoritos.length; i++) {
      if (this.local.favoritos[i] == id) {
        this.fav = true
      }
    }
  }

  //ALERTA RESERVACION
  // async alertaReservacion() {

  //   const alert = await this.alertController.create({
  //     header: 'Alert',
  //     subHeader: 'Reservación',
  //     message: 'La reserva se ha realizado correctamente',
  //     buttons: ['OK']
  //   })

  //   await alert.present();
  // }

  //PRESENTAR TOAST RESERVACION EXITOSA
  async presentToastReservacion() {
    const toast = await this.toastController.create({
      header: 'Reservacion',
      message: 'La reserva se ha realizado correctamente',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  //ALERTA CONFIRMACION DE LA RESERVA
  async alertaReserva(idLocal, reservaLocal) {
    this.var = 0
    const alert = await this.alertController.create({
      header: 'Confirmacion',
      message: '¿Estas seguro de realizar la reserva?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.realizarReserva(idLocal, reservaLocal)
          }
        }, {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });

    alert.present();
  }

  //ALERTAS SI INGRESAN DATOS MAL
  // async alert() {

  //     const alert = await this.alertController.create({
  //       header: 'Alert',
  //       subHeader: 'Reservación',
  //       message: 'Complete todos los campos correctamente',
  //       buttons: ['OK']
  //     })

  //     await alert.present();
  // }

  //PRESENTAR TOAST ERROR
  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Complete todos los campos correctamente',
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  //PopOvers de Extras y Reserva

  async openPopover(ev: Event) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      componentProps: {
        extras: this.extrass
      },
      cssClass: 'customepopover'
    });

    popover.onDidDismiss().then((dataReturned) => {
      try {
        if (dataReturned.data.length !== 0) {
          console.log(dataReturned.data)
          this.extrass = JSON.parse(JSON.stringify(dataReturned.data))
          console.log(this.extrass)
          this.presentToastExtras()
        } else {
          console.log("sin extras")
        }
      } catch (error) {
      }
    });

    return await popover.present()
  }

  async openPopoverReserva() {
    const popover = await this.popoverController.create({
      component: PopoverreservaPage,
      componentProps: {
        reserva: this.reservas.reserva,
        local: this.reservas.local,
        actividad: this.reservas.actividad,
        fecha: this.reservas.fecha,
        servicio: this.reservas.servicio,
        hora: this.reservas.hora,
        extras: this.reservas.extras
      },
      cssClass: 'customepopover'
    });

    popover.onDidDismiss().then(() => {
      
    });

    return await popover.present()
  }

  // PRESENTAR TOAST EXTRAS
  async presentToastExtras() {

    this.extrasString = ' '
    var aux: number = 0
    console.log(this.extrass)
    for (let i = 0; i < this.extrass.length; i++) {
      if (this.extrass[i].isChecked == true) {
        aux++
      }
    }
    for (let i = 0; i < this.extrass.length; i++) {

      if (this.extrass[i].isChecked == true) {
        aux--
        if (aux == 0) {
          this.extrasString = this.extrasString + this.extrass[i].name + '.'
        } else {
          this.extrasString = this.extrasString + this.extrass[i].name + ', '
        }
      }
    }


    console.log(this.extrasString)

    if (this.extrasString != ' ') {
      const toast = await this.toastController.create({
        message: 'Extras añadidos:' + this.extrasString,
        duration: 2000,
        position: 'top'
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Sin extras',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }

  }

  // resenas(nombre) {
  //   nombre = nombre
  //   this.router.navigate(["/tabs/resenas", nombre]);
  // }

  // cambio(extra){
  //   this.producto = extra
  // }

  ngOnInit() {
    this.dataRecv = this.activateRoute.snapshot.paramMap.get('nombre')
    console.log(this.dataRecv)
    var locales = this.firebase.localess;
    this.getlocal(locales)
    this.usuarios = this.firebase.users
    //this.horasDisponibles()
    this.verficarFavorito()
    this.horasDisponibles()
  }

}
