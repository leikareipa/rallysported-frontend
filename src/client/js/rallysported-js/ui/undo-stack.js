/*
 * Most recent known filename: js/ui/undo-stack.js
 *
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * Software: RallySportED-js
 *
 */

"use strict";

// An undo/redo system.
//
// The system keeps track of the user's track edits (like altering ground height, moving
// props, etc.), and stores them in 'undo levels'.
//
// An undo level starts when the user makes an edit, and ends when they release all mouse
// buttons (it's assumed that only mouse buttons can be used to make track edits). This
// undo level will then consist of any track edits the user made in that time.
//
// To undo the most recent edits, you'd call undo(). And, provided that the user hasn't
// made any new edits since that call to undo(), you can re-do the edits by calling redo().
//
// Making new edits after calling undo() will cause the undo levels above it to be erased
// and replaced with one or more new levels reflecting the new edits.
Rsed.ui.undoStack = (function()
{
    // While true, no new new undo levels can be added.
    let frozen = false;

    // We'll use a timer (setInterval()) to decide when to seal the current undo level
    // once it has been created.
    let timerId = null;

    // Track data as it were before the current undo level for any track elements
    // that are modified by this undo level.
    let dirtyGround = [];
    let dirtyProps = [];
    let dirtyTextures = [];

    // We'll keep track of which undo level's data has been saved so RallySportED-js
    // can indicate to the user whether the project's current state is saved or not.
    let lastSavedUndoLevelId = undefined;

    // All undo levels we've recorded since they were last reset. Note that if the user
    // undoes and then makes new changes, the undo levels above that point will be
    // replaced with new undo levels that reflect the new changes.
    const undoLevels = [];

    // The index in 'undoLevels' that we're currently at. If the user hasn't undone
    // anything, this will be the total count of undo levels; otherwise, this is moved
    // back (down) each time the user undoes, and forward (up) when the user redoes.
    let undoLevelHead = 0;

    function create_undo_level()
    {
        // If we already have an active group.
        if (timerId !== null)
        {
            return;
        }

        timerId = setInterval(seal_undo_level, 1);
    }

    // Marks all changes made since starting the current undo level as
    // belonging to that undo level.
    function seal_undo_level()
    {
        if (!timerId)
        {
            Rsed.throw("Attempting to seal a nonexistent undo level.");
        }

        if (Rsed.ui.inputState.mouse_button_down())
        {
            return;
        }

        clearInterval(timerId);
        timerId = null;

        undoLevels.length = (undoLevelHead + 1);

        // Ground data after this undo level's changes are made.
        const groundAfter = [];
        for (tile of Object.keys(dirtyGround))
        {
            const x = dirtyGround[tile].x;
            const y = dirtyGround[tile].y;

            groundAfter[tile] = {
                x,
                y,
                height: Rsed.$currentProject.maasto.tile_at(x, y),
                palaIdx: Rsed.$currentProject.varimaa.tile_at(x, y),
            };
        }

        // Prop data after this undo level's changes are made.
        const propsAfter = Rsed.$currentProject.props.locations_of_props_on_track(Rsed.$currentProject.trackId);

        // Texture data after this undo level's changes are made.
        const texturesAfter = [];
        for (textureId of Object.keys(dirtyTextures))
        {
            // We expect the texture id to be of the form "<type> <value>", e.g.
            // "palat 97" for PALA texture #97.
            const [textureType, textureIndex] = textureId.split(" ");

            texturesAfter[textureId] = Rsed.$currentProject[textureType].texture[textureIndex];
        }

        undoLevels[undoLevelHead] = {
            id: Rsed.uuid.generate_v4(),
            before: {
                ground: dirtyGround,
                props: dirtyProps,
                textures: dirtyTextures,
            },
            after: {
                ground: groundAfter,
                props: propsAfter,
                textures: texturesAfter,
            }
        };

        undoLevelHead++;

        dirtyGround = [];
        dirtyProps = [];
        dirtyTextures = [];


        // Let the user know that they have unsaved changes.
        Rsed.ui.htmlUI.refresh();
    }

    // Undo the changes in the current undo level if when == "before", or redo
    // the current undo level's changes if when == "after".
    function apply_undo_level(undoLevel, when = "before")
    {
        const targetProject = Rsed.$currentProject;

        if (!undoLevel)
        {
            return;
        }
        
        // Don't allow undo while an action group is being recorded.
        if (timerId !== null)
        {
            return;
        }

        frozen = true;

        // Undo on ground tiles.
        for (tile of Object.keys(undoLevel[when].ground))
        {
            targetProject.maasto.set_tile_value_at(undoLevel[when].ground[tile].x,
                                                   undoLevel[when].ground[tile].y,
                                                   undoLevel[when].ground[tile].height);

            targetProject.varimaa.set_tile_value_at(undoLevel[when].ground[tile].x,
                                                    undoLevel[when].ground[tile].y,
                                                    undoLevel[when].ground[tile].palaIdx);
        }

        // Undo on props.
        if (undoLevel[when].props.length)
        {
            const trackId = targetProject.trackId;

            targetProject.props.set_count__loader_v5(trackId, undoLevel[when].props.length);

            for (let i = 0; i < undoLevel[when].props.length; i++)
            {
                targetProject.props.set_prop_location(trackId, i, {
                    x: undoLevel[when].props[i].x,
                    y: undoLevel[when].props[i].y,
                    z: undoLevel[when].props[i].z,
                });

                targetProject.props.change_prop_type(trackId, i, undoLevel[when].props[i].propId);
            }
        }

        // Undo on textures.
        for (textureId of Object.keys(undoLevel[when].textures))
        {
            // We expect the texture id to be of the form "<type> <value>", e.g.
            // "palat 97" for PALA texture #97.
            const [textureType, textureIndex] = textureId.split(" ");

            // Update the texture's data. We'll get back a reference to the updated
            // texture object.
            const updatedTexture = targetProject[textureType]
                                   .copy_texture_data(Number(textureIndex),
                                                      undoLevel[when].textures[textureId]);

            // The texture-editing view doesn't automatically update its texture
            // reference, so we'll need to let it known the texture has changed.
            if (Rsed.$currentScene == Rsed.scenes["texture-editor"])
            {
                Rsed.scenes["texture-editor"].set_texture(updatedTexture);
            }
        }

        frozen = false;
    }

    const publicInterface =
    {
        is_current_undo_level_saved: function()
        {
            return (lastSavedUndoLevelId === publicInterface.current_undo_level_id());
        },

        mark_current_undo_level_as_saved: function()
        {
            lastSavedUndoLevelId = publicInterface.current_undo_level_id();
        },

        current_undo_level_id: function()
        {
            return (undoLevels[undoLevelHead - 1]? undoLevels[undoLevelHead - 1].id : undefined);
        },

        // Removes all undo levels.
        reset: function()
        {
            frozen = false;

            timerId = null;

            dirtyGround = [];
            dirtyProps = [];
            dirtyTextures = [];
        
            undoLevels.length = 0;
            undoLevelHead = 0;
            lastSavedUndoLevelId = undefined;
        },

        // Undoes the latest level.
        undo: function()
        {
            if (frozen || Rsed.ui.inputState.mouse_button_down())
            {
                return;
            }

            // If no more undo levels.
            if (undoLevelHead <= 0)
            {
                return;
            }

            undoLevelHead--;

            apply_undo_level(undoLevels[undoLevelHead], "before");

            Rsed.ui.htmlUI.refresh();
        },

        // Redoes the latest level.
        redo: function()
        {
            if (frozen || Rsed.ui.inputState.mouse_button_down())
            {
                return;
            }

            // If no more undo levels.
            if (undoLevelHead >= undoLevels.length)
            {
                return;
            }

            apply_undo_level(undoLevels[undoLevelHead], "after");
            undoLevelHead++;

            Rsed.ui.htmlUI.refresh();
        },

        // For the given XY ground tile, marks its height and texture index at
        // the beginning of the current undo level.
        mark_dirty_ground_tile: function(x = 0, y = 0)
        {
            Rsed.throw_if_not_type("number", x, y);

            if (frozen || Rsed.$currentProject.isPlaceholder)
            {
                return;
            }

            create_undo_level();

            if (typeof dirtyGround[`${x} ${y}`] === "undefined")
            {
                dirtyGround[`${x} ${y}`] = {
                    x,
                    y,
                    height: Rsed.$currentProject.maasto.tile_at(x, y),
                    palaIdx: Rsed.$currentProject.varimaa.tile_at(x, y),
                };
            }
        },

        // Stores all of the current track's prop info at the beginning of the
        // current undo level.
        mark_dirty_props: function()
        {
            if (frozen || Rsed.$currentProject.isPlaceholder)
            {
                return;
            }

            // If we've already stored the prop info for the current undo level.
            if (dirtyProps.length)
            {
                return;
            }

            create_undo_level();

            dirtyProps = Rsed.$currentProject.props.locations_of_props_on_track(Rsed.$currentProject.trackId);
        },

        // Stores the data of the given texture at the beginning of the current undo
        // level.
        mark_dirty_texture: function(textureType = "", palaIdx = 0)
        {
            if (frozen || Rsed.$currentProject.isPlaceholder)
            {
                return;
            }

            Rsed.throw_if_not_type("number", palaIdx);

            if (!["props", "palat"].includes(textureType))
            {
                Rsed.throw("Unknown texture type.");
            }

            create_undo_level();

            if (typeof dirtyTextures[`${textureType} ${palaIdx}`] === "undefined")
            {
                dirtyTextures[`${textureType} ${palaIdx}`] = Rsed.$currentProject[textureType].texture[palaIdx];
            }
        },
    };

    publicInterface.reset();

    return publicInterface;
})();
