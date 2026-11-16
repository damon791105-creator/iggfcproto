const fs = require('node:fs');
const path = require('node:path');

const ids = ['ssc', 'klc', 'x115', 'k8', 'k3', '3d', 'pcdd', 'pk10'];
const data = Object.fromEntries(ids.map(id => {
  const groups = JSON.parse(fs.readFileSync(path.join(__dirname, `reference-mobile-${id}.json`), 'utf8'));
  return [id, groups.filter(group => group.title).map(group => ({
    title: group.title,
    tabs: group.tabs.map(tab => tab.label),
    sections: group.sections.map(section => ({
      title: section.title,
      items: section.items.map(item => ({ value: item.value, odds: item.odds, ...(item.position ? { position: item.position } : {}) })),
    })),
  }))];
}));

const variants = Object.fromEntries(['ssc', 'x115', '3d'].map(id => {
  const source = JSON.parse(fs.readFileSync(path.join(__dirname, `reference-mobile-${id}-variants.json`), 'utf8'));
  return [id, Object.fromEntries(Object.entries(source).map(([play, tabs]) => [play,
    Object.fromEntries(Object.entries(tabs).map(([tab, sections]) => [tab, sections.map(section => ({
      title: section.title,
      items: section.items.map(item => ({ value: item.value, odds: item.odds, ...(item.position ? { position: item.position } : {}) })),
    }))]))
  ]))];
}));

fs.writeFileSync(path.join(__dirname, 'reference-mobile-data.js'), `// Captured from the supplied mobile site's rendered betting boards.\nwindow.mobileSourceReference = ${JSON.stringify(data)};\nwindow.mobileSourceVariants = ${JSON.stringify(variants)};\n`);
