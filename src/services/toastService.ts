import { toastController } from '@ionic/vue';

type ToastPositions = 'top' | 'bottom' | 'middle';

interface ToastOptions {
    message: string;
    duration?: number;
    position?: ToastPositions;
    color?: string;
    showCloseButton?: boolean;
    closeButtonText?: string;
    cssClass?: string | string[];
}

class ToastService {
    /**
     * Show a toast with custom options.
     */
    async showToast({
        message,
        duration = 2000,
        position = 'bottom',
        color = 'primary',
        showCloseButton = true,
        closeButtonText = 'Close',
        cssClass,
    }: ToastOptions) {
        const toast = await toastController.create({
            message,
            duration,
            position,
            color,
            buttons: showCloseButton
                ? [{ text: closeButtonText, role: 'cancel' }]
                : [],
            cssClass,
        });

        await toast.present();
        return toast;
    }

    /**
     * Show success message toast.
     */
    successMessage(
        message: string = 'Success!',
        duration = 2000,
        position: ToastPositions = 'bottom',
    ) {
        return this.showToast({
            message,
            duration,
            color: 'success',
            position,
        });
    }

    /**
     * Show danger message toast.
     */
    dangerMessage(
        message: string = 'An error occurred',
        duration = 3000,
        position: ToastPositions = 'bottom',
    ) {
        return this.showToast({
            message,
            duration,
            color: 'danger',
            position,
        });
    }

    /**
     * Show warning message toast.
     */
    warningMessage(
        message: string = 'Warning!',
        duration = 2500,
        position: ToastPositions = 'bottom',
    ) {
        return this.showToast({
            message,
            duration,
            color: 'warning',
            position,
        });
    }

    /**
     * Show informational message toast.
     */
    informationMessage(
        message: string = 'Information!',
        duration = 2000,
        position: ToastPositions = 'bottom',
    ) {
        return this.showToast({
            message,
            duration,
            color: 'tertiary',
            position,
        });
    }
}

export const toastService = new ToastService();
