export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  /** Nếu true: sau khi đổi mật khẩu sẽ đăng xuất tất cả phiên đăng nhập (tất cả thiết bị phải đăng nhập lại). */
  logoutAllDevices?: boolean;
}
