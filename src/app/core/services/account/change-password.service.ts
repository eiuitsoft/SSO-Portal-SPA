import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OperationResult } from '../../models/general/operation-result';
import { ChangePasswordRequest } from '../../models/change-password/change-password';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  private readonly apiUrl = `${environment.API_URL}/Account`;

  constructor(private readonly http: HttpClient) {}

  changePassword(request: ChangePasswordRequest): Observable<OperationResult> {
    return this.http.post<OperationResult>(`${this.apiUrl}/ChangePassword`, request);
  }
}
