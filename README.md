# Hệ thống Đăng ký Tài khoản Phụ huynh - Trường Đại học Quốc tế Miền Đông

Đây là một dự án ứng dụng web được xây dựng bằng Angular, cho phép phụ huynh sinh viên đăng ký tài khoản để theo dõi và quản lý thông tin liên quan đến con em mình tại Trường Đại học Quốc tế Miền Đông (EIU).

## Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng chính](#tính-năng-chính)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn cài đặt và chạy dự án](#hướng-dẫn-cài-đặt-và-chạy-dự-án)
  - [Yêu cầu](#yêu-cầu)
  - [Cài đặt](#cài-đặt)
  - [Chạy Development Server](#chạy-development-server)
  - [Build dự án](#build-dự-án)

## Công nghệ sử dụng

- **Framework:** [Angular](https://angular.io/) (v20+)
- **UI Library:** [Angular Material](https://material.angular.io/)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [SCSS](https://sass-lang.com/)
- **Form:** Angular Reactive Forms
- **HTTP Client:** Sử dụng `HttpClient` của Angular kết hợp với `Interceptors` để quản lý các request API một cách tập trung.
- **Asynchronous:** Tận dụng RxJS để xử lý các tác vụ bất đồng bộ và quản lý luồng dữ liệu.
- **Kiến trúc:** Xây dựng trên kiến trúc **Standalone Components** mới nhất của Angular, giúp tối ưu hóa và tăng tính module hóa cho ứng dụng.

## Tính năng chính

- **Form Đăng ký Phụ huynh:** Giao diện form chi tiết để thu thập thông tin của phụ huynh và sinh viên.
- **Validation Dữ liệu:** Sử dụng Angular Reactive Forms để kiểm tra tính hợp lệ của dữ liệu nhập vào theo thời gian thực (required, email, pattern cho số điện thoại).
- **Hệ thống đổi mật khẩu tập trung:** Trang đổi mật khẩu có thể được tái sử dụng bởi nhiều ứng dụng khác nhau. Các ứng dụng chỉ cần chuyển hướng người dùng đến URL của hệ thống kèm theo query param `returnUrl` (ví dụ `https://sso.example.com/change-password?returnUrl=https%3A%2F%2Fapp.example.com%2Fdashboard`). Sau khi thay đổi mật khẩu thành công hoặc hủy bỏ, người dùng sẽ được trả lại về đường dẫn gốc. Nếu không chỉ định `returnUrl`, hệ thống sẽ dẫn về trang mặc định nội bộ.
- **Giao diện Người dùng Hiện đại:** Sử dụng thư viện Angular Material để xây dựng các thành phần UI như input, button, date picker, radio button, checkbox...
- **Kiến trúc Standalone Components:** Tận dụng kiến trúc mới của Angular để tối ưu hóa ứng dụng, giúp các component hoạt động độc lập và dễ dàng tái sử dụng.
- **Xử lý HTTP Interceptors:**
  - `LoadingInterceptor`: Tự động hiển thị thanh tiến trình (progress bar) khi có request HTTP đang chạy, cải thiện trải nghiệm người dùng.
  - `ApiInterceptor`: Xử lý và hiển thị thông báo lỗi một cách tập trung cho các API call, giúp mã nguồn sạch sẽ và dễ bảo trì.

## Cấu trúc dự án

Dự án được tổ chức theo cấu trúc module hóa, giúp dễ dàng quản lý và mở rộng:

```
/src
├── /app
│   ├── /core
│   │   ├── /constants      # Chứa các hằng số
│   │   ├── /enums          # Chứa các kiểu dữ liệu enum
│   │   ├── /interceptors   # Chứa các HTTP Interceptors (ApiInterceptor, LoadingInterceptor)
│   │   └── /services       # Chứa các services cốt lõi (AlertService, ParentRegistrationService)
│   ├── /layout
│   │   ├── /footer         # Component Footer
│   │   ├── /main-layout    # Component layout chính của ứng dụng
│   │   └── /header         # (Dự kiến) Component Header
│   ├── /pages
│   │   └── /parent-registration # Trang đăng ký cho phụ huynh
│   ├── app.component.ts
│   ├── app.config.ts       # Cấu hình ứng dụng, providers, interceptors
│   └── app.routes.ts       # Định tuyến cho ứng dụng
├── /assets                 # Chứa các tài nguyên tĩnh như hình ảnh, logo, fonts
└── /shared
    └── /utils            # Chứa các hàm tiện ích (helper functions)
```

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu

Đảm bảo bạn đã cài đặt các phần mềm sau trên máy tính của mình:

- Node.js (phiên bản 18.x trở lên)
- Angular CLI (phiên bản 20.x trở lên)

### Cài đặt

1.  Clone repository về máy của bạn:
    ```bash
    git clone <your-repository-url>
    ```
2.  Di chuyển vào thư mục dự án:
    ```bash
    cd sso-portal
    ```
3.  Cài đặt các dependencies:
    ```bash
    npm install
    ```

### Chạy Development Server

Chạy lệnh sau để khởi động server phát triển. Ứng dụng sẽ tự động mở trên `http://localhost:4200/`.

```bash
ng serve -o
```

### Build dự án

Chạy lệnh sau để build dự án cho môi trường production. Các file build sẽ được lưu trong thư mục `dist/`.

```bash
ng build
```
