import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  // Go to Udyam Registration page
  await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', {
    waitUntil: 'domcontentloaded'
  });

  // Function to extract elements and validation info
  const getUIElements = async () => {
    return await page.evaluate(() => {
      const elements = [];

      const getLabel = (el) => {
        if (el.id) {
          const labelEl = document.querySelector(`label[for="${el.id}"]`);
          if (labelEl) return labelEl.innerText.trim();
        }
        // Try parent label (wrapped input)
        if (el.closest('label')) {
          return el.closest('label').innerText.trim();
        }
        return '';
      };

      const processElement = (el) => {
        const tag = el.tagName.toLowerCase();
        const type = el.type || '';
        const label = getLabel(el);
        const placeholder = el.getAttribute('placeholder') || '';
        const name = el.getAttribute('name') || '';
        const id = el.id || '';
        const classes = el.className || '';
        const text = tag === 'button' || type === 'submit' ? (el.innerText.trim() || el.value || '') : '';
        const pattern = el.getAttribute('pattern') || '';
        const maxlength = el.getAttribute('maxlength') || '';
        const required = el.hasAttribute('required') ? true : false;

        let options = [];
        if (tag === 'select') {
          options = Array.from(el.options).map(o => o.text.trim());
        }

        elements.push({
          tag,
          type,
          label,
          placeholder,
          name,
          id,
          classes,
          text,
          pattern,
          maxlength,
          required,
          options
        });
      };

      // Inputs
      document.querySelectorAll('input').forEach(processElement);

      // Selects
      document.querySelectorAll('select').forEach(processElement);

      // Textareas
      document.querySelectorAll('textarea').forEach(processElement);

      // Buttons
      document.querySelectorAll('button, input[type="submit"]').forEach(processElement);

      return elements;
    });
  };

  // Wait for form to load
  await page.waitForSelector('form');

  console.log('Extracting Step 1 elements...');
  const step1Elements = await getUIElements();

  // Create scraped directory if it doesn't exist
  const scrapedDir = path.join(__dirname, 'scraped');
  if (!fs.existsSync(scrapedDir)) {
    fs.mkdirSync(scrapedDir, { recursive: true });
  }

  // Save as JSON only
  const jsonPath = path.join(scrapedDir, 'udyam_ui_elements_step1.json');
  fs.writeFileSync(jsonPath, JSON.stringify(step1Elements, null, 2));

  console.log(`✅ Data saved as JSON: ${jsonPath}`);

  // --- OPTIONAL: Proceed to Step 2 after OTP ---
  // You can manually complete OTP on the browser,
  // then run the below code to capture Step 2 fields.

  /*
  console.log('Waiting for Step 2...');
  await page.waitForTimeout(20000); // give time for OTP entry & step transition
  const step2Elements = await getUIElements();
  fs.writeFileSync(path.join(scrapedDir, 'udyam_ui_elements_step2.json'), JSON.stringify(step2Elements, null, 2));
  */

  await browser.close();
})();
