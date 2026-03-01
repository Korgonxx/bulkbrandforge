import https from 'https';

https.get('https://www.bulk.trade/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const styles = data.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
    if (styles) {
      styles.forEach(s => {
        if (s.includes('background')) {
          const bgMatches = s.match(/background(?:-color)?:\s*([^;]+);/g);
          if (bgMatches) {
            console.log(bgMatches.slice(0, 10));
          }
        }
      });
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});