const
  vorpal = require("vorpal"),
  clifs = require("./local_modules/cli-fs");
var
  prelude = vorpal(),
  states = {};

prelude.use(clifs);

if (process.argv.length > 2) {
  try {
    prelude
    .parse(process.argv);
  } catch(e) {
    if (!e.message.endsWith("is not valid")) {
      throw e;
    }
  }
} else {
  prelude
    .delimiter("Moka@undefined~$")
    .show();
}
