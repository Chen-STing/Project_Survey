import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ExampleService } from '../@services/example.service';




export const routerValidGuard: CanActivateFn = (route, state) => {


  let valid = inject(ExampleService);
  console.log(route);
  console.log(state);


  if(valid.user === "admin" && valid.password === "123") {
    valid.token = true;
    return true;
  }

  return false;
}
