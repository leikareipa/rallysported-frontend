<!DOCTYPE html>
<html>
    <head>
		<meta name="viewport" content="width=device-width">
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="index.css">
        <link rel="stylesheet" type="text/css" href="index-responsive.css">
        <link rel="stylesheet" type="text/css" href="animations.css">
        <link href="https://fonts.googleapis.com/css?family=Catamaran|Permanent+Marker|Cabin|Montserrat" rel="stylesheet">
        <title>RallySportED (beta.10, web-beta.5)</title>
    </head>
    <body>
        <div id="html-ui" v-if="uiVisible" v-cloak>
            <span id="track-name-display">&ldquo;{{trackName.length? trackName : ""}}&rdquo;</span>

            <span class="button" onclick="Rsed.core.current_project().save_to_disk();"
                  style="background-color: white; color: black;">
                Save to disk
            </span>

            <a class="button" href="/rallysport-content/tracks/" target="_blank"
                  style="background-color: lightgray;
                         transform: none;
                         border-radius: 16px 2px 16px 16px;">
                More tracks
            </a>

            <div class="disclaimer">
                rallysported &copy; tarpeeksi hyvae soft. rally-sport &copy; jukka jäkälä.
                <a href="./userguide/" target="_blank" rel="noopener">user guide</a> &#9656;
            </div>

            <div id="prop-dropdown" class="dropdown-menu">
                <div class="item"
                     v-for="prop in propList"
                     v-on:click="activate_prop(prop.propName)">{{prop.propName}}</div>
            </div>
        </div>

        <div id="render_container" class="canvas_container"
             ondrop="window.drop_handler(event);" ondragover="event.preventDefault();">
             <canvas id="render-canvas" class="canvas"></canvas>
        </div>

        <div id="popup-notification-container"></div>

        <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
        <script src="./client/js/rallysported.cat.js" defer></script>
    </body>
</html>
