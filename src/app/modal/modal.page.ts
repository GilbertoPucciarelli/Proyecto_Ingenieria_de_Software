import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  array = []
  info

  constructor(private navParams: NavParams, private modalController: ModalController) { }

  async closeModal(){
    var aux = 0
    if(this.array.length != 0){
      for (let i = 0; i < this.array.length; i++) {
        if(this.array[i] != ''){
          aux = 1
        }
      }
      if(aux == 1){
        console.log(this.array)
        for (let i = 0; i < this.array.length; i++) {
          if(this.array[i] == ''){
            this.array.splice(i,1)
            i--
          }
          
        }
        console.log(this.array)
        const onClosedData = JSON.parse(JSON.stringify(this.array))
        onClosedData.unshift(this.info)
        await this.modalController.dismiss(onClosedData);
      }else{
        console.log("nope ingresa dato menor")
      }

    }else{
      console.log("nope ingresa al menos una hora")
    }
    
  }

  async closeModal2(){
    const onClosedData = JSON.parse(JSON.stringify(this.array))
    onClosedData.unshift(this.info)
    onClosedData.unshift("back")
    await this.modalController.dismiss(onClosedData)
  }

  addArray() {
    this.array.push('');
  }
 
  removeArray(i: number) {
    this.array.splice(i, 1);
  }

  ngOnInit() {
    this.array = this.navParams.get('array')
    this.info = this.navParams.get('info')
    console.log(this.array)
  }

}
