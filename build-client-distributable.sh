#!/bin/bash

# Concatenates the source files of the RallySportED-js client into a single distributable file.

DST_DIRECTORY="./rallysported-js/client/js/"
DST_FILENAME="rallysported.cat.js"
VERSION="live"

SOURCE_FILES=("./rallysported-js/client/js/jszip/jszip.min.js"
		      "./rallysported-js/client/js/filesaver/FileSaver.min.js"
		      "./rallysported-js/client/js/retro-ngon/rngon.cat.js"
              "./rallysported-js/client/js/rallysported-js/rallysported.js"
              "./rallysported-js/client/js/rallysported-js/project/project.js"
              "./rallysported-js/client/js/rallysported-js/project/hitable.js"
              "./rallysported-js/client/js/rallysported-js/misc/constants.js"
              "./rallysported-js/client/js/rallysported-js/world/world.js"
              "./rallysported-js/client/js/rallysported-js/world/mesh-builder.js"
              "./rallysported-js/client/js/rallysported-js/world/camera.js"
              "./rallysported-js/client/js/rallysported-js/visual/texture.js"
              "./rallysported-js/client/js/rallysported-js/visual/palette.js"
              "./rallysported-js/client/js/rallysported-js/visual/canvas.js"
              "./rallysported-js/client/js/rallysported-js/track/varimaa.js"
              "./rallysported-js/client/js/rallysported-js/track/maasto.js"
              "./rallysported-js/client/js/rallysported-js/track/palat.js"
              "./rallysported-js/client/js/rallysported-js/track/props.js"
              "./rallysported-js/client/js/rallysported-js/ui/ui.js"
              "./rallysported-js/client/js/rallysported-js/ui/html.js"
              "./rallysported-js/client/js/rallysported-js/ui/popup-notification.js"
              "./rallysported-js/client/js/rallysported-js/ui/font.js"
              "./rallysported-js/client/js/rallysported-js/ui/ground-brush.js"
              "./rallysported-js/client/js/rallysported-js/ui/draw.js"
              "./rallysported-js/client/js/rallysported-js/ui/window.js"
              "./rallysported-js/client/js/rallysported-js/ui/input-state.js"
              "./rallysported-js/client/js/rallysported-js/ui/mouse-picking-element.js"
              "./rallysported-js/client/js/rallysported-js/ui/component.js"
              "./rallysported-js/client/js/rallysported-js/scene/scene.js"
              "./rallysported-js/client/js/rallysported-js/scene/scene-3d.js"
              "./rallysported-js/client/js/rallysported-js/scene/scene-tilemap.js"
              "./rallysported-js/client/js/rallysported-js/core/core.js")

echo "// WHAT: Concatenated JavaScript source files" > "$DST_DIRECTORY/$DST_FILENAME"
echo "// PROGRAM: RallySportED-js" >> "$DST_DIRECTORY/$DST_FILENAME"
echo "// AUTHOR: Tarpeeksi Hyvae Soft" >> "$DST_DIRECTORY/$DST_FILENAME"
echo "// VERSION: $VERSION (`LC_ALL=en_US.utf8 date -u +"%d %B %Y %H:%M:%S %Z"`)" >> "$DST_DIRECTORY/$DST_FILENAME"
echo "// LINK: https://www.github.com/leikareipa/rallysported-js/" >> "$DST_DIRECTORY/$DST_FILENAME"
echo "// INCLUDES: { JSZip (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso }" >> "$DST_DIRECTORY/$DST_FILENAME"
echo "// INCLUDES: { FileSaver.js (c) 2016 Eli Grey }" >> "$DST_DIRECTORY/$DST_FILENAME"
echo "// INCLUDES: { The retro n-gon renderer (c) 2019 Tarpeeksi Hyvae Soft }" >> "$DST_DIRECTORY/$DST_FILENAME"
echo "// FILES:" >> "$DST_DIRECTORY/$DST_FILENAME"
printf "//\t%s\n" "${SOURCE_FILES[@]}" >> "$DST_DIRECTORY/$DST_FILENAME"
echo -e "/////////////////////////////////////////////////\n" >> "$DST_DIRECTORY/$DST_FILENAME"

cat ${SOURCE_FILES[@]} >> "$DST_DIRECTORY/$DST_FILENAME"

# Remove empty lines
sed -i '/^[[:space:]]*$/d' "$DST_DIRECTORY/$DST_FILENAME"

# Trim whitespace.
sed -i 's/^[[:blank:]]*//;s/[[:blank:]]*$//' "$DST_DIRECTORY/$DST_FILENAME"
