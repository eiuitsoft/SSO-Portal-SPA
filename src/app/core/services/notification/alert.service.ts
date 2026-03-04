import { Injectable, Injector } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private injector: Injector) {}

  success(title?: string, text?: string, timer: number = 3000) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
    });
  }

  successNoProcess(title?: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      showConfirmButton: false,
      timer: 5000,
    });
  }

  error(title?: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      // showConfirmButton: false
    });
  }

  warning(title?: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      // showConfirmButton: false
    });
  }

  confirm(title: string, text: string, okCallback: () => any) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
    }).then((result: any) => {
      if (result.value) {
        okCallback();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  confirmCallback(title: string, text: string, okCallback: () => any, cancelCallback?: () => any) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Thoát!',
    }).then((result: any) => {
      if (result.value) {
        okCallback();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (cancelCallback) {
          cancelCallback();
        }
      }
    });
  }

  async textArea(title: string, placeholder: string, okCallback: (res: any) => any) {
    const { value: text, isConfirmed: clickOk } = await Swal.fire({
      input: 'textarea',
      inputLabel: title,
      inputPlaceholder: placeholder,
      inputAttributes: {
        'aria-label': 'Type your message here',
      },
      showCancelButton: true,
    });
    if (clickOk) {
    }
    if (text) {
      okCallback(text);
    }
  }

  confirmCssTwoButton(title: string, text: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-3',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    const abt = swalWithBootstrapButtons
      .fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Thoát!',
        reverseButtons: true,
      })
      .then((result: any) => {
        return result.isConfirmed;
      });
    return abt;
  }

  //Mixi

  successMin(title: string) {
    const toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });
    toast.fire({
      icon: 'success',
      title: title,
    });
  }

  successBase(title?: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
    });
  }
}
