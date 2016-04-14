# Alfonso Tool Suite

The accompanying tool suite for rapidly creating Moka Modules. Alfonso is a
command line environment that automates many of the tasks that are otherwise
incredibly tedious. It also includes the Moka Module Manager and Colada
documentation generator.

## Installing

Currently Alfonso is installed via NPM, although a standalone executable is in
the works.

```
npm install -g alfonso
```

## Usage

Use the `alf` command in a terminal or command prompt to enter the Alfonso prelude.
This mode provides access to general commands that can get information about
or create new modules, but will not interact much with files outside of generating
new ones. It also provides access to other modes of the environment.

Any prelude commands can be executed without entering the Alfonso environment
by using the `alf [command] [options] [arguments]` variant command. This allows
users to create a new module in the current directory by simply typing `alf new`
instead of having to do this through the full environment.

### Basic File System Commands

These commands are available in all modes that do not deal directly with a single
file.

* `pwd` - Display the present directory
* `cd [path]` - Change the present directory
* `ls [-a]` - List files and folders in present directory. `-a` flag displays
hidden files and folders as well
* `list [lex|parse|interp]` - List Module files of the given types in the current
module. Multiple types can be specified, and if none are specified then all are assumed.

### Prelude Commands

* `new [-f]` - Enter the new module wizard. `-f` flag forces wizard if present
directory is not empty 
