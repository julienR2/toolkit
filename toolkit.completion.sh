### tk completion - begin. generated by omelette.js ###
if type compdef &>/dev/null; then
  _tk_completion() {
    compadd -- `toolkit --compzsh --compgen "${CURRENT}" "${words[CURRENT-1]}" "${BUFFER}"`
  }
  compdef _tk_completion tk
elif type complete &>/dev/null; then
  _tk_completion() {
    local cur prev nb_colon
    _get_comp_words_by_ref -n : cur prev
    nb_colon=$(grep -o ":" <<< "$COMP_LINE" | wc -l)

    COMPREPLY=( $(compgen -W '$(toolkit --compbash --compgen "$((COMP_CWORD - (nb_colon * 2)))" "$prev" "${COMP_LINE}")' -- "$cur") )

    __ltrim_colon_completions "$cur"
  }
  complete -F _tk_completion tk
fi
### tk completion - end ###