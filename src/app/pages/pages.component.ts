import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet],
  template: `<div style="padding: 10px;">
    <router-outlet></router-outlet>
  </div>`,
})
export class PagesComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
