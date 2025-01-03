//https://developers.cloudflare.com/d1/get-started/
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/types") {
      const { results } = await env.MY_TOPIC.prepare(
        'SELECT * FROM "types";',
      )
        .all();
      return Response.json(results);
    }

    return new Response(
      "Test /api/types",
    );
  },
};
