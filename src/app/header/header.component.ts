import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() username!: string;
  role: string = '';
  adminRequestCount: number = 0;

  constructor(
    private popoverCtrl: PopoverController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.userId.subscribe(userId => {
      if (userId) {
        this.authService.getUserData(userId).subscribe(
          userData => {
            this.role = userData.role || '';
            if (this.role === 'admin') {
              this.authService.adminRequestCount$.subscribe(count => {
                this.adminRequestCount = count;
              });
            }
          },
          error => {
            console.error('Failed to fetch user data:', error);
          }
        );
      }
    });
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: UserPopoverComponent,
      event,
      translucent: true,
      componentProps: {
        role: this.role
      }
    });
    await popover.present();
  }
}
