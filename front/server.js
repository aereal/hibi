const { resolve } = require("path");
const express = require("express");
const next = require("next");
const { inspect } = require("util");

const start = async () => {
  const port = parseInt(process.env.PORT, 10) || 3000;
  const dev = process.env.NODE_ENV !== "production";
  const conf = require("./next.config.js");
  const app = next({ dev, conf: typeof conf === "function" ? conf({}) : conf });
  const handle = app.getRequestHandler();

  const server = express();
  server.get("/", (req, res) => app.render(req, res, "/", req.query));
  server.get("/articles/:slug", (req, res) =>
    app.render(req, res, "/permalink", { slug: req.params.slug })
  );
  server.all("*", (req, res) => handle(req, res));

  await new Promise((ok, ng) => {
    const httpServer = server.listen(port, err => {
      if (err) ng(err);
    });
    httpServer.on("error", ng);
    httpServer.on("listening", () => ok());
  });
  await app.prepare();
  return app;
};

const main = () => {
  start()
    .then(() => {
      console.log(`---> start next dev`);
    })
    .catch(err => {
      console.error(err);
      process.nextTick(() => process.exit(1));
    });
};
main();
