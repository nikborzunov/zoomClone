import Swal from "sweetalert2";
import { notify } from './notifications';

export function promptUserName(roomId: string, joinRoomCallback: (roomId: string, userName: string) => void): void {
  Swal.fire({
    title: 'Enter your name',
    input: 'text',
    inputLabel: 'Name',
    inputPlaceholder: 'Your name',
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Please enter your name!';
      }
      return null;
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const userName = result.value.trim();
      if (userName.length === 0) {
        notify('Name cannot be empty', 'error');
        promptUserName(roomId, joinRoomCallback);
      } else {
        joinRoomCallback(roomId, userName);
      }
    }
  });
}