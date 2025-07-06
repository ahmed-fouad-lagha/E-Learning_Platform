#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎨 Favicon Customizer - E-Learning Platform');
console.log('='.repeat(50));
console.log('');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function customizeFavicon() {
  console.log('What would you like to change?');
  console.log('1. Background colors (blue gradient)');
  console.log('2. Book colors (golden gradient)');
  console.log('3. Graduation cap color (green)');
  console.log('4. Create completely new design');
  console.log('5. Use a simple letter/initial design');
  console.log('');
  
  const choice = await askQuestion('Enter your choice (1-5): ');
  
  switch(choice) {
    case '1':
      await changeBackgroundColors();
      break;
    case '2':
      await changeBookColors();
      break;
    case '3':
      await changeCapColor();
      break;
    case '4':
      await createNewDesign();
      break;
    case '5':
      await createLetterDesign();
      break;
    default:
      console.log('Invalid choice. Exiting...');
  }
  
  rl.close();
}

async function changeBackgroundColors() {
  console.log('');
  console.log('🎨 Current background: Blue gradient (#3b82f6 → #1d4ed8)');
  console.log('');
  console.log('Popular color schemes:');
  console.log('1. Green Education (#10b981 → #059669)');
  console.log('2. Purple Modern (#8b5cf6 → #7c3aed)');
  console.log('3. Orange Vibrant (#f59e0b → #d97706)');
  console.log('4. Red Dynamic (#ef4444 → #dc2626)');
  console.log('5. Custom colors');
  
  const colorChoice = await askQuestion('Choose color scheme (1-5): ');
  
  let colors = {};
  switch(colorChoice) {
    case '1':
      colors = { start: '#10b981', end: '#059669' };
      break;
    case '2':
      colors = { start: '#8b5cf6', end: '#7c3aed' };
      break;
    case '3':
      colors = { start: '#f59e0b', end: '#d97706' };
      break;
    case '4':
      colors = { start: '#ef4444', end: '#dc2626' };
      break;
    case '5':
      colors.start = await askQuestion('Enter start color (hex, e.g., #3b82f6): ');
      colors.end = await askQuestion('Enter end color (hex, e.g., #1d4ed8): ');
      break;
  }
  
  if (colors.start && colors.end) {
    updateFaviconColors('bg-gradient', colors.start, colors.end);
    console.log(`✅ Background updated to ${colors.start} → ${colors.end}`);
  }
}

async function changeBookColors() {
  console.log('');
  console.log('📚 Current book: Golden gradient (#fbbf24 → #f59e0b)');
  const startColor = await askQuestion('Enter new start color (hex): ');
  const endColor = await askQuestion('Enter new end color (hex): ');
  
  updateFaviconColors('book-gradient', startColor, endColor);
  console.log(`✅ Book colors updated to ${startColor} → ${endColor}`);
}

async function changeCapColor() {
  console.log('');
  console.log('🎓 Current cap: Green (#10b981)');
  const newColor = await askQuestion('Enter new color (hex): ');
  
  let favicon = fs.readFileSync('./public/favicon.svg', 'utf8');
  favicon = favicon.replace(/fill="#10b981"/g, `fill="${newColor}"`);
  fs.writeFileSync('./public/favicon.svg', favicon);
  
  console.log(`✅ Graduation cap updated to ${newColor}`);
}

async function createNewDesign() {
  console.log('');
  console.log('🆕 Create New Design Options:');
  console.log('1. Simple circle with letter');
  console.log('2. Geometric pattern');
  console.log('3. Education symbol (different)');
  
  const designChoice = await askQuestion('Choose design type (1-3): ');
  
  if (designChoice === '1') {
    await createLetterDesign();
  } else {
    console.log('💡 For complex designs, consider:');
    console.log('   • Using Figma or Canva to design');
    console.log('   • Converting to SVG');
    console.log('   • Replacing the entire favicon.svg content');
  }
}

async function createLetterDesign() {
  console.log('');
  const letter = await askQuestion('Enter letter/initial (e.g., E for EduDZ): ');
  const bgColor = await askQuestion('Background color (hex, e.g., #3b82f6): ');
  const textColor = await askQuestion('Text color (hex, e.g., #ffffff): ');
  
  const letterFavicon = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="${bgColor}"/>
  <text x="16" y="20" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="${textColor}">${letter.toUpperCase()}</text>
</svg>`;

  fs.writeFileSync('./public/favicon.svg', letterFavicon);
  console.log(`✅ Created letter favicon: ${letter.toUpperCase()}`);
}

function updateFaviconColors(gradientId, startColor, endColor) {
  let favicon = fs.readFileSync('./public/favicon.svg', 'utf8');
  
  const gradientRegex = new RegExp(
    `(<linearGradient id="${gradientId}"[^>]*>)[^<]*(<stop offset="0%"[^>]*stop-color:)[^;]*(;[^>]*>)[^<]*(<stop offset="100%"[^>]*stop-color:)[^;]*(;[^>]*>)`,
    'g'
  );
  
  favicon = favicon.replace(gradientRegex, 
    `$1$2${startColor}$3$4${endColor}$5`
  );
  
  fs.writeFileSync('./public/favicon.svg', favicon);
}

async function regenerateAllSizes() {
  console.log('');
  console.log('🔄 Regenerating all favicon sizes...');
  
  try {
    const { exec } = require('child_process');
    exec('npm run utils:generate-favicons', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Error regenerating favicons. Run manually:');
        console.log('   npm run utils:generate-favicons');
      } else {
        console.log('✅ All favicon sizes regenerated!');
      }
    });
  } catch (e) {
    console.log('🔄 Regenerate all sizes by running:');
    console.log('   npm run utils:generate-favicons');
  }
}

// Start the customizer
customizeFavicon().then(() => {
  console.log('');
  console.log('🚀 Next steps:');
  console.log('1. Regenerate all sizes: npm run utils:generate-favicons');
  console.log('2. Test in browser: npm run dev');
  console.log('3. Commit changes: git add . && git commit -m "update favicon"');
  console.log('');
}).catch(console.error);
