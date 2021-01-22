import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Usuario } from '../Models/models';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  userActivo: Usuario = {}
  idUserActivo: string

  constructor(public firebase: FirebaseServiceService) {

    this.idUserActivo = this.firebase.getUser()
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

  ngOnInit() {
    this.firebase.getUser()
  }

}