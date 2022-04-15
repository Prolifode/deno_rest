import { describe, it, superoak } from "../../deps.ts";
import { app } from "../../app.ts";

describe("App Health endpoint", () => {
  it("should support the Oak framework", async () => {
    const request = await superoak(app);
    await request.get("/").expect("ready");
  });
});
