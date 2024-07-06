import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-anime-modal',
  templateUrl: './anime-modal.component.html',
  styleUrls: ['./anime-modal.component.scss'],
})
export class AnimeModalComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel(){
    this.modalCtrl.dismiss();
  }
}
