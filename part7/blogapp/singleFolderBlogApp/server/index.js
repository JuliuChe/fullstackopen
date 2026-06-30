const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
