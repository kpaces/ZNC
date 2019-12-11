process.env.VUE_APP_VERSION = require("./package.json").version;
process.env.VUE_APP_DEPENDENCIES = JSON.stringify(
  require("./package.json").dependencies
);
