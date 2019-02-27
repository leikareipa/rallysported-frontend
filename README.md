# RallySportED (web/browser version)
The cult DOS game Rally-Sport (1996) was largely without modding tools&mdash;until RallySportED came along. Released by a third party, i.e. me, on the 20th anniversary of the game, RallySportED allows one to edit many of Rally-Sport's internal assets, like tracks, textures, and certain hard-coded functionality.

To-date, two versions of the game are known to exist. The initial release, in late-1996, is considered a free demo. The second release, in mid-1997, is the full, commercial release, but adds few new features. Since the demo version is not far behind in features and is accessible to a larger number of people, RallySportED targets this version only.

This repo contains the source code for the web/browser version of RallySportED. Note that the repo tracks my local one with low granularity only.

For more information (including technical documentation on Rally-Sport's data formats), see [RallySportED's umbrella repo](../../../rallysported). For a live demonstration of RallySportED in the browser, browse [here](http://tarpeeksihyvaesoft.com/rallysported/).

### Features
- Edit Rally-Sport's tracks in your browser!
- Alter the heightmap, paint the ground, move and place 3d objects
- Retro-style software-rendered 3d graphics
- Texture distortion matches the game's, so WYSIWYG

# Usage
Verbose instructions to follow, but suffice to say for now that, to test RallySportED on your localhost, use ```localhost/?track=abc``` as the address. This will load the sample track `abc` from [track-list/files/](track-list/files/).

# Todo
- [ ] Editing of textures.
- [ ] A user interface that works on mobile devices.
- [ ] Highlight prop locations in the paint view.
- [ ] Have the height of water tiles reflect how the game displays them.
- [ ] Non-FPS-sensitive terrain editing.
- [ ] A viewing angle in the 3d view that matches that of the game. Useful since the texture distortion is angle-dependent.
- [ ] Move the camera by clicking on the minimap.
- [ ] Terrain shading.
- [ ] An indicator rectangle in the texture pane around the texture that's currently selected.

# Known issues
- [ ] Middle mouse button clicks, used to paint the terrain, may intermittently stop getting registered. Not sure that this isn't a browser/focus issue; and I might reassign the button to something else.
- [ ] The paint view may be slow to draw, as it's sloppily implemented. One workaround for now is to zoom the page in your browser (e.g. with ctrl + wheel up), which results in lower-resolution, quicker rendering.
- [ ] There are occasional rendering errors in the 3d view.
- [ ] The house prop has bad texturing. 
- [ ] Keyboard keys can stick if released while the app doesn't have focus.
- [ ] The camera moves in units of tiles rather than pixels, making for jerky scrolling when moving diagonally.
