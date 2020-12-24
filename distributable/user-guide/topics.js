/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: RallySportED-js
 * 
 * Defines RallySportED-js's user guide contents.
 * 
 */

"use strict";

export const helpTopics = [];

helpTopics["Introduction"] = `
    <p>
        RallySportED is a contemporary asset editor (modding tool) for the classic DOS-era
        racing game Rally-Sport.
    </p>
        
    <p>
        RallySportED-js is a JavaScript port of RallySportED, allowing you to create new
        Rally-Sport tracks in your browser!
    </p>

    <hr>

    <p>
        RallySportED is &copy; Tarpeeksi Hyvae Soft. Its source code is available on GitHub:
        <a href="https://github.com/leikareipa/rallysported">/rallysported</a>.
    </p>

    <p>
        Rally-Sport is &copy; Jukka Jäkälä. Mr. Jäkälä is not affiliated with RallySportED
        nor with Tarpeeksi Hyvae Soft.
    </p>

    <p>
        Any rights remain with their respective holders.
    </p>
`;

helpTopics["System requirements"] = `
    <p>
        RallySportED-js has the following system requirements:
    </p>

    <ul>
        <li>An up-to-date browser with JavaScript enabled (recommended: Google Chrome)</li>
        <li>A decent CPU (recommended: at least a mid-range machine bought within the last 4 yrs.)</li>
        <li>Mouse and keyboard (+ full-sized screen recommended)</li>
    </ul>

    <p>
        RallySportED-js is tested primarily in Linux, but should work just as well on Windows.
        You might find more problems on Apple's operating systems, since the developer has few
        or no Apple devices to test on.
    </p>
`;


helpTopics["Controls"] = `
    <h3>
        Mouse controls
    </h3>

    <ul>
        <li><b>Left click on ground</b>: 3D view: Move the ground up. Texture & tilemap editors: Draw.</li>
        <li><b>Right click on ground</b>: 3D view: Move the ground down. Texture & tilemap editors: Draw.</li>
        <li><b>Middle click on ground</b>: 3D view: Paint the ground with the currently-selected ground texture.</li>
        <li><b>Right click on prop</b>: 3D view: Change the prop's type.</li>
        <li><b>Left click & drag prop</b>: 3D view: Move the prop.</li>
        <li><b>Shift + wheel</b>: 3D view: Tilt the camera up/down. Texture editor: Zoom.</li>
        <li><b>Shift + left click on ground</b>: 3D view: Add a new prop.</li>
        <li><b>Shift + left click on prop</b>: 3D view: Remove the prop.</li>
        <li><b>Tab + left click</b>: Eyedropper tool.</li>
        <li><b>Tab + hover on ground texture pane</b>: Show the hovered texture's index value.</li>
    </ul>

    <h3>
        Keyboard controls
    </h3>

    <ul>
        <li><b>E S D F</b>: 3D view: Move the camera.</li>
        <li><b>1 2 3 4 5</b>: 3D view: Set the size of the ground-editing brush.</li>
        <li><b>L</b>: 3D view: Level the terrain to a given height.</li>
        <li><b>W</b>: 3D view: Toggle wireframe rendering on/off.</li>
        <li><b>B</b>: 3D view: Toggle prop visibility.</li>
        <li><b>T</b>: 3D view: Open the hovered texture in the texture editor.</li>
        <li><b>G</b>: 3D view: Show a preview under the cursor of the currently-selected ground texture.</li>
        <li><b>R</b>: Texture editor: Rotate the current texture.</li>
        <li><b>A</b>: Open/close the ground texture pane.</li>
        <li><b>Q</b>: Open/close the tilemap editor.</li>
        <li><b>Space</b>: 3D view: Toggle the ground-smoothing mode on/off (smoothens the ground instead of raising/lowering it).</li>
        <li><b>Up/down arrows</b>: 3D view: Raise/lower the ground by one where the mouse cursor is hovering.</li>
        <li><b>Ctrl + Z</b>: Undo your latest changes.</li>
        <li><b>Ctrl + Y</b>: Redo your latest changes.</li>
        <li><b>Ctrl + Shift + Z</b>: Redo your latest changes.</li>
        <li><b>Ctrl + C</b>: Texture editor: Copy the current texture onto the clipboard.</li>
        <li><b>Ctrl + V</b>: Texture editor: Paste the current texture from the clipboard.</li>
    </ul>
`;

helpTopics["Saving tracks"] = `
    <p>
        You'll find an option in the top left corner of the RallySportED-js UI's menu bar to
        download a copy of the current track.
    </p>
    
    <p>
        The download will be in the form of a ZIP archive containing the track's assets, as
        demonstrated below.
    </p>

    <img src="img/project-zip.png">

    <p>
        You can reload a saved track file by dragging it onto the RallySportED-js editor view, as
        described in <a href="http://localhost:8000/user-guide/#loading-a-track">this topic</a>.
    </p>
`;

helpTopics["Loading tracks"] = `
    <p>
        There are two ways to load a track for editing or viewing in RallySportED-js: (1) by using a
        URL parameter, and (2) by dragging a track archive file. The file-dragging method
        is intended for track files located on your system, while the URL parameter method is
        for tracks hosted on RallySportED's servers.
    </p>

    <p>
        The first way is to use a URL parameter. For a demonstration, check out

        <a href="https://www.tarpeeksihyvaesoft.com/rallysported/?track=democ">this link</a>.
        
        It appends the parameter <em>track</em> to the RallySportED-js URL to indicate that
        we want to load track #3 of the Rally-Sport demo ("democ" standing for "Demo C").
        You might use these demo tracks e.g. as a basis for your custom tracks &ndash; being
        mindful that they're under copyright to someone other than the RallySportED author and
        have not been licensed for this purpose.
    </p>

    <p>
        The second way is to drag a track archive file &ndash; which you got e.g. by
        exporting a track from RallySportED-js as described in <a href="http://localhost:8000/user-guide/#saving-a-track">
        this topic</a> &ndash; from your system onto the RallySportED-js editor view.
    </p>
`;

helpTopics["The Serve feature"] = `
    <p>
        Want to show a track of yours to a friend, but don't want the hassle of sending
        them a ZIP file? You can use the Serve feature to produce a temporary sharable URL.
    </p>

    <p>
        To enable Serve, follow these steps:
    </p>
    
    <ul>
        <li>Press the "Serve" button at the top left of the RallySportED-js UI. After a
        few seconds, sometimes a bit more, the button should display the text "Serving",
        and your browser's address bar should now contain a "transientServer" parameter.</li>
        <li>Copy the entire link from the address bar and give it to the people you want
        to share the track with. When they access this Serve URL, they'll get a copy of the
        track as it appers in your browser at that moment.</li>
    </ul>

    <p>
        A few things to keep in mind about the Serve feature:
    </p>
    
    <ul>
        <li>The Serve URL works only for as long as you've got the RallySportED-js browser
        tab open and are connected to the internet. Reloading or leaving the page will
        stop the Serve.</li>
        <li>Track data will be transferred using WebRTC technology directly from your browser
        &ndash; via your internet connection &ndash; to people accessing the Serve URL.</li>
        <li>Any changes you make to the track (including loading a new track with drag
        & drop) after starting to Serve will be visible to those with the Serve URL when
        they reload the page.</li>
        <li>Changes made to the track by a person accessing your Serve URL will affect only
        their local copy, not yours or anybody else's.</li>
    </ul>

    <p>
        To stop Serving, press the "Serving" button again. The "transientServer" parameter
        should disappear from your browser's address bar, and the Serve URL will no longer
        function. If you start Serving again, a new URL will be generated.
    </p>
`;

helpTopics["Tutorial: Creating a track"] = `
    <p>
        Here's a runner-downer on how to create a new Rally-Sport track with
        RallySportED!
    </p>

    <h3>
        1. Starting out
    </h3>

    <p>
        Making a new track with RallySportED always starts with loading in an
        existing track as a basis. Generally, this will be one of the eight tracks of the
        Rally-Sport demo.
    </p>

    <p>
        So to get started, load in Rally-Sport track #1 by using the <em>track</em> URL
        parameter, like shown

        <a href="https://www.tarpeeksihyvaesoft.com/rallysported/?track=demoa">
            in this link</a>.

    <p>
        When you direct your browser to that URL, RallySportED-js should load up the
        track and greet you with a view of something like this:
    </p>

    <img src="img/tut-start.png">

    <p>
        When you're ready to start editing, hit the L key on your keyboard to bring up the
        terrain-leveling prompt. The prompt's visual style will depend on your browser,
        but it should ask you for a height value to level the terrain to. Enter in '0'
        and select OK.
    </p>

    <img src="img/tut-level-terrain.png">

    <p>
        Having done so, you should be met with a fully flat terrain.
    </p>

    <p>
        Next, press the A key to bring up the texture-selection pane. It'll pop up on the
        right-hand side of the screen. In the pane, hover the mouse over the second
        texture thumbnail (grass) and click the left mouse button. As you do this, a
        solid yellow rectangle should appear on the thumbnail to indicate that this
        texture is now selected.
    </p>

    <img src="img/tut-pala1.png">

    <p>
        Now press A again to close the texture pane, then Q to open the top-down tilemap
        view. This is a bird's eye view of the track, useful for laying down large-scale
        features, like roads. Press the 5 key to
        select the largest brush size (you'll see a number change on the upper right of
        the screen to reflect this), then click and hold the middle mouse button while
        you drag the cursor across the 2D map. You should see the map fill up with green.
        Fill it up fully, then press the Q key to return to the ground view.
    </p>

    <img src="img/tut-paintview.png">

    <p>
        (Note that there will always be a large white pixel visible in the tilemap view
        that you can't erase. It won't be visible on the actual track; rather, it represents
        the track's checkpoint &ndash; the point near which your car must pass for the lap to
        be counted as valid. You'll always want your road to pass over or close to this
        point, as you can see the game's original tracks doing.)
    </p>

    <p>
        Once back in the ground view, move the camera over to the finish line, which looks
        like the picture below. When you've found it, open the texture pane again (A), and
        while holding down Tab to see the hovered-over texture thumbnail's index value,
        select texture #96 (gravel). Set your brush radius to 1 (hit the 1 key). With the
        middle mouse button, draw a line under the finish line, like in the image below.
        If you mess up, just hit Ctrl + Z to undo the mistake (Ctrl + Shift + Z redoes
        it).
    </p>

    <img src="img/tut-startmark.png">

    <p>
        When you now open the tilemap view (Q) again, you'll see a lot of green but also
        a brown horizontal line. This is a temporary visual aid for you that tells you
        where the finish line is, for when you're laying down the road.
    </p>

    <h3>
        2. Laying the road
    </h3>
    
    <p>
        While you have the gravel texture (texture #96) selected and the tilemap view
        open, press the 2 key to get a slightly enlarged brush size, then draw a road
        onto the map, starting at the finish line, snaking around the area, and winding
        back at the finish line.
    </p>

    <img src="img/tut-roadlay.png">

    <p>
        Returning to the ground view (Q), you can see that there's now a road going
        through your scenery. Problem is, the road doesn't look smooth: it has a
        pixelated, staircasey appearance. To fix this, open the texture pane and look
        through it. You'll see a bunch of tiles with variously-angled slabs of gravel.
        With these textures, you can smooth out the edges of your road. It's a bit of manual
        labor, but suck it up. Below, you can see some 45-degree road tiles having been
        put down.
    </p>

    <img src="img/tut-curvesmooth.png">

    <h3>
        3. Decorating the terrain
    </h3>

    <p>
        Now that there's a road going on, even if you didn't yet smooth it all out, you
        can add some surface decorations to make the thing more interesting to drive around on.
    </p>

    <p>
        The first thing you might do is manipulate the height of the terrain to create
        hills, dips, and so on. Just use the left and right mouse buttons to rough up the
        terrain some. Below, I've added some ground details.
    </p>
    
    <img src="img/tut-groundshape.png">

    <p>
        The next bit of detail you might put in are spectators, human models
        that stand around waving as you drive past. To add them in, open the
        texture-selection pane (A) and select texture #240. Press G and move the cursor
        over the ground. You should see a spectator pop up on the tile over which the
        cursor is hovering. When you apply the texture (middle click), a spectator will
        be stood there. Experiment with textures #240 and up &ndash; there's bushes and
        wooden poles in there, too.
    </p>

    <img src="img/tut-billboards.png">

    <p>
        <b>Tip 1:</b> If you're not happy with the default Rally-Sport textures, you can
        hover the cursor over a texture and press the T key to open the texture editor.
    </p>

    <p>
        <b>Tip 2:</b> Any ground tile painted with texture #0 is considered by Rally-Sport a
        water tile. In-game, water tiles form a smooth surface of a pre-determined height,
        while the tiles' actual heights determine how deep the water is when driven into. To
        see water tiles' actual heights in RallySportED-js, use the W key to enable the
        wireframe mode. To see how the tiles would look in-game, disable the wireframe mode.
    </p>

    <h3>
        4. Testing the track in Rally-Sport
    </h3>

    <p>
        Having put in a few bits and bobs, you might want to give the track a
        test drive. To do that, locate and click the "Download" button at the top left
        corner of the RallySportED-js page. Your browser should then serve you a ZIP file
        called DEMOA.ZIP, which contains the data files required to play the track in
        Rally-Sport.
    </p>

    <p>
        If you don't already have the Rally-Sport demo on your computer, you'll need to
        get it. First, download the desktop version of RallySportED from
        
        <a href="http://www.tarpeeksihyvaesoft.com/soft/">
            Tarpeeksi Hyvae Soft's website</a>,
            
        then extract the RALLYS.ZIP file that comes with it into a folder called
        C:\\RALLYS (or some other name, this one is just for convenience). Extract the
        RallySportED files into C:\\RALLYS, as well.
    </p>

    <p>
        Now that you have Rally-Sport and RallySportED set up, extract the DEMOA.ZIP file
        into C:\\RALLYS so that the track's files come to be under C:\\RALLYS\\DEMOA\\.
        Then browse into C:\\RALLYS (in DOS or DOSBox), type "RLOAD DEMOA", and
        Rally-Sport should launch itself. From the game's main menu, select to start the
        race.
    </p>

    <img src="img/tut-playing.png">

    <p>
        From this point on, you'd go back to RallySportED-js to make some changes to the
        track, test it again in-game to verify that it's still fun to drive, and rinse
        and repeat until you have a track you don't mind calling finished.
    </p>

    <h3>
        5. Adding an AI opponent
    </h3>

    <p>
        One of the things you might notice when you play your new track in Rally-Sport is
        that the CPU opponent doesn't seem aware of the changes you've made to the track.
        For instance, it might obliviously keep driving off the road or fail to avoid
        obstacles you've put in. Well, we can fix this by using the RAI tool that comes
        with the desktop version of RallySportED (which we installed earlier as part of
        this tutorial).
    </p>

    <p>
        The RAI tool must be run under DOS (or in DOSbox). If you set up the desktop
        version of RallySportED as described above, you'll already have RAI in
        C:\\RALLYS. So you can navigate there, enter the command "RAI DEMOA", and now
        Rally-Sport should pop up in a special "recording" mode.
    </p>

    <img src="img/tut-rai-recording.png">

    <p>
        What you're seeing is the same as when you normally play the track in
        Rally-Sport, but now you have "Recording" written across the bottom of the
        screen. The gist of this is that RallySportED will record the lap you race
        and save it as the track's CPU opponent.
    </p>
    
    <p>
        So just drive the lap normally, and once the race finishes, press the space key to
        quit back to the command prompt, where RAI should tell you that it succeeded in
        creating the new CPU opponent.
    </p>
    
    <p>
        The new CPU opponent will have been saved into the track's DTA file under
        C:\\RALLYS\\DEMOA. You'll want to update the track's ZIP file with the new
        DTA file, then drag the updated ZIP into RallySportED-js to let it know of the
        changes. Otherwise, when you save the track again in RallySportED-js, you'd
        revert back to the original CPU opponent.
    </p>
`;
