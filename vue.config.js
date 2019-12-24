process.env.VUE_APP_VERSION = require("./package.json").version;
process.env.VUE_APP_DEPENDENCIES = JSON.stringify(
  require("./package.json").dependencies
);

module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === "test") {
      const sassRule = config.module.rule("sass");
      sassRule.uses.clear();
      sassRule.use("null-loader").loader("null-loader");
      const scssRule = config.module.rule("scss");
      scssRule.uses.clear();
      scssRule.use("null-loader").loader("null-loader");
    }
  }
};
