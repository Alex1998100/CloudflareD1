//https://developers.cloudflare.com/d1/get-started/
//https://everythingcs.dev/blog/cloudflare-d1-workers-rest-api-crud-operation/
//https://workers-qb.massadas.com/databases/cloudflare-d1/
//https://developers.cloudflare.com/d1/tutorials/import-to-d1-with-rest-api/

import { data } from "./entryPart.js"

async function uploadData(env, data, endID) {
    //Slicing the Array: data.slice is used to reduce the work done, including only the records after the endID record.
    const recordsToInsert = data.slice(data.findIndex(x => x.id === endID) + 1)
    // This executes all the database insertion Promises concurrently, significantly speeding up the process,
    return Promise.all(recordsToInsert.map(async x => {
        const sqlQuery = env.MY_TOPIC.prepare(
            "INSERT INTO entry (i, name, id, parent, type) values (?,?,?,?,?)"
        ).bind(x.i, x.name, x.id, x.parent, x.type);
        try {
            const { success } = await sqlQuery.run();
            if (!success) {
                console.log(`Error inserting record: ${JSON.stringify(x)}`);
            }
        } catch (error) {
            console.error(`Error inserting record: ${JSON.stringify(x)}, error: ${error}`);
        }
    }));
  }

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
            if (!endID) {
                return new Response("No ID specified", { status: 400 });
            }
            try {
                await uploadData(env, data, endID);
                return new Response("ok");
            } catch (error) {
                console.error("Upload failed:", error);
            }
            return new Response("ok");
        }
        return new Response(
            "Request error",
        );
    },
};