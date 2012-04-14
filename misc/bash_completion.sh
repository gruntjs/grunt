#!/bin/bash

# grunt
# https://github.com/cowboy/grunt
#
# Copyright (c) 2012 "Cowboy" Ben Alman
# Licensed under the MIT license.
# http://benalman.com/about/license/

# To enable bash <tab> completion for grunt, add the contents of this file to
# your ~/.bashrc file OR source this file: source path/to/bash_completion.sh

function _grunt_completions() {
  local help opts tasks compls
  # The currently-being-completed word.
  local cur="${COMP_WORDS[COMP_CWORD]}"
  # Some paths.
  local basepath="/tmp/grunt_completions/$(pwd)"
  local optsfile="$basepath/opts"
  local tasksfile="$basepath/tasks"
  # If either file doesn't exist or is older than 1 minute old...
  if [[ ! -f "$optsfile" || ! -f "$tasksfile" || $(find "$optsfile" -mmin +1) || $(find "$tasksfile" -mmin +1) ]]; then
    # Create directory if it doesn't exist.
    [[ -d "$basepath" ]] || mkdir -p "$basepath"
    # Get grunt help output including options and local tasks.
    help="$(grunt --help --no-color 2>/dev/null)"
    # Parse out options and tasks individually.
    opts="$(echo "$help" | awk '$1~/^-/ {sub(",","",$1);print $1} $2~/^-/ {print $2}')"
    tasks="$(echo "$help" | awk 't==1 {print $1} /Available tasks/ {t=1} /^$/ {t=0}')"
    # Write files.
    echo "$opts" > "$optsfile"
    echo "$tasks" > "$tasksfile"
  else
    # Read files.
    opts="$(cat "$optsfile")"
    tasks="$(cat "$tasksfile")"
  fi
  compls="$tasks"
  # Only add -- or - options if the user has started typing -
  [[ "$cur" == -* ]] && compls="$compls $opts"
  # Tell complete what stuff to show.
  COMPREPLY=($(compgen -W "$compls" -- "$cur"))
}

complete -o default -F _grunt_completions grunt
