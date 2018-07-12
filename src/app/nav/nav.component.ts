import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  private menu;

  constructor() { }

  ngOnInit() {
    this.menu = document.getElementById('menu');
  }

  toggleMenu() {
    this.menu.hidden = !this.menu.hidden;
  }
}
