import { Component, OnInit, OnChanges } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.menu = document.getElementById('menu');
    this.search = document.getElementById('search');
    // doesn't change if screen width changes
    this.nav_width = document.querySelector('.nav').getBoundingClientRect().width;
    this.wide_enough = this.nav_width > 576;
    this.location_home = window.location.pathname === '/';
  }

  toggleMenu() {
    this.menu.hidden = !this.menu.hidden;
  }

  toggleSearch() {
    this.search.hidden = !this.search.hidden;
  }

  // ngOnChanges() {
  //   // doesn't change if screen width changes
  //   this.nav_width = document.querySelector('.nav').getBoundingClientRect().width;
  //   this.wide_enough = this.nav_width > 576;
  //   this.location_home = window.location.pathname === '/';
  // }
}
