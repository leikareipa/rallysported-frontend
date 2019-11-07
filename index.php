<!DOCTYPE html>
<html>
    <head>
		<meta name="viewport" content="width=device-width">
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="index.css">
        <link rel="stylesheet" type="text/css" href="animations.css">
        <link href="https://fonts.googleapis.com/css?family=Catamaran|Permanent+Marker|Cabin|Montserrat" rel="stylesheet">
        <title>RallySportED (beta) by Tarpeeksi Hyvae Soft</title><?php include "stats.php"; ?>
    </head>
    <body>
        <div id="html-ui" v-if="uiVisible" v-cloak>
            <span id="track-name-display">{{trackName.length? (trackName + ".") : ""}}</span>

            <span class="button" onclick="Rsed.core.current_project().save_to_disk();"
                  style="color: rgb(0, 0, 0);
                         background-color: rgb(179, 112, 25);">
                save to disk
            </span>

            <a class="button" href="./track-list/" target="_blank" rel="noopener"
               style="font-variant: small-caps;
                      color: rgb(170, 170, 170);
                      background-color: rgb(87, 87, 87);">
                track listing &#9656;
            </a>

            <div class="disclaimer">
                rallysported by tarpeeksi hyvae soft. rally-sport by jukka jakala. no endorsements or warranties.
                <a href="./userguide/" target="_blank" rel="noopener">user guide</a> &#9656;
            </div>

            <div id="prop-dropdown" class="dropdown_list">
                <div style="background-color: rgb(224, 224, 224);
                            color: black;
                            padding-bottom: 10px;
                            padding-top: 10px;">set prop type</div>
                <div v-for="prop in propList" v-on:click="activate_prop(prop.propName)">{{prop.propName}}</div>
            </div>
        </div>

        <div id="render_container" class="canvas_container"
             ondrop="window.drop_handler(event);" ondragover="event.preventDefault();">
             <canvas id="render-canvas" class="canvas"></canvas>
        </div>

        <div id="popup-container" class="popup-container"></div>

        <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
        <script src="./client/js/rallysported.cat.js" defer></script>
    </body>
</html>
