import { debounce } from 'lodash';
import Swal from "sweetalert2";

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

const debouncedNotify = debounce((message: string, type: NotificationType = 'info') => {
  Swal.fire({
    toast: true,
    position: 'top-right',
    icon: type === 'error' ? 'error' : (type === 'warning' ? 'warning' : (type === 'success' ? 'success' : 'info')),
    title: message,
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    background: '#333333',
    color: '#FFFFFF',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}, 3000, { leading: true, trailing: true });

export function notify(message: string, type: NotificationType = 'info'): void {
  debouncedNotify(message, type);
}