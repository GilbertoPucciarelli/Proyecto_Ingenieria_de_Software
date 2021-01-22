import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular'
import { Usuario } from '../Models/models';
import { FirebaseServiceService } from '../services/firebase-service.service';

@Component({
  selector: 'app-popoverhelp',
  templateUrl: './popoverhelp.page.html',
  styleUrls: ['./popoverhelp.page.scss'],
})
export class PopoverhelpPage implements OnInit {
  idUserActivo: string
  userActivo: Usuario = {}
  arrayUsuarios = []
  constructor(private popoverController: PopoverController, private firebase: FirebaseServiceService) {
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

  ngOnInit() {
  }

}
