#!/bin/bash

#   Copyright (c) 2014 Tristan Cavelier <t.cavelier@free.fr>
#
#   This program is free software. It comes without any warranty, to
#   the extent permitted by applicable law. You can redistribute it
#   and/or modify it under the terms of the Do What The Fuck You Want
#   To Public License, Version 2, as published by Sam Hocevar. See
#   below for more details.
#
#   ___________________________________________________________________
#  |                                                                   |
#  |           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             |
#  |                   Version 2, December 2004                        |
#  |                                                                   |
#  |Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>                   |
#  |                                                                   |
#  |Everyone is permitted to copy and distribute verbatim or modified  |
#  |copies of this license document, and changing it is allowed as long|
#  |as the name is changed.                                            |
#  |                                                                   |
#  |           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             |
#  |  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION  |
#  |                                                                   |
#  | 0. You just DO WHAT THE FUCK YOU WANT TO.                         |
#  |___________________________________________________________________|

cat manifest.appcache | awk '
BEGIN { line_print=1; global_print=0 }
/^\s*#/ { line_print=0 }
{
  if (global_print && line_print) {
    print
  }
  line_print=1
}
/^CACHE:$/ { global_print=1 }
/^(NETWORK|FALLBACK):$/ { global_print=0 }
' | grep -v '^\s*$' | grep '.css$' | sed -e 's,^//,http://,g' -e 's,^/,http://rawgit.com/,g' | while IFS= read -r line ; do
    echo '/******************************************************************************/'
    echo "/* BEGIN $line */"
    if [ -f "$line" ] ; then
        cat "$line" || exit 3
    else
        curl -s "$line" || exit 2
    fi
    echo "/* END $line */"
    echo '/******************************************************************************/'
    echo
done > app.css
