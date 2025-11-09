const report = require('./lighthouse-final.json');

console.log('=== TOP PERFORMANCE OPPORTUNITIES ===\n');

const opportunities = Object.entries(report.audits)
  .filter(([key, audit]) =>
    audit.details?.type === 'opportunity' &&
    audit.score !== null &&
    audit.score < 1
  )
  .map(([key, audit]) => ({
    title: audit.title,
    savings: audit.details.overallSavingsMs || 0,
    score: Math.round(audit.score * 100)
  }))
  .sort((a,b) => b.savings - a.savings)
  .slice(0, 8);

opportunities.forEach((opp, i) => {
  console.log(`${i+1}. ${opp.title}`);
  console.log(`   Savings: ${Math.round(opp.savings)}ms`);
  console.log(`   Score: ${opp.score}/100\n`);
});

// Check for redirects
console.log('\n=== REDIRECT CHECK ===');
const redirects = report.audits['redirects'];
if (redirects) {
  console.log('Redirects:', redirects.displayValue || 'None');
  if (redirects.details?.items) {
    redirects.details.items.forEach(item => {
      console.log(`  ${item.url} → ${item.wastedMs}ms wasted`);
    });
  }
}

// Check server response time
console.log('\n=== SERVER RESPONSE ===');
const serverResponse = report.audits['server-response-time'];
console.log('Server response time:', serverResponse.displayValue);
console.log('Score:', Math.round(serverResponse.score * 100) + '/100');
