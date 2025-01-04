//https://developers.cloudflare.com/d1/get-started/
//https://everythingcs.dev/blog/cloudflare-d1-workers-rest-api-crud-operation/
//https://workers-qb.massadas.com/databases/cloudflare-d1/
//https://developers.cloudflare.com/d1/tutorials/import-to-d1-with-rest-api/

import { data } from "./entryPart.js"
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    console.log(pathname);
    if (pathname === "/types") {
      const { results } = await env.MY_TOPIC.prepare(
        'SELECT * FROM "types";',
      ).all();
      return Response.json(results);
    } else if (pathname.startsWith("/upload")) {
      const endID = pathname.split("/")[2];
      console.log(endID);
      let startUploading = false;
      for (const x of data) {
        console.log(x.id, x.id == endID);
        if (x.id == endID) {
          console.log(x.id, x.id == endID);
          startUploading = true;
          continue; // This will now work correctly
        }
        if (startUploading) {
          console.log(`Uploading started next records after ${endID}`);
          const sqlQuery = env.MY_TOPIC.prepare(
            "INSERT INTO entry (i, name,id,parent,type) values (?,?,?,?,?)"
          ).bind(x.i, x.name, x.id, x.parent, x.type);
          try {
            const { success } = await sqlQuery.run();
            if (success) {
              //console.log(x.i);
            } else {
              console.log(`Error ${x.i}`);
            }
          } catch (error) {
            console.log(`${pathname} - ${error}`);
          }
        }
      }
      return Response.json("ok");
    }
    return new Response(
      "Request error",
    );
  },
};