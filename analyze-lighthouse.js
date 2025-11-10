const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('/tmp/lighthouse-report.json', 'utf-8'));

  console.log('=== LIGHTHOUSE SCORES ===');
  console.log('Performance:', Math.round(data.categories.performance.score * 100));
  console.log('Accessibility:', Math.round(data.categories.accessibility.score * 100));
  console.log('Best Practices:', Math.round(data.categories['best-practices'].score * 100));
  console.log('SEO:', Math.round(data.categories.seo.score * 100));

  console.log('\n=== CORE WEB VITALS ===');
  const audits = data.audits;
  console.log('LCP (Largest Contentful Paint):', audits['largest-contentful-paint'].displayValue);
  console.log('TBT (Total Blocking Time):', audits['total-blocking-time'].displayValue);
  console.log('CLS (Cumulative Layout Shift):', audits['cumulative-layout-shift'].displayValue);
  console.log('FCP (First Contentful Paint):', audits['first-contentful-paint'].displayValue);
  console.log('Speed Index:', audits['speed-index'].displayValue);

  console.log('\n=== OPPORTUNITIES (Biggest Wins) ===');
  const opportunities = Object.values(audits)
    .filter(a => a.details && a.details.type === 'opportunity' && a.numericValue > 0)
    .sort((a, b) => b.numericValue - a.numericValue)
    .slice(0, 5);

  opportunities.forEach(opp => {
    console.log(\`- \${opp.title}: \${Math.round(opp.numericValue / 1000 * 10) / 10}s savings\`);
  });

  console.log('\n=== FAILING AUDITS ===');
  const failing = Object.values(audits)
    .filter(a => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'notApplicable')
    .slice(0, 10);

  failing.forEach(f => {
    console.log(\`- \${f.title} (score: \${Math.round(f.score * 100)}%)\`);
  });

} catch (err) {
  console.error('Error:', err.message);
}
