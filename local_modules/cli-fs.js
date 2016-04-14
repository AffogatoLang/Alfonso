const
  chalk = require("vorpal")().chalk,
  fs = require("fs-jetpack"),
  Table = require("cli-table")
  _ = require("lodash");

  function getFromDirWithExt(fs, ext) {
    "use strict";
    let files = fs.list();
    return files.filter(e => e.endsWith(ext)).map(e => fs.inspect(e).name);
  }

module.exports = function cliFsPlugin (vorpal, options) {
  "use strict";
  let opts = options || {};
  vorpal.fs = fs.cwd(".");

  vorpal
    .command("pwd", "Output the current directory")
    .action((args, callback) => {
      this.log(vorpal.fs.cwd());
      callback();
    });

  vorpal
    .command("cd <path>", "Changes the current directory")
    .validate((args) => {
      switch (vorpal.fs.exists(args.path)) {
        case "dir":
          return true;
        case "file":
          return "Cannot cd to file";
        case false:
          return "No such directory " + vorpal.fs.path(args.path);
        default:
          return "Failed to cd to path " + vorpal.fs.path(args.path);
      }
    })
    .action ((args, callback) => {
      vorpal.fs = vorpal.fs.cwd(args.path);
      if (opts.oncd) {
        opts.oncd(vorpal.fs, callback);
      } else {
        callback();
      }
    });

  vorpal
    .command("ls [path]", "List the contents of [path] or the current directory if not present")
    .option("-a", "List hidden files and directories")
    .validate((args) => {
      if (args.path) {
        let exs = vorpal.fs.exists(args.path);
        if (exs == "dir" || exs == "file") {
          return true;
        } else {
          return "No such file or directory " + vorpal.fs.path(args.path);
        }
      }
    })
    .action((args, callback) => {
      let
        path = args.path || ".",
        entries = vorpal.fs.list(path);

      entries = entries.map(e => vorpal.fs.inspect(e));
      entries = _.sortBy(
        (
          args.options.a
            ? entries
            : entries.filter(e => !e.name.startsWith("."))
        )
        .map(e => _.set(e, "name", (
          e.type == "dir"
          ?  chalk.cyan.bold(e.name) + "/"
          : e.name
        ))),
      "type"
      );
      for (let e of entries) {
        this.log(e.name);
      }
      this.log();
      callback();
    });

  vorpal
    .command("list [types...]", "List module files in the current module of the given type")
    .autocomplete(["lex", "parse", "interp"])
    .validate((args) => {
      if (! args.types) {
        return true;
      }

      let
        invalid = [],
        hasInvalid = false;
      for (let type of args.types) {
        switch (type) {
          case "lex":
          case "parse":
          case "interp":
            break;
          default:
            invalid.push(type);
            hasInvalid = true;
            break;
        }
      }

      if (hasInvalid) {
        return "The type"
          + (
            invalid.length > 1
              ? "s "
              : " "
            )
          + invalid.join(", ")
          + (
            invalid.length > 1
              ? " are "
              : " is "
          )
          + "not valid"
      } else {
        return true;
      }
    })
    .action((args, callback) => {
      let
        columns = [],
        doLexFiles = false,
        doParseFiles = false,
        doInterpFiles = false,
        lexFiles = [],
        parseFiles = [],
        interpFiles = [],
        targetSize = 0;

      if (args.types) {
        args.types = args.types.map(e => e.toLowerCase());
        if (args.types.includes("lex")) {
          doLexFiles = true;
          columns.push("Lexer");
        }
        if (args.types.includes("parse")) {
          doParseFiles = true;
          columns.push("Parser");
        }
        if (args.types.includes("interp")) {
          doInterpFiles = true;
          columns.push("Interpreter");
        }
      } else {
        columns = columns.concat(["Lexer", "Parser", "Interpreter"]);
        doLexFiles = true;
        doParseFiles = true;
        doInterpFiles = true;
      }

      if (doLexFiles && vorpal.fs.exists("lex") == "dir") {
        lexFiles = getFromDirWithExt(vorpal.fs.cwd("lex"), "lex");
      }

      if (doParseFiles && vorpal.fs.exists("parse") == "dir") {
        parseFiles = getFromDirWithExt(vorpal.fs.cwd("parse"), "lang");
      }

      if (doInterpFiles && vorpal.fs.exists("interp") == "dir") {
        interpFiles = getFromDirWithExt(vorpal.fs.cwd("interp"), "py");
      }

      if (lexFiles.length > targetSize) {
        targetSize = lexFiles.length;
      }

      if (parseFiles.length > targetSize) {
        targetSize = parseFiles.length;
      }

      if (interpFiles.length > targetSize) {
        targetSize = interpFiles.length;
      }

      let
        data = _.zip(lexFiles, parseFiles, interpFiles).map(e => e.forEach(j => j == null ? "" : j)),
        datatable = new Table({
          head: columns
        });

      data.forEach(e => datatable.push(e));

      this.log(datatable.toString());

      callback();
    });
}
