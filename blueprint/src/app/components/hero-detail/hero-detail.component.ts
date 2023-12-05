import { Component, Input, OnInit } from '@angular/core';
import { Hero } from 'src/app/interfaces/hero';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
