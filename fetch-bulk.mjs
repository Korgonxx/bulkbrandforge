import https from 'https';

https.get('https://www.bulk.trade/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const links = data.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g);
    const styles = data.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
    console.log('Links:', links);
    console.log('Styles:', styles ? styles[0].substring(0, 500) : 'none');
    
    // Also look for font families and colors
    const colors = data.match(/#[0-9a-fA-F]{3,6}/g);
    if (colors) {
      const uniqueColors = [...new Set(colors)];
      console.log('Colors:', uniqueColors);
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});