export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Try to serve the exact asset (js, css, images, etc.)
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    // For all other routes (React Router paths), serve index.html
    return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
  },
};
