import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly _keycloakService = inject(KeycloakService);
  constructor() {}

  async canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (await this._keycloakService.isLoggedIn()) {
      return true;
    }
    // Nếu chưa đăng nhập, chuyển hướng đến login
    await this._keycloakService.login({
      redirectUri: window.location.origin + state.url,
    });
    return false;
  }
}
