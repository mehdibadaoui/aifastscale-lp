/**
 * Google Analytics Setup - Playwright Automation
 * This script will guide you through setting up Google Analytics
 * and automatically extract the Measurement ID
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function logStep(step, message) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`STEP ${step}: ${message}`);
  console.log('='.repeat(60));
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logWaiting(message) {
  console.log(`⏳ ${message}`);
}

async function saveMeasurementID(measurementId) {
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = `NEXT_PUBLIC_GA_MEASUREMENT_ID=${measurementId}\n`;

  fs.writeFileSync(envPath, envContent);
  logSuccess(`Measurement ID saved to .env.local`);
}

async function run() {
  console.log('\n🚀 GOOGLE ANALYTICS SETUP - AUTOMATED\n');
  console.log('This script will:');
  console.log('1. Open Google Analytics in a browser');
  console.log('2. Guide you through creating a property');
  console.log('3. Automatically extract the Measurement ID');
  console.log('4. Save it to your project\n');

  await ask('Press ENTER to start...');

  logStep(1, 'Launching browser...');
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: null
  });
  const page = await context.newPage();

  try {
    logStep(2, 'Opening Google Analytics...');
    await page.goto('https://analytics.google.com/');
    await page.waitForTimeout(2000);

    logWaiting('Waiting for you to LOG IN to your Google account...');
    console.log('\n📌 ACTION REQUIRED:');
    console.log('   → Log in to your Google account in the browser window\n');

    await ask('Press ENTER after you have logged in...');

    logStep(3, 'Navigating to Admin section...');

    // Try to find and click Admin button
    try {
      const adminButton = page.locator('text=/Admin|Settings/i').first();
      if (await adminButton.isVisible({ timeout: 5000 })) {
        await adminButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (e) {
      logInfo('Could not find Admin button automatically. Please navigate manually.');
    }

    console.log('\n📌 ACTION REQUIRED:');
    console.log('   → Click on "Create Property" button');
    console.log('   → Property name: "AI Fast Scale"');
    console.log('   → Select your timezone and currency');
    console.log('   → Click "Next"');
    console.log('   → Select business info (can skip)');
    console.log('   → Click "Create"');
    console.log('   → Accept terms if prompted\n');

    await ask('Press ENTER after creating the property...');

    logStep(4, 'Setting up Data Stream...');

    console.log('\n📌 ACTION REQUIRED:');
    console.log('   → Click "Web" platform');
    console.log('   → Website URL: https://www.aifastscale.com');
    console.log('   → Stream name: AI Fast Scale Website');
    console.log('   → Click "Create stream"\n');

    await ask('Press ENTER after creating the data stream...');

    logStep(5, 'Extracting Measurement ID...');

    await page.waitForTimeout(2000);

    // Try multiple methods to extract the Measurement ID
    let measurementId = null;

    // Method 1: Look for G- ID in page content
    const pageContent = await page.content();
    const gIdMatch = pageContent.match(/G-[A-Z0-9]{10}/);
    if (gIdMatch) {
      measurementId = gIdMatch[0];
      logSuccess(`Found Measurement ID: ${measurementId}`);
    }

    // Method 2: Look in specific elements
    if (!measurementId) {
      try {
        const idElement = await page.locator('text=/G-[A-Z0-9]{10}/').first();
        if (await idElement.isVisible({ timeout: 5000 })) {
          const text = await idElement.textContent();
          const match = text.match(/G-[A-Z0-9]{10}/);
          if (match) {
            measurementId = match[0];
            logSuccess(`Found Measurement ID: ${measurementId}`);
          }
        }
      } catch (e) {
        // Continue to manual method
      }
    }

    // Method 3: Manual input
    if (!measurementId) {
      console.log('\n📌 Could not automatically detect Measurement ID.');
      console.log('   Please look for it on the page (looks like: G-XXXXXXXXXX)\n');

      measurementId = await ask('Paste your Measurement ID here: ');
      measurementId = measurementId.trim();
    }

    if (measurementId && measurementId.match(/G-[A-Z0-9]{10}/)) {
      logStep(6, 'Saving Measurement ID...');
      await saveMeasurementID(measurementId);

      console.log('\n' + '='.repeat(60));
      console.log('🎉 SUCCESS! Google Analytics is configured!');
      console.log('='.repeat(60));
      console.log(`\nMeasurement ID: ${measurementId}`);
      console.log(`Saved to: .env.local`);
      console.log('\nNext steps:');
      console.log('1. I will now configure your Next.js app');
      console.log('2. Deploy to production');
      console.log('3. Start tracking visitors!\n');
    } else {
      console.log('\n❌ Invalid Measurement ID format. Please run the script again.');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await ask('\nPress ENTER to close the browser...');
    await browser.close();
    rl.close();
  }
}

run().catch(console.error);
