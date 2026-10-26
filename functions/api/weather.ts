const WEATHER_CACHE = "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600";

function json(data: unknown, status: number, cacheControl: string, cacheStatus?: "HIT" | "MISS") {
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": cacheControl,
  };

  if (cacheStatus) {
    headers["X-Cache"] = cacheStatus;
  }

  return new Response(JSON.stringify(data), { status, headers });
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405, "no-store");
  }

  const url = new URL(request.url);
  const latParam = url.searchParams.get("lat");
  const lonParam = url.searchParams.get("lon");

  if (!latParam || !lonParam) {
    return json({ error: "Missing lat or lon parameters" }, 400, "no-store");
  }

  const lat = Number(latParam);
  const lon = Number(lonParam);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return json({ error: "Invalid lat or lon parameters" }, 400, "no-store");
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
        return json(cachedData, 200, WEATHER_CACHE, "HIT");
      }
    } catch (e) {
      console.error("Error leyendo clima desde KV Cache:", e);
    }
  }

  // La API key vive solo en el servidor (Cloudflare Pages secrets).
  const apiKey = env.WEATHER_API_KEY;

  if (!apiKey) {
    return json({ error: "Weather API Key is missing on the server." }, 500, "no-store");
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

  // 2. Fetch a la API de OpenWeatherMap si no hay caché
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return json({ error: "Failed to fetch weather data" }, response.status, "no-store");
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

    return json(data, 200, WEATHER_CACHE, "MISS");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500, "no-store");
  }
}
