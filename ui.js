/*jslint indent: 2 */
(function (root) {
  "use strict";

  /*
   Version: 0.1.0b

   Copyright (c) 2014 Tristan Cavelier <t.cavelier@free.fr>

   This program is free software. It comes without any warranty, to
   the extent permitted by applicable law. You can redistribute it
   and/or modify it under the terms of the Do What The Fuck You Want
   To Public License, Version 2, as published by Sam Hocevar. See
   below for more details.

   ___________________________________________________________________
  |                                                                   |
  |           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             |
  |                   Version 2, December 2004                        |
  |                                                                   |
  |Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>                   |
  |                                                                   |
  |Everyone is permitted to copy and distribute verbatim or modified  |
  |copies of this license document, and changing it is allowed as long|
  |as the name is changed.                                            |
  |                                                                   |
  |           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             |
  |  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION  |
  |                                                                   |
  | 0. You just DO WHAT THE FUCK YOU WANT TO.                         |
  |___________________________________________________________________|

  */

  /*jslint indent: 2, vars: true, nomen: true */

  // dependencies:
  // - document
  // - location
  // - JSON
  // - Promise
  // - Blob
  // - FileReader
  // - alert
  // - prompt
  // - setTimeout
  // - clearTimeout
  // - CodeMirror
  // - mixinManager
  // - base64

  if (root.JSLINT) {
    root.JSHINT = root.JSLINT;
  }

  function randomChoose(array) {
    return array[parseInt(Math.random() * array.length, 10)];
  }

  // function addNTimes(toAdd, n) {
  //   var i, res;
  //   if (typeof toAdd === "string") {
  //     res = "";
  //   } else if (typeof toAdd === "number") {
  //     res = 0;
  //   }
  //   for (i = 0; i < n; i += 1) {
  //     res += toAdd;
  //   }
  //   return res;
  // }

  ////////////////////////////////////////////////////////////////////////////////

  function alertAndThrow(e) { root.alert(e); throw e; }

  function readBlobAsText(blob) {
    return new root.Promise(function (resolve, reject) {
      var fr = new root.FileReader();
      fr.addEventListener("load", function () { resolve(fr.result); });
      fr.addEventListener("error", function () {
        reject(new Error("readBlobAsText: Cannot read blob"));
      });
      fr.readAsText(blob);
    });
  }

  var storage = null;
  var description = null;
  var url = null;
  var elEditor = null;
  var cmEditor = null;

  function updateTextArea() {
    root.clearTimeout(elEditor.__saving);
    delete elEditor.__saving;
    elEditor.value = cmEditor.getValue();
  }

  function delayedUpdateTextArea() {
    root.clearTimeout(elEditor.__saving);
    elEditor.__saving = root.setTimeout(updateTextArea, 200);
  }

  var funs = {
    "help doc": "Shows this help",
    help: function () {
      root.alert(Object.keys(funs).reduce(function (prev, curr) {
        if (curr.indexOf(" ") !== -1) {
          return prev;
        }
        prev += curr;
        if (funs[curr + " doc"]) {
          prev += "\t\t\t" + funs[curr + " doc"];
        }
        return prev + "\n";
      }, ""));
    },
    "load doc": "XXX",
    load: function (cm, args) {
      /*jslint unparam: true */
      args = args.slice(0, 1); // don't use args[1] unless the given parameters allows space character
      if (!args[1]) { args[1] = root.prompt("Change description:", root.JSON.stringify(description)); }
      if (!args[1]) { return root.alert("Empty description, aborting."); }
      try {
        var tmp;
        tmp = root.JSON.parse(args[1]);
        root.mixinManager.parse(tmp);
        args[1] = tmp;
      } catch (e) {
        return root.alert(e);
      }
      if (!args[2]) { args[2] = root.prompt("Open:", url); }
      if (!args[2]) { return root.alert("Empty url, aborting."); }
      root.location.href = root.location.href.split("#").slice(0, 1).concat([encodeURIComponent(root.JSON.stringify(args[1])), encodeURIComponent(args[2])]).join("#");
      root.location.reload();
    },
    "loadpath doc": "XXX",
    loadpath: function (cm, args) {
      /*jslint unparam: true */
      args = args.slice(0, 1); // don't use args[1] unless the given parameters allows space character
      if (!args[1]) { args[1] = root.prompt("Open:", url); }
      if (!args[1]) { return root.alert("Empty url, aborting."); }
      root.location.href = root.location.href.split("#").slice(0, 1).concat([encodeURIComponent(root.JSON.stringify(description)), encodeURIComponent(args[1])]).join("#");
      root.location.reload();
    },
    save: function (cm) {
      if (!storage || !url) {
        return root.alert("Nowhere to save");
      }
      storage.put(url, new root.Blob([cm.getValue()])).then(function () {
        root.alert("Saved as " + url);
      }, alertAndThrow);
    },
    "mode doc": "{javascript|xml|htmlmixed|...}",
    mode: function (cm, args) {
      cm.setOption("mode", args[1]);
      cm.setOption("lint", false);
      root.setTimeout(function () {
        cm.setOption("lint", true);
      });
    },
    "theme doc": "{default|random|rubyblue|monokai|blackboard|...}",
    theme: function (cm, args) {
      if (args[1] === "random") {
        cm.setOption("theme", randomChoose(["3024-night", "monokai", "blackboard", "rubyblue", "cobalt"]));
        return;
      }
      cm.setOption("theme", args[1] || "default");
    },
    "keymap doc": "{default|krx|emacs|vim}",
    keymap: function (cm, args) {
      cm.setOption("keyMap", args[1] || "default");
    },
    "tab-size doc": "int",
    "tab-size": function (cm, args) {
      var i = parseInt(args[1], 10);
      if (isFinite(i)) {
        cm.setOption("tabSize", i);
      }
    },
    lint: function (cm) {
      // Why two setTimeout? because the first sometimes doesn't works... =)
      function tryToEnableLint() {
        try {
          cm.setOption("lint", false);
          cm.setOption("lint", true);
        } catch (ignore) {}
      }
      root.setTimeout(tryToEnableLint);
      root.setTimeout(tryToEnableLint);
    },
    "remove-trailing-spaces": function (cm) {
      var position = cm.getCursor();
      cm.setValue(cm.getValue().replace(/[ \t]+(\r)?\n/g, '$1\n'));
      cm.setCursor(position);
    },
    "view-as-svg": function (cm) {
      var svg_update_ident, svg_img = root.document.createElement("img");
      root.document.body.appendChild(svg_img);
      cm.setOption("fullScreen", false);
      function updateSvg() {
        svg_img.setAttribute(
          "src",
          "data:image/svg+xml;base64," + root.base64.encodeText(cm.getValue())
        );
      }
      cm.on("change", function () {
        root.clearTimeout(svg_update_ident);
        svg_update_ident = root.setTimeout(updateSvg, 200);
      });
      updateSvg();
    }
  };

  //////////////////////////////////////////////////////////////////////

  root.CodeMirror.commands.save = function (cm) {
    updateTextArea();
    funs.save(cm, ["save"]);
  };

  root.CodeMirror.keyMap.default.F3 = "findNext";
  root.CodeMirror.keyMap.default["Shift-F3"] = "findPrev";

  elEditor = root.document.createElement("textarea");
  root.addEventListener("load", function () {

    root.document.body.appendChild(elEditor);
    cmEditor = root.CodeMirror.fromTextArea(elEditor, {

      // http://codemirror.net/doc/manual.html#addons
      // addon/edit/matchbrackets.js
      matchBrackets: true,
      // addon/edit/closebrackets.js
      autoCloseBrackets: false,
      // addon/edit/trailingspace.js
      showTrailingSpace: true,
      // addon/display/fullscreen.{js,css}
      fullScreen: true, // start full screen

      // http://codemirror.net/doc/manual.html#config

      keyMap: "krx", // default "default"
      showCursorWhenSelecting: true,

      extraKeys: {
        // "Alt-X": function (cm) {
        // "Alt-F12": function (cm) {
        "Alt-R": function (cm) {
          // XXX allow the use of space character (like in bash interpreter)
          var text = root.prompt("Command (type `help` to get a list of commands)"), args;
          if (text) {
            args = text.split(" ");
            funs[args[0]](cm, args);
          }
        },
        "Ctrl-O": function (cm) {
          root.setTimeout(funs.loadpath, 0, cm, ["loadpath"]);
        },
        "Shift-Ctrl-O": function (cm) {
          root.setTimeout(funs.load, 0, cm, ["load"]);
        },
        // "Ctrl-S": function (cm) {
        //   updateTextArea();
        //   funs.save(cm, ["save"]);
        // },
        "Shift-Ctrl-S": function (cm) {
          funs["remove-trailing-spaces"](cm, ["remove-trailing-spaces"]);
          updateTextArea();
          funs.save(cm, ["save"]);
        }
      },

      lineNumbers: true, // default false

      tabSize: 2, // default 4
      smartIndent: true, // default true
      indentWithTabs: false, // default false

      lint: false,
      gutters: ["CodeMirror-lint-markers"],

      autofocus: true, // default false
      theme: "rubyblue", // default "default"
      mode: "text"
    });

    cmEditor.on("change", delayedUpdateTextArea);

    root.setTimeout(function () {
      try {
        var hashes = root.location.href.split('#').slice(1);
        description = root.JSON.parse(decodeURIComponent(hashes[0]));
        storage = root.mixinManager.parse(description);
        url = decodeURIComponent(hashes[1]);
        var basename, dirname, mimetype;
        /*jslint regexp: true */
        dirname = url.replace(/[^\/]+$/, function (_basename) {
          basename = _basename;
          return "";
        });
        root.document.title = basename + " (" + dirname + ") - CodeMirror";
        storage.get(url).then(function (result) {
          mimetype = result.data.type;
          return readBlobAsText(result.data);
        }).then(function (text) {
          cmEditor.setValue(text);
          cmEditor.setOption("mode", mimetype);
          funs.lint(cmEditor, ["lint"]);
        }).then(null, alertAndThrow);
      } catch (e) {
        return root.alert(e);
      }
    });
  });

}(this));