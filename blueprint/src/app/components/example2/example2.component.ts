import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Banker } from 'src/app/interfaces/banker';
import { TestApiService } from 'src/app/services/test-api/test-api.service';

@Component({
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrls: ['./example2.component.scss']
})
export class Example2Component implements OnInit {
  form!: FormGroup;
  arrayBankers!: Banker[];

  constructor(private apiService : TestApiService) { }

  ngOnInit(): void {
    this.initForm();
    this.apiService.getBankers$().subscribe(item=>{
      this.arrayBankers = item;
    })
  }

  initForm(){
    this.form = new FormGroup({
      name: new FormControl(),
      email: new FormControl()
    })

  }

  onSubmit(){
    this.apiService.addBankers(this.form.value);
  }


}
