/**
 * Playwright Script: Google Analytics Setup Automation
 *
 * This script will:
 * 1. Open Google Analytics in your logged-in Chrome browser
 * 2. Help you create a property for aifastscale.com
 * 3. Extract the Measurement ID automatically
 * 4. Save it to .env.local
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function setupGoogleAnalytics() {
  console.log('🚀 Starting Google Analytics Setup Automation...\n');

  // Launch browser with your Chrome profile (so you're already logged in)
  console.log('📂 Opening Chrome with your profile...');
  const userDataDir = '/Users/a1111/Library/Application Support/Google/Chrome';

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'chrome',
  });

  const page = await browser.newPage();

  try {
    // Step 1: Navigate to Google Analytics
    console.log('🌐 Navigating to Google Analytics...');
    await page.goto('https://analytics.google.com/');
    await page.waitForTimeout(3000);

    console.log('\n⏸️  PAUSED - Please do the following:\n');
    console.log('1. If not logged in, log in to your Google account');
    console.log('2. Click "Start measuring" or "Create Property"');
    console.log('3. Enter property name: "AI FastScale"');
    console.log('4. Set timezone and currency');
    console.log('5. Continue through the setup wizard');
    console.log('6. Select "Web" as the platform');
    console.log('7. Enter website URL: https://aifastscale.com');
    console.log('8. Enter stream name: "AI FastScale Website"');
    console.log('9. Click "Create stream"\n');
    console.log('Once you see the Measurement ID (G-XXXXXXXXXX), press ENTER here in the terminal...\n');

    // Wait for user to press Enter
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    // Step 2: Try to extract the Measurement ID
    console.log('🔍 Looking for Measurement ID...\n');

    // Look for the Measurement ID on the page
    const measurementId = await page.evaluate(() => {
      // Try to find the measurement ID in various places
      const text = document.body.innerText;
      const match = text.match(/G-[A-Z0-9]{10}/);
      return match ? match[0] : null;
    });

    if (measurementId) {
      console.log(`✅ Found Measurement ID: ${measurementId}\n`);

      // Save to .env.local
      const envPath = path.join(__dirname, '..', '.env.local');
      const envContent = `NEXT_PUBLIC_GA_MEASUREMENT_ID=${measurementId}\n`;
      fs.writeFileSync(envPath, envContent);

      console.log(`✅ Saved to .env.local\n`);
      console.log('🎉 Google Analytics setup complete!\n');
      console.log('Next: I\'ll deploy this to Vercel...\n');

      return measurementId;
    } else {
      console.log('❌ Could not automatically find the Measurement ID.');
      console.log('Please copy it manually from the screen and paste it here:');

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      return new Promise(resolve => {
        readline.question('Measurement ID: ', (id) => {
          readline.close();

          if (id && id.startsWith('G-')) {
            const envPath = path.join(__dirname, '..', '.env.local');
            const envContent = `NEXT_PUBLIC_GA_MEASUREMENT_ID=${id}\n`;
            fs.writeFileSync(envPath, envContent);
            console.log(`\n✅ Saved ${id} to .env.local\n`);
            resolve(id);
          } else {
            console.log('\n❌ Invalid Measurement ID format. Should start with G-');
            process.exit(1);
          }
        });
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

setupGoogleAnalytics()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
