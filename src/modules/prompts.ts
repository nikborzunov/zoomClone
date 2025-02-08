import Swal from "sweetalert2";
import { notify } from './notifications';

export function promptUserName(roomId: string, joinRoomCallback: (roomId: string, userName: string) => void): void {
  Swal.fire({
    title: 'Введите ваше имя',
    input: 'text',
    inputLabel: 'Имя',
    inputPlaceholder: 'Ваше имя',
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Пожалуйста, введите ваше имя!'
      }
      return null;
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const userName = result.value.trim();
      if (userName.length === 0) {
        notify('Имя не может быть пустым', 'error');
        promptUserName(roomId, joinRoomCallback);
      } else {
        joinRoomCallback(roomId, userName);
      }
    }
  });
}