import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#00ed64',
        color: '#001e2b',
        borderRadius: '8px',
        padding: '12px 24px',
        fontWeight: 500,
      },
      iconTheme: {
        primary: '#001e2b',
        secondary: '#00ed64',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '12px 24px',
        fontWeight: 500,
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#ef4444',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#001e2b',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '12px 24px',
        fontWeight: 500,
      },
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
}; 