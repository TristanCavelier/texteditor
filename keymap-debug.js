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

  /*jslint vars: true */

  var CodeMirror = root.CodeMirror;

  function arrayMul(a1, a2) {
    var a3 = [];
    a1.forEach(function (v1) {
      a2.forEach(function (v2) {
        a3.push(v1 + v2);
      });
    });
    return a3;
  }

  function debuggr(shortcut) {
    return function (cm) {
      alert(shortcut);
    };
  }

  CodeMirror.keyMap.debug = {};
  arrayMul(["", "Shift-"], arrayMul(["", "Crtl-"], arrayMul(["", "Alt-"], [
    "Enter", "Esc", "Tab", "Backspace", "Delete", "Space", "Up", "Down", "Left", "Right",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "!", "/", ":", ";", "_", "-", ",", ".", "%", "(", ")", "{", "}", "[", "]", "<", ">", "\\", "=", "+", "@", "#", "$", "^", "&", "*", "\"", "'",
    "Colon", "Semicolon", "Comma", "Apostrophe", "Percent", "Dot"
  ]))).forEach(function (shortcut) {
    CodeMirror.keyMap.debug[shortcut] = debuggr(shortcut);
  });

}(this));
