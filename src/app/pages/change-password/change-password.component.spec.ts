/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ChangePasswordComponent } from './change-password.component';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

class ActivatedRouteStub {
  constructor(public params: any) {}
  get snapshot() {
    return { queryParamMap: { get: (k: string) => this.params[k] } };
  }
}

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let router: RouterStub;

  beforeEach(async () => {
    router = new RouterStub();
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default returnUrl to /pages when none provided', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/pages']);
  });

  it('should respect returnUrl query param for navigation', () => {
    // re-init component with a returnUrl param
    TestBed.resetTestingModule();
    router = new RouterStub();
    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({ returnUrl: '/foo' }) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.onCancel();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/foo');
  });
});
