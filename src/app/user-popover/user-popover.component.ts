import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent {
  constructor(
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private router: Router
  ) {}

  onLogout() {
    this.authService.logOut();
    this.popoverCtrl.dismiss();
  }

  navigateToProfile(){
    this.router.navigateByUrl('/profile');
    this.popoverCtrl.dismiss();
  }
}
