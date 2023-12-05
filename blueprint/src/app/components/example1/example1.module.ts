
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Example1Component } from './example1.component';
import { Example1RoutingModule } from './example1-routing.module';




@NgModule({
  declarations: [
  Example1Component
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    Example1RoutingModule

  ],
  exports: [
    Example1Component
  ]

})
export class Example1Module { }
