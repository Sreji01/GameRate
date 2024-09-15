import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent implements OnInit {
  @Input() role!: string;
  adminRequestCount: number = 0;

  constructor(
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.role === 'admin') {
      this.authService.getAdminsToApprove().subscribe((data) => {
        this.adminRequestCount = Object.keys(data).length;
      });
    }
  }

  onLogout() {
    this.authService.logOutPopover();
    this.popoverCtrl.dismiss();
  }

  navigateToProfile() {
    this.router.navigateByUrl('/profile');
    this.popoverCtrl.dismiss();
  }

  navigateToRequests() {
    this.router.navigateByUrl('/requests');
    this.popoverCtrl.dismiss();
  }
}
