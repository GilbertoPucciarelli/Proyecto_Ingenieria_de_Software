
import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Usuario } from '../Models/models';
import { RouterModule, Routes, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  opcionSeleccionado: string = 'gender';
  verSeleccion: string = '';
  users = {} as Usuario
  fechamax
  
  constructor(private firebase: FirebaseServiceService, private router: Router, private alertController: AlertController, public toastController: ToastController) { 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    this.fechamax = yyyy + '-' + mm + '-' + dd;
  }

  Gender() {
    this.verSeleccion = this.opcionSeleccionado;
    return this.verSeleccion
  }

  imgGender() {
    switch (this.Gender()) {
      case 'female': {
        return 'https://firebasestorage.googleapis.com/v0/b/lereserve-30a76.appspot.com/o/female.png?alt=media&token=2d9f5816-2060-4d20-a847-8c88e5a23305'
      }
      case 'male': {
        return 'https://firebasestorage.googleapis.com/v0/b/lereserve-30a76.appspot.com/o/male.png?alt=media&token=7dc83bb4-f996-4f5f-b05c-d93f6b07b5b4'
      }
      case 'other': {
        return 'https://firebasestorage.googleapis.com/v0/b/lereserve-30a76.appspot.com/o/user.png?alt=media&token=d441df05-e026-41b8-a09c-e82f2c343873'
      }
    }
  }

  register() {
    this.users.gender = this.Gender()
    this.users.img = this.imgGender()
    this.users.tema = 'default'
    if (this.users.name != null && this.users.lastname != null && this.users.gender != 'gender' && this.users.birthday != null && this.users.email != null && this.users.password != null) {
      console.log(this.users)
      this.firebase.crearUsuario(this.users.name, this.users.lastname, this.users.gender, this.users.birthday, this.users.email, this.users.password, this.users.img, this.users.tema);
      this.presentToast()
    } else {

      this.presentToast2();
    }
  }

  ngOnInit() {
    
  }

  //ALERTAS SI INGRESAN DATOS MAL
  async alert() {

    if (this.users.name == null || this.users.lastname == null || this.users.gender == null || this.users.birthday == null || this.users.email == null || this.users.password == null) {

      const alert = await this.alertController.create({
        header: 'Alert',
        subHeader: 'Registro',
        message: 'Complete todos los campos correctamente',
        buttons: ['OK']
      })

      await alert.present();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Cargando...',
      duration: 2000
    });
    toast.present();
  }

  async presentToast2() {
    const toast = await this.toastController.create({
      message: 'Complete todos los campos correctamente',
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }

}