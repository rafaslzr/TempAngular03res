import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Banker } from 'src/app/interfaces/banker';
import { TestApiService } from 'src/app/services/test-api/test-api.service';


@Component({
  selector: 'app-example1',
  templateUrl: './example1.component.html',
  styleUrls: ['./example1.component.scss']
})
export class Example1Component implements OnInit, OnDestroy {
  bankersSuscription! : Subscription;
  bankers!: Banker[];
  columns: string[] = ['name', 'email'];
  dataSource = new MatTableDataSource<Banker>();
  public dataList: any = [];
  @ViewChild(MatTable)
  tableBankers!: MatTable<Banker>;

  constructor(private apiService: TestApiService) { }

  ngOnInit(): void {
    this.getBankers();
  }

  getBankers(){
    this.bankersSuscription = this.apiService.getBankers().subscribe(data => {
      this.bankers = data;
      this.dataSource.data = this.bankers;
      console.log('Subscribe executed.', this.bankers)
    }, ()=>{
      console.log('error Example1Component');
    }
    );
    console.log('I will not wait until subscribe is executed..');
  }


  ngOnDestroy(): void {
    this.bankersSuscription.unsubscribe();
    console.log('unsubscription');
  }
}
