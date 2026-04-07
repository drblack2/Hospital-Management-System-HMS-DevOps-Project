import toast, { Toaster } from 'react-hot-toast';
import './Toast.css';

export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 3000,
    position: 'top-right',
  });
};

export const showInfoToast = (message) => {
  toast((t) => (
    <div className="toast-info">
      <span>{message}</span>
    </div>
  ), {
    duration: 3000,
    position: 'top-right',
  });
};

export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const updateToast = (toastId, type, message) => {
  toast.dismiss(toastId);
  if (type === 'success') {
    showSuccessToast(message);
  } else if (type === 'error') {
    showErrorToast(message);
  } else {
    showInfoToast(message);
  }
};

export { Toaster };
