# Run
```
npm install
npm run dev
```
# Solution


Paste this in console
```
function sumBTC() {
  // Select all divs with class 'particle-text'
  const particles = document.querySelectorAll('div.particle-text');
  
  let total = 0;

  particles.forEach(particle => {
    const content = particle.getAttribute('data-content');
    if (content && content.includes('BTC')) {
      const value = parseFloat(content.split(' ')[0]);
      if (!isNaN(value)) {
        total += value;
      }
    }
  });

  return total.toFixed(2);
}

const result = sumBTC();
console.log(`Total BTC: ${result}`);
```
