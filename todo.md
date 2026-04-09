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
- should we only preview immediate jumps or all possible jumps?  should we have click and drag or confirm?
  - previous only previewed, but can skip, make intermediate moves, can reset or confirm, click from move to move with selection state
  - preview all moves option (default false)
- list of positions for each player (described in api.md)
- replace opt out with data collection notice
- could rotate board on ui to have bottom be your pieces
  - could have option for it (default false)
- how is engine going
  - noticing issue with hardcoding start position turns and positions for each player count
  - just follow what engine says for default positions/turns
- how should previous moves be displayed?
  - make white less bright
  - maybe just preview start and end position
- should we have a tutorial page? what should go on there?
