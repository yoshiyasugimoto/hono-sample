import { Hono } from "hono";
import { env } from "hono/adapter";
import { logger } from "hono/logger";
import { streamSSE } from "hono/streaming";

const app = new Hono();

app.use("*", logger());

app.get("/", (c) => {
  const { ENVIRONMENT } = env<{ ENVIRONMENT: string }>(c);
  console.log(ENVIRONMENT);

  return c.text("hello");
});

let id = 0;
app.get("/sse", async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const message = `It is ${new Date().toISOString()}`;
      await stream.writeSSE({
        data: message,
        event: "time-update",
        id: String(id++),
      });
      await stream.sleep(1000);
    }
  });
});

export default app;
