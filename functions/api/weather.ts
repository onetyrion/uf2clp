export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const latParam = url.searchParams.get("lat");
  const lonParam = url.searchParams.get("lon");

  if (!latParam || !lonParam) {
    return new Response(JSON.stringify({ error: "Missing lat or lon parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const lat = Number(latParam);
  const lon = Number(lonParam);

  if (isNaN(lat) || isNaN(lon)) {
      return new Response(JSON.stringify({ error: "Invalid lat or lon parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
  }

  // Redondear a 2 decimales para agrupar solicitudes cercanas de la misma área (~1.1km)
  // Esto aumenta considerablemente los aciertos de caché.
  const roundedLat = lat.toFixed(2);
  const roundedLon = lon.toFixed(2);
  const cacheKey = `weather_${roundedLat}_${roundedLon}`;
  const ttl = 1800; // 30 minutos de caché para el clima
  
  // 1. Intentar obtener de KV CACHE
  if (env.kv_uf2clp) {
    try {
      const cachedData = await env.kv_uf2clp.get(cacheKey, "json");
      if (cachedData) {
        return new Response(JSON.stringify(cachedData), {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-Cache": "HIT"
          }
        });
      }
    } catch (e) {
        console.error("Error leyendo clima desde KV Cache:", e);
    }
  }

  // Obtain the API key from the environment variables (Cloudflare Pages secrets)
  // Fallback to PUBLIC_WEATHER_API_KEY for local dev if bound
  const apiKey = env.WEATHER_API_KEY || env.PUBLIC_WEATHER_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Weather API Key is missing on the server." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
    });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

  // 2. Fetch a la API de OpenWeatherMap si no hay caché
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch weather data" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();

    // 3. Guardar en KV CACHE
    if (env.kv_uf2clp) {
        try {
          await env.kv_uf2clp.put(cacheKey, JSON.stringify(data), { expirationTtl: ttl });
        } catch (e) {
          console.error("Error escribiendo clima en KV Cache:", e);
        }
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Cache": "MISS"
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
