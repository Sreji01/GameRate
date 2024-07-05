import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  shouldShowHeader: boolean = true;
  shouldShowTabBar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute(event.urlAfterRedirects || event.url);
      }
    });
  }

  ngOnInit() {
    this.checkCurrentRoute(this.router.url);
  }

  private checkCurrentRoute(url: string) {
    const noHeaderFooterRoutes = ['/log-in', '/register'];
    this.shouldShowHeader = !noHeaderFooterRoutes.includes(url);
    this.shouldShowTabBar = !noHeaderFooterRoutes.includes(url);
  }
}
