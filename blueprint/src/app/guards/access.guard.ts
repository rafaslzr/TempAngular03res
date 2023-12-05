import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
    constructor( private router: Router) { }
    canActivate() {
        let isLogged = this.login();
        if(!isLogged){
            console.log('You are not logged in');
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }

    login() {
      return true;
    }
  
}