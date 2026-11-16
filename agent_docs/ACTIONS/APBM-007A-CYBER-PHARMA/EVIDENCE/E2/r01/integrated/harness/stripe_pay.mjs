// Fill Stripe's hosted Checkout page with a sandbox test card. Test card numbers are public Stripe fixtures.
export async function payOnStripe(page, card = '4242424242424242', shot) {
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  const card$ = page.locator('#cardNumber');
  if (!(await card$.isVisible().catch(() => false))) {
    // The accordion button is visually covered by its own label; click the label's position with the mouse.
    const box = await page.locator('#payment-method-label-card').boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1500);
    if (!(await card$.isVisible().catch(() => false))) { await page.locator('[data-testid="card-accordion-item-button"]').focus(); await page.keyboard.press('Enter'); }
  }
  await card$.waitFor({ timeout: 30000 });
  await card$.fill(card);
  await page.locator('#cardExpiry').fill('12 / 34');
  await page.locator('#cardCvc').fill('123');
  const name = page.locator('#billingName'); if (await name.isVisible().catch(() => false)) await name.fill('Synthetic Owner');
  const country = page.locator('#billingCountry'); if (await country.isVisible().catch(() => false)) await country.selectOption('US').catch(() => {});
  const zip = page.locator('#billingPostalCode'); await zip.waitFor({ timeout: 5000 }).catch(() => {}); if (await zip.isVisible().catch(() => false)) await zip.fill('35004');
  const usd = await page.getByText(/^BDT|^[A-Z]{3} [0-9]/).count(); if (usd) console.log('note: a non-USD amount is visible on the Stripe page');
  const link = page.locator('#enableStripePass, input[name="enableStripePass"]'); if (await link.isChecked().catch(() => false)) await link.uncheck().catch(() => {});
  if (shot) await page.screenshot({ path: shot, fullPage: true });
  await page.locator('[data-testid="hosted-payment-submit-button"], button.SubmitButton').first().click();
}
