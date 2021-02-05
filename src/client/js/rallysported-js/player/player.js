/*
 * Most recent known filename: js/player/player.js
 *
 * 2021 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

Rsed.player = (function()
{
    let isPlayerStarting = false;
    let isPlaying = false;
    let jsDosController = null;

    const playerContainer = document.getElementById("jsdos-container");
    const playerCanvas = document.getElementById("jsdos-canvas");
    const stopButton = document.getElementById("stop-jsbox-button");

    Rsed.assert && (playerCanvas &&
                    playerContainer &&
                    stopButton)
                || Rsed.throw("Malformed DOM for the player elements.");

    const publicInterface = {
        is_playing: function()
        {
            return isPlaying;
        },

        stop: stop_jsbox,

        play: async function(withAI = false)
        {
            if (!(await start_jsbox(withAI)))
            {
                stop_jsbox();
            }
        },
    };

    return publicInterface;

    function stop_jsbox() 
    {
        if (jsDosController)
        {
            jsDosController.exit();
        }

        jsDosController = null;
        isPlayerStarting = false;
        isPlaying = false;
        playerContainer.style.display = "none";
        playerCanvas.getContext("2d").clearRect(0, 0, playerCanvas.width, playerCanvas.height);

        Rsed.ui.htmlUI.refresh();

        return;
    }

    async function start_jsbox(playWithAI = false)
    {
        // Don't allow more than one instance of the player.
        if (isPlayerStarting ||
            jsDosController)
        {
            return;
        }

        isPlayerStarting = true;
        stopButton.style.display = "none";
        playerContainer.style.display = "initial";

        const gameZip = await create_zip_for_jsbox();

        if (!gameZip)
        {
            Rsed.ui.popup_notification("Couldn't start the DOSBox player.", {
                notificationType: "error",
            });

            return false;
        }

        const options = {
            wdosboxUrl: "./js-dos/wdosbox.js",
            onerror: (error)=>{
                window.alert(error);
                stop_jsbox();
            },
        };

        Dos(playerCanvas, options)
        .ready(function (fileSystem, main) {
            fileSystem.extract(URL.createObjectURL(gameZip))
            .then(()=>{
                main(["-conf", "rsed.conf",
                      "-c", `bitset game.dta 35 ${playWithAI? 0 : 32}`, // Refer to https://github.com/leikareipa/rallysported/blob/master/docs/rs-formats.txt on GAME.DTA's bytes.
                      "-c", `bitset rallye.exe 82253 ${playWithAI? 224 : 69}`, // Make the starting lights go out faster if not playing with AI.
                      "-c", `rload ${Rsed.core.current_project().name}`])
                .then((interface)=>{
                    jsDosController = interface;
                    isPlaying = true;
                    stopButton.style.display = "initial";
                });
            });
        });

        return true;
    }

    async function create_zip_for_jsbox()
    {
        const zip = new JSZip();
        const baseArchive = await fetch("./js-dos/data/rallys-rsed.zip");

        if (!baseArchive.ok)
        {
            return false;
        }

        await zip.loadAsync(baseArchive.blob());
        await Rsed.core.current_project().insert_project_data_into_zip(zip);

        return await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 1,
            },
        });
    }
})();
