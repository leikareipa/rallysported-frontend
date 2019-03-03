# RallySportED's assets folder
Contains various assets &ndash; generally mined from Rally-Sport's data files &ndash; required for RallySportED's operation.

### The contents
The following is a brief description of each asset file.

[rsed-cursor.png](rsed-cursor.png) &mdash; RallySportED's cursor.\
[hitable.txt.js](hitable.txt.js) &mdash; The contents of Rally-Sport's default HITABLE.TXT file as a JavaScript array. Will be included in the .zip file generated when the user saves a track.\
[rallye-exe/](rallye-exe/) &mdash; A folder containing assets extracted from Rally-Sport's `RALLYE.EXE` executable.\
[rallye-exe/prop-locations.json](rallye-exe/prop-locations.json) &mdash; The xyz coordinates of each 3d object (track prop; like trees, houses, and utility poles) on each of Rally-Sport's eight default tracks. Note that these coordinates are in RallySportED's units, not in those used by the game.\
[rallye-exe/prop-meshes.json](rallye-exe/prop-meshes.json) &mdash; The 3d models of each of Rally-Sport's track props. Includes vertices, colors (as indexes to the game's palette), and texture ids.\
[rallye-exe/prop-textures.dta](rallye-exe/prop-textures.dta) &mdash; A binary file containing the track props' textures. Each byte is a color index to the game's palette.\
[rallye-exe/track-header.dta](rallye-exe/track-header.dta) &mdash; A binary file containing for each of Rally-Sport's eight default tracks various parameters, like the track's width and height, its water level, etc.
