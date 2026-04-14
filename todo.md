# Web Preview 3/15
Turn board for player perspective (discuss later but probably not, makes it hard to differentiate directionally)
Optional tutorial for how to play (maybe just button takes you to static page)
Possibly don't preview multiple jumps
Switch from click and drag to just click?
Log only keeps track of final move, not intermediate jumps, keep in mind when rendering
End turn button and reset state button
Global turn timeout will remove player
Only 2,3,4,6 player configurations are legal
Maybe remove colors, instead for each position have dropdown of which player is assigned to that position, otherwise they have to be kept track of on backend
Apache server + web sockets

# Meeting Notes
- should we only preview immediate jumps or all possible jumps?
  - previous only previewed, but can skip, make intermediate moves, can reset or confirm, click from move to move with selection state
- list of positions for each player (described in api.md)
- replace opt out with data collection notice
- just follow what engine says for default positions/turns

# TODO
- tutorial page
- option for preview all jumps, default false
- change click and drag to click selection and confirm
  - also need confirm move or reset move
- replace opt out with data collection notice
- replace white dot with something better for previous moves
  - instead of displaying trail, just display start and end
- api implementation
- abstract local and server api
