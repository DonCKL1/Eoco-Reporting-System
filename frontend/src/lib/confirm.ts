import Swal from 'sweetalert2';

export const confirmAction = (title: string, text: string, confirmText = 'Yes, proceed') =>
  Swal.fire({
    title,
    text,
    icon: 'warning',
    width: '360px',
    padding: '1.25rem',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    confirmButtonColor: 'var(--color-accent)', // accent token
    cancelButtonColor: 'var(--color-muted-foreground)',
    customClass: {
      popup: 'text-sm rounded-lg',
      title: 'text-base font-semibold',
      confirmButton: 'text-sm px-4 py-2',
      cancelButton: 'text-sm px-4 py-2',
    },
    buttonsStyling: true,
    reverseButtons: true,
  }).then((result) => result.isConfirmed);

export const alertSuccess = (title: string, text: string) =>
  Swal.fire({
    title,
    text,
    icon: 'success',
    width: '360px',
    padding: '1.25rem',
    showCancelButton: false,
    confirmButtonText: 'OK',
    confirmButtonColor: 'var(--color-primary)',
    customClass: {
      popup: 'text-sm rounded-lg',
      title: 'text-base font-semibold',
      confirmButton: 'text-sm px-4 py-2',
    },
    buttonsStyling: true,
  });

export const alertError = (title: string, text: string) =>
  Swal.fire({
    title,
    text,
    icon: 'error',
    width: '360px',
    padding: '1.25rem',
    showCancelButton: false,
    confirmButtonText: 'OK',
    confirmButtonColor: 'var(--color-destructive)',
    customClass: {
      popup: 'text-sm rounded-lg',
      title: 'text-base font-semibold',
      confirmButton: 'text-sm px-4 py-2',
    },
    buttonsStyling: true,
  });
