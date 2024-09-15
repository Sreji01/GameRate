import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  admins: any[] = [];
  @Output() adminRemoved = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.authService.getAdminsToApprove().subscribe(data => {
      this.admins = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));

      this.authService.setAdminRequestCount(this.admins.length);
    });
  }

  async acceptAdmin(admin: any) {
    this.authService.register(admin).subscribe(async () => {
      const alert = await this.alertCtrl.create({
        message: "Admin request accepted!",
        cssClass: 'custom-alert'
      });
      await alert.present();

      setTimeout(() => {
        alert.dismiss();
      }, 1000);

      this.authService.deleteAdminData(admin.id).subscribe({
        next: () => {
          this.admins = this.admins.filter(a => a.id !== admin.id);
          this.adminRemoved.emit(admin.id);

          this.authService.setAdminRequestCount(this.admins.length);
        },
        error: (error) => {
          console.error('Error deleting admin:', error);
        }
      });
    });
  }

  rejectAdmin(admin: any) {
    this.authService.deleteAdminData(admin.id).subscribe({
      next: async () => {
        const alert = await this.alertCtrl.create({
          message: "Admin request rejected!",
          cssClass: 'custom-alert'
        });
        await alert.present();

        setTimeout(() => {
          alert.dismiss();
        }, 1000);

        this.admins = this.admins.filter(a => a.id !== admin.id);
        this.adminRemoved.emit(admin.id);

        this.authService.setAdminRequestCount(this.admins.length);
      },
      error: (error) => {
        console.error('Error rejecting admin:', error);
      }
    });
  }
}
