import {Component, Input} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent {
  role!: string
  constructor(
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private router: Router
  ) {}

  onLogout() {
    this.authService.logOutPopover();
    this.popoverCtrl.dismiss();
  }

  navigateToProfile(){
    this.router.navigateByUrl('/profile');
    this.popoverCtrl.dismiss();
  }

  navigateToRequests(){
    this.router.navigateByUrl('/requests');
    this.popoverCtrl.dismiss();
  }
}
