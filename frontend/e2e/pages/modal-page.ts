import BasePage from './base-page';

export class ModalPage extends BasePage {
  private readonly cancelButton = this.page.locator('[data-test-id="modal-cancel-action"]');
  private readonly submitButton = this.page.locator('button[type=submit]');

  async shouldBeOpened(): Promise<void> {
    await this.cancelButton.waitFor({ state: 'visible', timeout: 20_000 });
  }

  async shouldBeClosed(): Promise<void> {
    await this.cancelButton.waitFor({ state: 'detached', timeout: 30_000 });
  }

  async submit(): Promise<void> {
    await this.robustClick(this.submitButton);
  }

  async submitShouldBeEnabled(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible', timeout: 10_000 });
  }

  async cancel(): Promise<void> {
    await this.robustClick(this.cancelButton);
  }
}
