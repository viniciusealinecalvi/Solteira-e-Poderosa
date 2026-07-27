const { chromium, devices } = require('playwright');
(async () => {
  const iPhone = devices['iPhone 12'];
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...iPhone, locale: 'pt-BR' });
  const page = await context.newPage();
  await page.goto('file://' + __dirname + '/index.html');
  const ua = await page.evaluate(() => navigator.userAgent);
  console.log('UA:', ua);
  const selectors = ['.hero', '.hero-grid', '.hero-image', '.hero-image img', '.timer-num'];
  for (const sel of selectors) {
    const info = await page.evaluate(s => {
      const el = document.querySelector(s);
      if (!el) return { selector: s, exists: false };
      const cs = getComputedStyle(el);
      return {
        selector: s,
        exists: true,
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
        css: cs.cssText.split('; ').filter(Boolean).slice(0,20).join('; ')
      };
    }, sel);
    console.log(JSON.stringify(info, null, 2));
  }
  await page.screenshot({ path: '/tmp/iphone-hero.png', fullPage: true });
  console.log('screenshot saved to /tmp/iphone-hero.png');
  await browser.close();
})();
