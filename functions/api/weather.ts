export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing lat or lon parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
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

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch weather data" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
