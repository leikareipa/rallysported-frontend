/*
 * Most recent known filename: js/misc/project.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 */

"use strict";

Rsed.project_n = (function()
{
    // Maximum number of characters allowed in the project file name.
    const maxProjectNameLen = 8;

    // The range of characters allowed in the project name; successively from the first character to
    // the last one.
    const projectNameCharset = Object.freeze(["a", "z"]);

    // Returns true if the given project name is valid; false is returned otherwise.
    function is_valid_project_name(name = "")
    {
        if (name.length <= 1)
        {
            alert("The RallySportED project name is too short");
            return false;
        }
        else if (name.length > maxProjectNameLen)
        {
            alert("The RallySportED project name '" + name + "' is too long. The maximum number of characters allowed is " + maxProjectNameLen + ".");
            return false;
        }

        for (let i = 0; i < name.length; i++)
        {
            if ((name[i] < projectNameCharset[0]) ||
                (name[i] > projectNameCharset[1]))
            {
                alert("The RallySportED project name '" + name + "' containts invalid characters. Only the characters " +
                      projectNameCharset[0] + "-" + projectNameCharset[1] + " are allowed.");
                return false;
            }
        }

        return true;
    }

    // Inserts the project's custom assets over any previous ones.
    function override_track_assets(dtaData)
    {
        Rsed.assert((dtaData instanceof ArrayBuffer), "Expected the project assets to come in as an array buffer.");
    
        Rsed.maasto_n.clear_maasto_data();
        Rsed.palat_n.clear_palat_data();
        Rsed.camera_n.reset_camera_position();

        // Extract the data from the project file.
        {
            let i = 0;
            const endianness = true;

            // MAASTO data.
            {
                const maastoBytesize = (new DataView(dtaData, i, 4).getUint32(0, endianness));
                i+=4;
                Rsed.assert(((i + maastoBytesize) <= dtaData.byteLength), "Was about to read project data out of bounds.");
                const maastoBytes = new Uint8Array(dtaData.slice(i, i + maastoBytesize));
                i+=maastoBytesize;

                Rsed.maasto_n.set_maasto_bytesize(maastoBytesize);
                resource_loader_n.load_maasto_data(maastoBytes, Rsed.maasto_n.set_maasto);
            }

            // VARIMAA data.
            {
                const varimaaBytesize = (new DataView(dtaData, i, 4).getUint32(0, endianness));
                i+=4;
                Rsed.assert(((i + varimaaBytesize) <= dtaData.byteLength), "Was about to read project data out of bounds.");
                const varimaaBytes = new Uint8Array(dtaData.slice(i, i+varimaaBytesize));
                i+=varimaaBytesize;

                Rsed.maasto_n.set_varimaa_bytesize(varimaaBytesize);
                resource_loader_n.load_varimaa_data(varimaaBytes, Rsed.maasto_n.set_varimaa);
            }

            // PALAT data.
            {
                const palatBytesize = (new DataView(dtaData, i, 4).getUint32(0, endianness));
                i+=4;
                Rsed.assert(((i + palatBytesize) <= dtaData.byteLength), "Was about to read project data out of bounds.");
                let palatBytes = new Uint8Array(dtaData.slice(i, i+palatBytesize));
                i+=palatBytesize;

                // Some versions of the project file have a PALAT block that's is missing the last 12 bytes.
                // If that's the case here, pad it out to the full 64k.
                if (palatBytesize === 65524)
                {
                    const pad = new Uint8Array(12);
                    const padded = new Uint8Array(12 + palatBytesize);
                    padded.set(palatBytes, 0);
                    padded.set(pad, palatBytesize);
                    palatBytes = padded;
                }
                else if (palatBytesize !== 65536)
                {
                    Rsed.assert(0, "Unexpected number of PALA bytes in the project file.");
                }

                Rsed.palat_n.set_palat_bytesize(palatBytesize);
                resource_loader_n.load_palat_data(palatBytes, Rsed.palat_n.add_pala);
            }
        }
    }

    const publicInterface = {};
    {
        // Will return true if the given project is valid. Otherwise, will throw an error.
        publicInterface.verify_project_validity = function(projectToVerify)
        {
            Rsed.assert((projectToVerify instanceof Rsed.project_n.project_o), "Was asked to test the validity of a non-RallySportED project.");

            Rsed.assert(((projectToVerify != null) && (projectToVerify.isValidProject)), "Failed to load the given zipped RallySportED project file.");
            Rsed.assert((projectToVerify.name != null && projectToVerify.displayName != null), "Failed to load the given zipped RallySportED project file.");

            console.log("'" + projectToVerify.displayName + "' is a valid RallySportED project.");

            return true;
        }

        // Creates a project memory object from a zip file containing the files of a RallySportED project.
        // NOTE: There can be only one active project at a time in RallySportED, so calling this will
        //       cause any existing project data to be overwritten by the new data.
        publicInterface.make_project_from_zip = function(locality = "local", zip, broadcastFn)
        {
            switch (locality)
            {
                case "local":
                {
                    resource_loader_n.load_project_data({fromZip:true,zipFile:zip}, (projectData)=>
                    {
                        /// Temp hack. Project loading will be redesigned in the future.
                        const project = new publicInterface.project_o(projectData);
                        Rsed.manifesto_n.apply_manifesto(project.manifestoFileContents)
                        .then(()=>{override_track_assets(projectData.dtaData); broadcastFn(project);});
                        return;
                    });

                    break;
                }
                case "server":
                {
                    resource_loader_n.load_binary_resource(zip, "rsed-project-zip", (zipFile)=>
                    {
                        resource_loader_n.load_project_data({fromZip:true,zipFile}, (projectData)=>
                        {
                            /// Temp hack. Project loading will be redesigned in the future.
                            const project = new publicInterface.project_o(projectData);
                            Rsed.manifesto_n.apply_manifesto(project.manifestoFileContents)
                            .then(()=>{override_track_assets(projectData.dtaData); broadcastFn(project);});
                            return;
                        });
                    });

                    break;
                }
                default: Rsed.assert(0, "Unknown RallySportED project zip file locality."); return null;
            }
        }

        publicInterface.generate_download_of_project = function(project = Rsed.project_n.project_o)
        {
            Rsed.assert((project instanceof Rsed.project_n.project_o), "Expected a RallySportED project object.");

            const saveName = project.name.toUpperCase();

            k_message("Saving project '" + project.displayName + "'.");

            if (project.projectFileContents == null)
            {
                k_message("The given project has empty contents. Skipping saving it.");
                return;
            }

            // Replace the existing project bytes with the current data.
            {
                const maastoBytes = Rsed.maasto_n.get_saveable_maasto();
                const varimaaBytes = Rsed.maasto_n.get_saveable_varimaa();
                const palatBytes = Rsed.palat_n.get_saveable_palat();

                project.projectFileContents.set(maastoBytes, 4);
                project.projectFileContents.set(varimaaBytes, (maastoBytes.byteLength + 4*2));
                project.projectFileContents.set(palatBytes, (maastoBytes.byteLength + varimaaBytes.byteLength + 4*3));
            }

            // Zip up the project file, and have the browser initiate a download of it.
            const zip = new JSZip();

           //zip.file(saveName + ".TXT", lut_readme_txt.replace(/%TRACK/g, project.name.toUpperCase()));
            zip.file(saveName + "/" + saveName + ".DTA", project.projectFileContents);
            zip.file(saveName + "/" + saveName + ".$FT", Rsed.manifesto_n.get_saveable_manifesto(project.manifestoFileContents));
            zip.file(saveName + "/" + "HITABLE.TXT", lut_hitable_txt);

            zip.generateAsync({type:"blob", compression:"DEFLATE", compressionOptions:{level: 1}})
            .then(function(blob)
            {
                saveAs(blob, saveName + ".ZIP");
            })
            .catch((error)=>{Rsed.assert(0, error);});
        }

        // Returns a project object of the given project data. Note that this will overwrite
        // any existing project data.
        publicInterface.project_o = function(projectData = {})
        {
            // The name of this project. Will be shown to the user on the page, and also in Rally-Sport
            // when the track is loaded in. Will also be used as the track's base filename. Its length must be
            // between 1 and 8 characters (A-Z only; case insensitive in that the first character will be
            // uppercased and the rest lowercased regardless of user-supplied casing).
            this.name = projectData.name;

            // The project name that will be displayed to the user in the web version of RallySportED. It can
            // be longer than 8 characters and contain characters other than A-Z. But note that in the DOS
            // version of RallySportED, as well as other versions possibly, this display name will not be
            // available, and they're likely to display the regular 8-character A-Z name, instead.
            this.displayName = projectData.displayName;

            // Stores a u8 byte array holding all of the bytes loaded from this project's DTA file.
            this.projectFileContents = new Uint8Array(projectData.dtaData);

            // The contents of this project's manifesto ($FT) file.
            this.manifestoFileContents = projectData.manifestoData;

            this.isValidProject = true;
        }
    }
    return publicInterface;
})();
