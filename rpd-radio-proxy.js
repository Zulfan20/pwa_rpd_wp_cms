export default {
  async fetch(request, env, ctx) {
    // This is your insecure Voscast stream
    const url = "http://s1.voscast.com:8080/stream";
    
    // We fetch the stream
    const response = await fetch(url, {
        headers: request.headers,
    });
    
    // Cloudflare magically wraps the ongoing stream in HTTPS and sends it to your users!
    return new Response(response.body, {
        status: response.status,
        headers: response.headers
    });
  },
};