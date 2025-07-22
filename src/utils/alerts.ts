// utils/alerts.ts
import Swal from 'sweetalert2';

export const successAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#001D01',
  });
};

export const errorAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#d33',
  });
};
