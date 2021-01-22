import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { Usuario } from '../Models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversaciones',
  templateUrl: './conversaciones.page.html',
  styleUrls: ['./conversaciones.page.scss'],
})
export class ConversacionesPage implements OnInit {

  localIdActivo;
  conversaciones = [];
  arrayUsuarios = [];
  array = [];
  mensajes = [];
  conversacionesA = []

  constructor(private firebase: FirebaseServiceService, public router: Router) {

    this.localIdActivo = this.firebase.getIdLocalActivo()
    console.log(this.localIdActivo)
  }

  seleccion(nombre) {
    nombre = nombre
    this.router.navigate(["/tabs/mensajes", nombre]);
  }

  ordenarID() {
    for (let i = 0; i < this.conversaciones.length; i++) {
      if (this.conversacionesA.length == 0) {
        this.conversacionesA.push(this.conversaciones[i])
      } else {
        var aux = 0
        for (let j = 0; j < this.conversacionesA.length; j++) {
          if (this.conversaciones[i].idUsuario == this.conversacionesA[j].idUsuario) {
            aux++
          }
        }
        if (aux == 0) {
          this.conversacionesA.push(this.conversaciones[i])
        }
      }
    }

    console.log(this.conversacionesA)
  }

  ngOnInit() {

    this.firebase.getAllUsers().subscribe(usuarios => {

      this.arrayUsuarios = usuarios;
      console.log(this.arrayUsuarios);

      for (var i = 0; i < this.arrayUsuarios.length; i++) {

        this.firebase.getMessagesLocal(this.arrayUsuarios[i].id, this.localIdActivo).subscribe(chats => {

          if (chats.length != 0) {
            for (var i = 0; i < chats.length; i++) {
              this.conversaciones.push(chats[i]);
            }
          }


        })
      }

      console.log("Array: ", this.conversaciones);
    })
  }
}