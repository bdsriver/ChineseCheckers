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

# Next Meeting
- should we have board turning relative to player?
- should we have a tutorial page?
  - what should go on there?
- should we only preview immediate jumps or all possible jumps?
- should we have click and drag or only click?
- should we have multiple color options?
- replace opt out with data collection notice
- how should previous moves be displayed?
- how is engine going
  - noticing issue with hardcoding start position turns and positions for each player count
