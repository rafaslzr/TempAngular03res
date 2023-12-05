import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Example1Component } from './components/example1/example1.component';
import { Example2Component } from './components/example2/example2.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { AccessGuard } from './guards/access.guard';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'heroes',component: HeroesComponent },
  {
    path: 'sample-route-one',
    loadChildren: () => import('./components/example1/example1.module').then(m => m.Example1Module)
  },
  { path: 'sample-route-two', component: Example2Component }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
