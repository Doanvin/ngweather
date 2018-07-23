import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  // @ViewChild('menu') private menu: ElementRef<HTMLElement>;
  @ViewChild('search') private search: ElementRef<HTMLElement>;
  nav_width: number;
  wide_enough: boolean;
  location_home: boolean;

  constructor(private router:Router) { }

  ngOnInit() {
    // recheck window location to load location-serach on non-home pages
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setCheckVariables();
          console.log('Routes NavigationEnd Event Triggered');
        }
    });
  }

  // checks if window.location is home and if viewport is wide 
  // enough to display the search bar in the nav section
  setCheckVariables() {
    this.nav_width = document.querySelector('.nav').getBoundingClientRect().width;
    this.wide_enough = this.nav_width > 576;
    this.location_home = window.location.pathname === '/';
  }

  // toggleMenu() {
  //   this.menu.nativeElement.hidden = !this.menu.nativeElement.hidden;
  // }

  toggleSearch() {
    this.search.nativeElement.hidden = !this.search.nativeElement.hidden;
  }
}
