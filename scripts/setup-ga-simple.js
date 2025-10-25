/**
 * Simple Google Analytics Setup
 * Just collects the Measurement ID and saves it
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('\n🎯 Google Analytics Setup\n');
console.log('═══════════════════════════════════════\n');

// Open Google Analytics in the default browser
console.log('📂 Opening Google Analytics in your browser...\n');
exec('open https://analytics.google.com/');

console.log('Please follow these steps in your browser:\n');
console.log('1. Log in to Google Analytics (if not already logged in)');
console.log('2. Click "Admin" (gear icon) in the bottom left');
console.log('3. Click "+ Create Property"');
console.log('4. Property name: "AI FastScale"');
console.log('5. Click "Next" → Select your business details → Click "Next"');
console.log('6. Click "Create" → Accept terms');
console.log('7. Choose platform: "Web"');
console.log('8. Website URL: https://aifastscale.com');
console.log('9. Stream name: "AI FastScale Website"');
console.log('10. Click "Create stream"\n');
console.log('═══════════════════════════════════════\n');
console.log('You will see a Measurement ID like: G-XXXXXXXXXX\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Paste your Measurement ID here: ', (id) => {
  readline.close();

  const trimmedId = id.trim();

  if (trimmedId && trimmedId.match(/^G-[A-Z0-9]{10}$/)) {
    // Save to .env.local
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = `NEXT_PUBLIC_GA_MEASUREMENT_ID=${trimmedId}\n`;
    fs.writeFileSync(envPath, envContent);

    console.log(`\n✅ Success! Saved ${trimmedId} to .env.local\n`);
    console.log('🚀 Next step: Deploying to Vercel with Google Analytics...\n');
    process.exit(0);
  } else {
    console.log('\n❌ Invalid Measurement ID format.');
    console.log('It should look like: G-XXXXXXXXXX (G- followed by 10 characters)\n');
    process.exit(1);
  }
});
