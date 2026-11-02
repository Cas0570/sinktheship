import { expect, test } from '@playwright/test';

const copy = {
  en: {
    title: 'Browser test fixture',
    next: 'Next step',
    reset: 'Reset fixture',
  },
  nl: {
    title: 'Browsertestfixture',
    next: 'Volgende stap',
    reset: 'Fixture herstellen',
  },
};

test('scripted fixture supports keyboard, completion, reset and fresh navigation', async ({
  page,
}, testInfo) => {
  const locale = testInfo.project.use.locale as keyof typeof copy;
  const text = copy[locale];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`/${locale}`);
  await expect(page.getByRole('heading', { name: text.title })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('ready');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: text.next })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('advanced');
  await page.getByRole('button', { name: text.next }).click();
  await expect(page.getByRole('status')).toHaveText('complete');
  await expect(page.getByRole('button', { name: text.next })).toBeDisabled();
  await page.getByRole('button', { name: text.reset }).click();
  await expect(page.getByRole('status')).toHaveText('ready');
  await page.getByRole('button', { name: text.next }).click();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('ready');
  expect(errors).toEqual([]);
});

test('production ignores test input and exposes no fixture controls', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:4173/?testseed=123');
  await expect(page).toHaveTitle('SinkTheShip');
  await expect(page.getByRole('button')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('STS_TEST_ONLY_');
  expect(
    await page.evaluate(() =>
      Object.keys(window).filter((key) => /fixture|testseed|__test/i.test(key)),
    ),
  ).toEqual([]);
});
