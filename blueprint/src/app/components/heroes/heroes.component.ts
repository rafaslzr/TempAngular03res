import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero';
import { HeroService } from 'src/app/services/hero/hero.service';
import { HEROES } from 'src/app/services/mock-heroes';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  heroes = HEROES;
  selectedHero?: Hero;
  stopwatchHero$!: Observable<Hero[]>;
  stopwatchHero: Hero[] = [];

  constructor( private serviceHero : HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  getHeroes(): void {
    this.serviceHero.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
    this.stopwatchHero$= this.serviceHero.getHeroes();
    this.stopwatchHero$.subscribe(hero =>
      this.stopwatchHero = hero
      );
  }

}
