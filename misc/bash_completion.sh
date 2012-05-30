#!/bin/bash

# grunt
# http://gruntjs.com/
#
# Copyright (c) 2012 "Cowboy" Ben Alman
# Licensed under the MIT license.
# http://benalman.com/about/license/

# To enable bash <tab> completion for grunt, add the following line (minus any
# leading #, which is the bash comment character) to your ~/.bashrc file:
#
# source "$(grunt -Vv | sed -En 's#Install path: (.*)#\1/misc/bash_completion.sh#p')"

# Search the current directory and all parent directories for a gruntfile.
function _grunt_gruntfile() {
  local curpath="$PWD"
  while [[ "$curpath" ]]; do
    for gruntfile in "$curpath/grunt."{js,coffee}; do
      if [[ -e "$gruntfile" ]]; then
        echo "$gruntfile"
        return
      fi
    done
    curpath="${curpath%/*}"
  done
  return 1
}

# Enable bash autocompletion.
function _grunt_completions() {
  local help opts tasks compls
  # The currently-being-completed word.
  local cur="${COMP_WORDS[COMP_CWORD]}"
  # The current gruntfile, if it exists.
  local gruntfile="$(_grunt_gruntfile)"
  # The current grunt version.
  local gruntversion="$(grunt --version)"
  # Cached info paths.
  local c_base="/tmp/grunt_completions/${gruntfile:-none}"
  local c_opts="$c_base/opts"
  local c_tasks="$c_base/tasks"
  local c_version="$c_base/version"
  local c_gruntfile="$c_base/gruntfile"
  # If grunt is a different version than the cached version or the gruntfile
  # differs from the cached copy, rebuild and cache options and tasks.
  if [[ "$gruntversion" != "$(cat "$c_version" 2>/dev/null)" ||
    $(diff "$gruntfile" "$c_gruntfile" 2>/dev/null) ]]; then

    # Create directory if it doesn't exist.
    [[ -d "$c_base" ]] || mkdir -p "$c_base"
    # Get grunt help output including options and local tasks.
    help="$(grunt --help --no-color 2>/dev/null)"
    # Parse out options and tasks individually.
    opts="$(echo "$help" | awk '$1~/^-/ {sub(",","",$1);print $1} $2~/^-/ {print $2}')"
    tasks="$(echo "$help" | awk 't==1 {print $1} /^Available .* tasks$/ {t=1} /^$/ {t=0}')"
    # Write files.
    echo "$opts" > "$c_opts"
    echo "$tasks" > "$c_tasks"
    echo "$gruntversion" > "$c_version"
    [[ -e "$gruntfile" ]] && cp "$gruntfile" "$c_gruntfile"
  else
    # Just read files.
    opts="$(< "$c_opts")"
    tasks="$(< "$c_tasks")"
  fi
  compls="$tasks"
  # Only add -- or - options if the user has started typing -
  [[ "$cur" == -* ]] && compls="$compls $opts"
  # Tell complete what stuff to show.
  COMPREPLY=($(compgen -W "$compls" -- "$cur"))
}

complete -o default -F _grunt_completions grunt
