import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service'
import { Usuario } from '../Models/models';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  users = {} as Usuario
  constructor(private firebase: FirebaseServiceService, private router: Router, private alertController: AlertController,public toastController: ToastController) { }

  login() {

    if (this.users.email != null && this.users.password != null) {

      this.presentToast()
      this.firebase.login(this.users.email, this.users.password);
    } else {

      this.presentToast2();
    }
  }

  //ALERTAS SI INGRESAN DATOS MAL
  async alert() {

    if (this.users.email == null || this.users.password == null) {

      const alert = await this.alertController.create({
        header: 'Alert',
        subHeader: 'Login',
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

  ngOnInit() {
  }
}