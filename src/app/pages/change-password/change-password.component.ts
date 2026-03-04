import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
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
  private readonly fb = inject(FormBuilder);
  private readonly _service = inject(ChangePasswordService);
  private readonly _alert = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  submitting = false;
  private returnUrl: string = '/';

  // 2. Sử dụng Typed Forms & NonNullable để an toàn dữ liệu
  readonly form = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      logoutAllDevices: [false],
    },
    { validators: this.passwordMatchValidator },
  );

  // Getter ngắn gọn, trả về đúng kiểu AbstractControl thay vì AbstractControl | null
  get currentPassword() {
    return this.form.controls.currentPassword;
  }
  get newPassword() {
    return this.form.controls.newPassword;
  }
  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }

  ngOnInit(): void {
    this.initReturnUrl();
  }

  private initReturnUrl(): void {
    const param = this.route.snapshot.queryParamMap.get('returnUrl');
    if (!param) return; // Giữ nguyên '/' mặc định

    try {
      this.returnUrl = decodeURIComponent(param);
    } catch {
      this.returnUrl = param;
    }
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newP = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!newP || !confirm) return null;

    return newP === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { currentPassword, newPassword, logoutAllDevices } = this.form.getRawValue();

    this._service
      .changePassword({ currentPassword, newPassword, logoutAllDevices })
      .pipe(finalize(() => (this.submitting = false))) // 3. Tự động tắt submitting dù success hay error
      .subscribe({
        next: (res) => {
          if (res.success) {
            this._alert.successBase(
              'Thành công',
              'Đổi mật khẩu thành công. Bạn có thể đăng nhập lại bằng mật khẩu mới.',
            );
            this.form.reset();
          } else {
            this._alert.error('Lỗi', res.message || 'Đổi mật khẩu thất bại.');
          }
        },
        error: (err) => {},
      });
  }

  onCancel(event?: Event): void {
    event?.preventDefault();
    this.form.reset();
  }

  // 4. Gom nhóm logic điều hướng (DRY)
  private navigateBack(): void {
    if (this.returnUrl && this.returnUrl !== '/') {
      if (/^https?:\/\//.test(this.returnUrl)) {
        window.location.href = this.returnUrl;
      } else {
        this.router.navigateByUrl(this.returnUrl);
      }
    } else {
      // Logic fallback mặc định khi không có returnUrl
      this.router.navigate(['/account']);
    }
  }
}
