// utils/deleteAlert.ts
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface DeleteAlertProps {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export const showDeleteAlert = ({
  title = 'Are you sure?',
  text = "You won't be able to revert this!",
  confirmText = 'Yes, delete it!',
  cancelText = 'Cancel',
  onConfirm,
}: DeleteAlertProps) => {
  MySwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      MySwal.fire('Deleted!', 'Your item has been deleted.', 'success');
    }
  });
};
