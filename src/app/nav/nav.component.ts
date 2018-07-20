import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  private menu: HTMLElement;
  private search: HTMLElement;
  nav_width: number;
  wide_enough: boolean;
  location_home: boolean;

  constructor(private router:Router) { }

  ngOnInit() {
    this.menu = document.getElementById('menu');
    this.search = document.getElementById('search');
    // doesn't change if screen width changes | fixed below
    this.nav_width = document.querySelector('.nav').getBoundingClientRect().width;
    this.wide_enough = this.nav_width > 576;
    this.location_home = window.location.pathname === '/';

    // recheck window location to load location-serach on non-home pages
    this.router.events
      .subscribe(
        event => {
          if (event instanceof NavigationEnd) {
            this.nav_width = document.querySelector('.nav').getBoundingClientRect().width;
            this.wide_enough = this.nav_width > 576;
            this.location_home = window.location.pathname === '/';
            console.log('Routes Recognized Event Triggered');
          }
        }
      );
  }

  toggleMenu() {
    this.menu.hidden = !this.menu.hidden;
  }

  toggleSearch() {
    this.search.hidden = !this.search.hidden;
  }
}
