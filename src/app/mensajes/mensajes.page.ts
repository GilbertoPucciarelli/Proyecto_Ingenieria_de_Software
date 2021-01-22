import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  constructor(public router: Router) { }

  back() {
    this.router.navigate(["/tabs/conversaciones"]);
  }

  ngOnInit() {
  }

}
