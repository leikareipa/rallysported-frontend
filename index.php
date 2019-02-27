<!DOCTYPE html>
<html>
    <head>
		<meta name="viewport" content="width=device-width">
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="index.css">
        <link href="https://fonts.googleapis.com/css?family=Catamaran|Permanent+Marker|Cabin|Montserrat" rel="stylesheet">
        <title>RallySportED (beta) by Tarpeeksi Hyvae Soft</title>
        <?php include "stats.php"; ?>
    </head>
    <body>
        <div id="track_info_display" class="title_container">
            <span id="track_title" class="track_name"></span>

            <span class="button" style="color: rgb(0, 0, 0); background-color: rgb(179, 112, 25);"
                  onclick="rsed_n.save_project_to_disk();">
                save to disk
            </span>

            <a class="button" style="font-variant: small-caps; color: rgb(170, 170, 170); background-color: rgb(87, 87, 87);"
               href="./track-list/" target="_blank" rel="noopener">
                track list &#9656;
            </a>

            <div class="disclaimer">
                rallysported by tarpeeksi hyvae soft. rally-sport by jukka jakala. no endorsements or warranties.
                <a href="./userguide/" target="_blank" rel="noopener">user guide</a> &#9656;
            </div>
        </div>

        <div id="render_container" class="canvas_container"
             ondrop="page_n.ondrop(event);" ondragover="event.preventDefault();">
            <!-- The rendering goes here.-->
        </div>

        <div id="prop_dropdown"
             class="dropdown_list">
            <!-- Menu items for props will be generated here.-->
        </div>

        <script src="js/polyfill.js" defer></script>

        <!-- Third-party JavaScript.-->
        <script src="js/filesaver/FileSaver.min.js" defer></script>
        <script src="js/jszip/jszip.min.js" defer></script>

        <!-- RallySportED JavaScript.-->
        <script src="js/rsed/lut/hitable.txt.js" defer></script>
        <script src="js/rsed/common.js" defer></script>
        <script src="js/rsed/visual/color.js" defer></script>
        <script src="js/rsed/visual/texture.js" defer></script>
        <script src="js/rsed/visual/palette.js" defer></script>
        <script src="js/rsed/transform/geometry.js" defer></script>
        <script src="js/rsed/transform/matrix44.js" defer></script>
        <script src="js/rsed/transform/poly-transform.js" defer></script>
        <script src="js/rsed/render/camera.js" defer></script>
        <script src="js/rsed/render/rsed-renderer.js" defer></script>
        <script src="js/rsed/render/render-surface.js" defer></script>
        <script src="js/rsed/track/maasto.js" defer></script>
        <script src="js/rsed/track/palat.js" defer></script>
        <script src="js/rsed/track/props.js" defer></script>
        <script src="js/rsed/track/manifesto.js" defer></script>
        <script src="js/rsed/ui/font.js" defer></script>
        <script src="js/rsed/ui/mouse-cursor.js" defer></script>
        <script src="js/rsed/ui/view.js" defer></script>
        <script src="js/rsed/ui/brush.js" defer></script>
        <script src="js/rsed/ui/draw.js" defer></script>
        <script src="js/rsed/ui/input.js" defer></script>
        <script src="js/rsed/render/line-draw.js" defer></script>
        <script src="js/rsed/render/ngon-fill.js" defer></script>
        <script src="js/rsed/resource-loader.js" defer></script>
        <script src="js/rsed/project.js" defer></script>
        <script src="js/rsed/rsed.js" defer></script>
        <script src="js/rsed/page.js" defer></script>
    </body>
</html>
