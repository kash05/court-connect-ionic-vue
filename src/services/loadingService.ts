import { loadingController } from '@ionic/vue';

class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  /**
   * Show a loading spinner with a custom message.
   */
  async show(message: string = 'Please wait...'): Promise<void> {
    if (this.loading) return;

    this.loading = await loadingController.create({
      message,
      spinner: 'crescent',
      backdropDismiss: false,
    });

    await this.loading.present();
  }

  /**
   * Hide the loading spinner if it's currently showing.
   */
  async hide(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  /**
   * Wrap any async function with a loading indicator.
   * It will automatically show and hide the loader.
   */
  async withLoading<T>(fn: () => Promise<T>, message: string = 'Please wait...'): Promise<T> {
    await this.show(message);
    try {
      return await fn();
    } finally {
      await this.hide();
    }
  }
}

export const loadingService = new LoadingService();
