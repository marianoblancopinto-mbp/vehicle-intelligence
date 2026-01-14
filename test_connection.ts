async function testConnection() {
    const configs = [
        { name: "Web Page (No Headers)", url: "https://autos.mercadolibre.com.ar/toyota-sw4", headers: {} },
        {
            name: "Web Page (Browser UA)", url: "https://autos.mercadolibre.com.ar/toyota-sw4", headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        }
    ];

    for (const cfg of configs) {
        console.log(`\n🧪 Testing Config: ${cfg.name}`);
        try {
            const res = await fetch(cfg.url, { headers: cfg.headers });
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                console.log("✅ SUCCESS!");
                const body = await res.text();
                console.log("Body len:", body.length);
                return;
            }
        } catch (e) {
            console.log("❌ Error:", e);
        }
    }
}

testConnection();
