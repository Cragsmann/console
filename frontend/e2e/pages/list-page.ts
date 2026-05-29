import type { Locator } from '@playwright/test';

import BasePage from './base-page';

export class ListPage extends BasePage {
  private readonly nameFilterInput = this.page.locator('[data-test-id="item-filter"]');
  private readonly createButton = this.page.getByTestId('item-create');
  private readonly resourceRows = this.page.locator('[data-test-rows="resource-row"]');

  async filterByName(name: string): Promise<void> {
    await this.nameFilterInput.fill(name);
  }

  async navigateTo(url: string): Promise<void> {
    await this.goTo(url);
  }

  async clickCreateButton(): Promise<void> {
    await this.robustClick(this.createButton);
  }

  async rowsShouldBeLoaded(): Promise<void> {
    await this.resourceRows.first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  getRow(resourceName: string): Locator {
    return this.resourceRows.filter({ hasText: resourceName });
  }

  async rowShouldExist(resourceName: string): Promise<Locator> {
    const row = this.resourceRows.filter({ hasText: resourceName });
    await row.first().waitFor({ state: 'visible', timeout: 30_000 });
    return row;
  }

  async rowShouldNotExist(resourceName: string): Promise<void> {
    await this.page
      .locator(`[data-test-id="${resourceName}"]`)
      .waitFor({ state: 'detached', timeout: 90_000 });
  }

  async clickRowKebabAction(resourceName: string, actionName: string): Promise<void> {
    const row = this.resourceRows.filter({ hasText: resourceName }).first();
    await row.waitFor({ state: 'visible', timeout: 30_000 });
    const kebab = row.locator('[data-test-id="kebab-button"]');
    const action = this.page.locator(`[data-test-action="${actionName}"]`);

    for (let attempt = 0; attempt < 3; attempt++) {
      await this.robustClick(kebab);
      try {
        await action.waitFor({ state: 'visible', timeout: 5_000 });
        await action.click();
        return;
      } catch {
        // Menu may have closed — retry
      }
    }
    throw new Error(`Kebab action "${actionName}" not found for row "${resourceName}"`);
  }

  async clickRowByName(resourceName: string): Promise<void> {
    const link = this.page.locator(`a[data-test-id="${resourceName}"]`);
    await this.robustClick(link);
  }
}
