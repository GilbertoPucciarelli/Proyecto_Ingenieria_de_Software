import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Router } from '@angular/router';
import { Usuario } from '../Models/models';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  localess = []
  localesoriginales = []
  locales = []
  idUserActivo: string
  userActivo: Usuario = {}
  arrayUsuarios = []

  constructor(private firebase: FirebaseServiceService, public router: Router) {
    this.userActivo.tema = 'default'
    this.idUserActivo = this.firebase.getUser()
    console.log(this.idUserActivo)
    this.firebase.getAllUsers().subscribe(usuarios =>{
      console.log(this.arrayUsuarios)
      this.userActivo = this.findUser(this.idUserActivo,usuarios)
      console.log(this.userActivo)
    })
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

  igualar(locales){
    this.localesoriginales = JSON.parse(JSON.stringify(locales))
  }
 
  ngOnInit() {
    this.firebase.getAllLocales().subscribe(locales =>{
      this.locales = []
      for (let i = 0; i < locales.length; i++) {
        if(locales[i].disponibilidad == true){
          for (let j = 0; j < locales[i].favoritos.length; j++) {
            if(locales[i].favoritos[j] == this.firebase.getUser()){
              this.locales.push(locales[i])
            }
            }
        }
      }
      this.igualar(this.locales)
    })
  }
}
