export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const year = url.searchParams.get("year");

  let apiUrl = "https://mindicador.cl/api/uf";
  if (year) {
    apiUrl = `${apiUrl}/${year}`;
  }

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch UF data" }), {
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
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
