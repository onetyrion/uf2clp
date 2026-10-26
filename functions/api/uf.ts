const CURRENT_CACHE = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";
const YEAR_CACHE = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

function json(
  data: unknown,
  status: number,
  cacheControl: string,
  cacheStatus?: "HIT" | "MISS"
) {
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
  const year = url.searchParams.get("year");

  if (year && !/^\d{4}$/.test(year)) {
    return json({ error: "Invalid year" }, 400, "no-store");
  }

  const apiUrl = year
    ? `https://mindicador.cl/api/uf/${year}`
    : "https://mindicador.cl/api/uf";
  const cacheKey = year ? `uf_${year}` : "uf_current";
  const ttl = year ? 86400 : 3600;
  const cacheControl = year ? YEAR_CACHE : CURRENT_CACHE;

  // 1. Intentar obtener desde KV CACHE
  if (env.kv_uf2clp) {
    try {
      const cachedData = await env.kv_uf2clp.get(cacheKey, "json");
      if (cachedData) {
        return json(cachedData, 200, cacheControl, "HIT");
      }
    } catch (e) {
      console.error("Error leyendo desde KV Cache:", e);
    }
  }

  // 2. Si no hay cache, hacer fetch a la API externa
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return json({ error: "Failed to fetch UF data" }, response.status, "no-store");
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

    return json(data, 200, cacheControl, "MISS");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500, "no-store");
  }
}
