import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Banker } from 'src/app/interfaces/banker';
import { BANKERS } from '../mock-bankers';
@Injectable({
  providedIn: 'root',
})
export class TestApiService {

  private bankers : Banker[];
  private bankersObs$: Subject<Banker[]>;
  constructor(private http: HttpClient) {
    this.bankers = [];
    this.bankersObs$ = new Subject();
  }


  public getBankers(): Observable<Banker[]> {
    /*return this.http
      .get<Bankers[]>('http://localhost:81/wordpress/wp-json/wp/v2/banker')*/
      const bankers =  of(BANKERS);
      return bankers;
  }

  addBankers(item: Banker){
    this.bankers.push(item);
    this.bankersObs$.next(this.bankers);
  }

  getBankers$(): Observable<Banker[]>{
    return this.bankersObs$.asObservable();

  }

}
