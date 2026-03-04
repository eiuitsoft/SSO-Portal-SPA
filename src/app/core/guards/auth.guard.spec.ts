import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthGuard', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [AuthGuard]
      }).compileComponents();
   });

   it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
      expect(guard).toBeTruthy();
   }));
});
