export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const year = url.searchParams.get("year");

  let apiUrl = "https://mindicador.cl/api/uf";
  let cacheKey = "uf_current";
  let ttl = 3600; // 1 hora de caché para el valor actual

  if (year) {
    apiUrl = `${apiUrl}/${year}`;
    cacheKey = `uf_${year}`;
    ttl = 86400; // 1 día de caché para datos históricos de años que ya pasaron
  }

  // 1. Intentar obtener desde KV CACHE 
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
      console.error("Error leyendo desde KV Cache:", e);
    }
  }

  // 2. Si no hay cache, hacer fetch a la API externa
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch UF data" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();

    // 3. Guardar el resultado en KV CACHE
    if (env.kv_uf2clp) {
      try {
        await env.kv_uf2clp.put(cacheKey, JSON.stringify(data), { expirationTtl: ttl });
      } catch (e) {
        console.error("Error escribiendo en KV Cache:", e);
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
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
