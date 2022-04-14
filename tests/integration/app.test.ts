import { superoak } from "../../deps.ts";
import { app } from "../../app.ts";

Deno.test("it should support the Oak framework", async () => {
  const request = await superoak(app);
  await request.get("/").expect("ready");
});
