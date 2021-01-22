import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular'
import { Usuario } from '../Models/models';
import { FirebaseServiceService } from '../services/firebase-service.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {
  idUserActivo: string
  userActivo: Usuario = {}
  arrayUsuarios = []
  extras = []

  constructor(private navParams: NavParams, private popoverController: PopoverController, private firebase: FirebaseServiceService) { 
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
    const onClosedData = JSON.parse(JSON.stringify(this.extras))
    await this.popoverController.dismiss(onClosedData);
  }

  agregarExtras(extra){
    for (let i = 0; i < this.extras.length; i++) {
      if(this.extras[i].name == extra.name)
      if(this.extras[i].isChecked){
        this.extras[i].isChecked == false
      }else{
        this.extras[i].isChecked == true
      }
    }
    console.log(this.extras)
  }


  ngOnInit() {
    this.extras = JSON.parse(JSON.stringify(this.navParams.get('extras')))
    console.log(this.extras)
  }

}
