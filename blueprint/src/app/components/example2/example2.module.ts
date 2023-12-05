import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Example2RoutingModule } from './example2-routing.module';
import { Example2Component } from './example2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    Example2Component
  ],
  imports: [
    CommonModule,
    Example2RoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class Example2Module { }
