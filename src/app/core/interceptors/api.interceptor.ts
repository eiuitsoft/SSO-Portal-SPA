import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpStatusCode,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable, from, catchError, throwError, switchMap } from 'rxjs';
import { AlertService } from '../services/notification/alert.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly _alert = inject(AlertService);
  protected readonly _keycloakService = inject(KeycloakService);

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Chuyển xử lý bất đồng bộ thành Observable bằng from()
    return from(this.handleRequest(request, next)).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `${error.error.message}`;
        } else if (error.status === 0) {
          errorMessage = `Xin lỗi, hiện tại hiện tại không thể kết nối với API. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.`;
        }
        // Get service-side error
        else if (error.status === HttpStatusCode.Unauthorized) {
          errorMessage = 'Bạn không có quyền truy cập trang này bây giờ !';
          localStorage.clear();
        } else {
          // server-side error
          errorMessage =
            'Đã xảy ra lỗi với yêu cầu này. Chúng tôi đang cố gắng sửa lỗi sớm nhất có thể.';
        }
        this._alert.error(
          `Mã lỗi: ${error.status === 0 ? ` ${HttpStatusCode.InternalServerError}` : error.status}`,
          `Nội dung: ${errorMessage}`,
        );
        return throwError(errorMessage);
      }),
    );
  }

  private handleRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders();

    // Xử lý Content-Type và Accept headers
    const contentType = request.headers.get('Content-Type');
    switch (contentType) {
      case 'application/json':
        headers = headers.set('Content-Type', 'application/json');
        break;
      case 'application/xml':
        headers = headers.set('Accept', 'application/xml');
        break;
      case 'application/x-www-form-urlencoded':
        headers = headers.set('Accept', 'application/x-www-form-urlencoded');
        break;
      case 'multipart/form-data':
        headers = headers.set('Accept', 'multipart/form-data');
        break;
      case 'text/plain':
        headers = headers.set('Accept', 'text/plain');
        break;
      case 'text/html':
        headers = headers.set('Accept', 'text/html');
        break;
      default:
        break;
    }

    // Lấy token bất đồng bộ và thêm vào header
    return from(this._keycloakService.getToken()).pipe(
      // Thêm token vào headers và clone request
      switchMap((token) => {
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        const authRequest = request.clone({ headers });
        return next.handle(authRequest);
      }),
    );
  }
}
