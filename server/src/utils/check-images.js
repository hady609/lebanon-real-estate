const urls = [
  '1564013799919-ab600027ffc6','1600596542815-ffad4c1539a9','1600607687939-ce8a2c2516c1','1600573472550-8090b5e0745e','1600585154340-be6161a56a0c',
  '1600595954664-2e0d8f6a6a8c','1600573472550-8090b5e0745e','1600607687939-ce8a2c2516c1','1600585153490-3b2e5b7c9d8f','1600566753376-12c8ab7d5a7b',
  '1600046751808-6e5e1a5b7a5c','1564013799919-ab600027ffc6','1600585154340-be6161a56a0c','1600596542815-ffad4c1539a9','1600585154086-4e5b3c2d1a0f',
  '1600585153490-3b2e5b7c9d8f','1600573472550-8090b5e0745e','1600607687939-ce8a2c2516c1','1600595954664-2e0d8f6a6a8c','1600566753376-12c8ab7d5a7b'
];

const fetch = async (url) => {
  try {
    const r = await fetch(`https://images.unsplash.com/photo-${url}?w=200`, { method: 'HEAD' });
    return { id: url, ok: r.ok, status: r.status };
  } catch { return { id: url, ok: false, status: 0 }; }
};

const results = await Promise.all(urls.map(fetch));
results.forEach(r => console.log(`${r.ok ? 'OK' : 'FAIL'} ${r.status} - ${r.id}`));
