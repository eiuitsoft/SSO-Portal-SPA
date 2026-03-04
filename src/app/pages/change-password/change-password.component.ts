import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangePasswordService } from '../../core/services/account/change-password.service';
import { AlertService } from '../../core/services/notification/alert.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  submitting = false;
  /** URL to navigate back after successful password change or cancel. */
  private returnUrl: string | null = null;

  private readonly _service = inject(ChangePasswordService);
  private readonly _alert = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnInit() {
    // capture optional returnUrl query parameter from caller (e.g. other applications)
    const param = this.route.snapshot.queryParamMap.get('returnUrl');
    if (param) {
      // decode in case the parameter was encoded by the caller
      try {
        this.returnUrl = decodeURIComponent(param);
      } catch {
        this.returnUrl = param;
      }
    } else {
      // default location within this app
      this.returnUrl = '/';
    }
  }

  private passwordMatchValidator(g: FormGroup) {
    const newP = g.get('newPassword')?.value;
    const confirm = g.get('confirmPassword')?.value;
    if (!newP || !confirm) return null;
    return newP === confirm ? null : { passwordMismatch: true };
  }

  get currentPassword() {
    return this.form.get('currentPassword');
  }
  get newPassword() {
    return this.form.get('newPassword');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitting = true;
    this._service
      .changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      })
      .subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.success) {
            this._alert.successNoProcess(
              'Đổi mật khẩu thành công. Bạn có thể đăng nhập lại bằng mật khẩu mới.',
            );
            this.form.reset();
            // after success redirect back to original caller if provided
            if (this.returnUrl) {
              // navigate outside of router if url is absolute
              if (/^https?:\/\//.test(this.returnUrl)) {
                window.location.href = this.returnUrl;
              } else {
                this.router.navigateByUrl(this.returnUrl);
              }
            } else {
              this.router.navigate(['/account']);
            }
          } else {
            this._alert.error('Lỗi', res.message || 'Đổi mật khẩu thất bại.');
          }
        },
        error: (err) => {
          this.submitting = false;
        },
      });
  }

  onCancel(event?: Event) {
    event?.preventDefault();
    if (this.returnUrl) {
      if (/^https?:\/\//.test(this.returnUrl)) {
        window.location.href = this.returnUrl;
      } else {
        this.router.navigateByUrl(this.returnUrl);
      }
    } else {
      this.router.navigate(['/pages']);
    }
  }
}
