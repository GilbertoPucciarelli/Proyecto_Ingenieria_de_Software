import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Router } from '@angular/router';
import { Usuario } from '../Models/models';
import { PopoverhelpPage } from '../popoverhelp/popoverhelp.page';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    locales = []
    localesoriginales = []
    idUserActivo: string
    userActivo: Usuario = {}
    arrayUsuarios = []
    
    
  constructor(private firebase: FirebaseServiceService, public router: Router,private popoverController: PopoverController) {
    this.userActivo.tema = 'default'
  }

  findUser(iduserActivo,arrayUsuarios){
    for(var i=0; i < arrayUsuarios.length; i++){
      if(arrayUsuarios[i].id == iduserActivo){
        return arrayUsuarios[i]
      }
    }
  }
  
  seleccion(nombre){
    nombre = nombre
    this.router.navigate(["/tabs/local",nombre]);
    console.log("funciona")
  }

  busqueda(event){

    const texto = event.target.value
    this.locales = JSON.parse(JSON.stringify(this.localesoriginales))
    if(texto == ''){
      this.locales = JSON.parse(JSON.stringify(this.localesoriginales))
    }else{
      this.locales = JSON.parse(JSON.stringify(this.buscar(texto)))
    }
    console.log(texto)
    console.log(this.locales)
    console.log(this.localesoriginales)
  }

  buscar(texto){
    if(texto != undefined){
      return this.locales.filter(function(el) {
        return el.nombre.toLowerCase().indexOf(texto.toLowerCase()) > -1;
    })
    }
  }

  cerrarSesion(){
    return this.firebase.logOut()
  }

  guardarLocales(locales){
    this.localesoriginales = JSON.parse(JSON.stringify(locales))
    console.log(this.localesoriginales)
  }

  async openPopover(ev: Event) {
    const popover = await this.popoverController.create({
      component: PopoverhelpPage,
      cssClass: 'customepopover2'
    });

    popover.onDidDismiss().then(() => {
      console.log("Popover cerrado")
    });

    return await popover.present()
  }

  ngOnInit() {
    this.firebase.getAllLocales().subscribe(locales =>{
      this.locales = []
      for (let i = 0; i < locales.length; i++) {
        if(locales[i].disponibilidad == true){
          this.locales.push(locales[i])
        }
      }
      this.guardarLocales(this.locales)
    })
    this.idUserActivo = this.firebase.getUser()
    console.log(this.idUserActivo)
    this.firebase.getAllUsers().subscribe(usuarios =>{
      this.userActivo = this.findUser(this.idUserActivo,usuarios)
      console.log(this.userActivo)
    })
  }

}
