module.exports = function ConfApp(states, plugins) {
  "use strict";
  const toml = require("toml"),
        fs = require("fs-jetpack"),
        vorpal = require("vorpal");
  var conf = vorpal();

  conf
    .command();
    
}
