#!/bin/bash

# Concatenates the source files of the RallySportED-js client into a single distributable file.

DST_DIRECTORY="./rallysported-js/client/js/"
DST_FILENAME="rallysported.cat.js"
VERSION="live"

SOURCE_FILES=("./src/client/js/jszip/jszip.min.js"
		      "./src/client/js/filesaver/FileSaver.min.js"
		      "./src/client/js/retro-ngon/rngon.cat.js"
              "./src/client/js/rallysported-js/rallysported.js"
              "./src/client/js/rallysported-js/project/project.js"
              "./src/client/js/rallysported-js/project/hitable.js"
              "./src/client/js/rallysported-js/misc/constants.js"
              "./src/client/js/rallysported-js/world/world.js"
              "./src/client/js/rallysported-js/world/mesh-builder.js"
              "./src/client/js/rallysported-js/world/camera.js"
              "./src/client/js/rallysported-js/visual/texture.js"
              "./src/client/js/rallysported-js/visual/palette.js"
              "./src/client/js/rallysported-js/visual/canvas.js"
              "./src/client/js/rallysported-js/track/varimaa.js"
              "./src/client/js/rallysported-js/track/maasto.js"
              "./src/client/js/rallysported-js/track/palat.js"
              "./src/client/js/rallysported-js/track/props.js"
              "./src/client/js/rallysported-js/ui/ui.js"
              "./src/client/js/rallysported-js/ui/html.js"
              "./src/client/js/rallysported-js/ui/popup-notification.js"
              "./src/client/js/rallysported-js/ui/font.js"
              "./src/client/js/rallysported-js/ui/ground-brush.js"
              "./src/client/js/rallysported-js/ui/draw.js"
              "./src/client/js/rallysported-js/ui/window.js"
              "./src/client/js/rallysported-js/ui/input-state.js"
              "./src/client/js/rallysported-js/ui/mouse-picking-element.js"
              "./src/client/js/rallysported-js/ui/component.js"
              "./src/client/js/rallysported-js/scene/scene.js"
              "./src/client/js/rallysported-js/scene/scene-3d.js"
              "./src/client/js/rallysported-js/scene/scene-tilemap.js"
              "./src/client/js/rallysported-js/core/core.js")

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

cp -R "./src/client/js/rallysported-js/ui/components/." "./rallysported-js/client/js/ui-components/"
