// WHAT: Concatenated JavaScript source files
// PROGRAM: RallySportED-JS
// VERSION: live
// AUTHOR: Tarpeeksi Hyvae Soft and others
// FILES:
//	../js/rsed/rallysported.js
//	../distributable/assets/hitable.txt.js
//	../js/rsed/misc/common.js
//	../js/rsed/visual/color.js
//	../js/rsed/visual/texture.js
//	../js/rsed/visual/palette.js
//	../js/rsed/transform/geometry.js
//	../js/rsed/transform/matrix44.js
//	../js/rsed/transform/poly-transform.js
//	../js/rsed/render/camera.js
//	../js/rsed/render/renderer.js
//	../js/rsed/render/render-surface.js
//	../js/rsed/track/maasto.js
//	../js/rsed/track/palat.js
//	../js/rsed/track/props.js
//	../js/rsed/track/manifesto.js
//	../js/rsed/ui/font.js
//	../js/rsed/ui/cursor.js
//	../js/rsed/ui/view.js
//	../js/rsed/ui/brush.js
//	../js/rsed/ui/draw.js
//	../js/rsed/ui/input.js
//	../js/rsed/render/line-draw.js
//	../js/rsed/render/ngon-fill.js
//	../js/rsed/file/resource-loader.js
//	../js/rsed/misc/project.js
//	../js/rsed/rsed.js
//	../js/rsed/misc/window.js
/////////////////////////////////////////////////

/*
 * Most recent known filename: js/rallysported.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

// Top-level namespace for RallySportED.
const Rsed = {};
/*
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 * 
 */

"use strict";

// The contents of Rally-Sport's default HITABLE.TXT file.
const lut_hitable_txt =[0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x33,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x33,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,
                        0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x32,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,
                        0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,
                        0x20,0x20,0x30,0x32,0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x33,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x33,0x3a,0x33,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x34,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x34,
                        0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x35,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x33,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x33,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,
                        0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x32,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,
                        0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,
                        0x20,0x20,0x30,0x32,0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x33,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x33,0x3a,0x33,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x34,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x34,
                        0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x35,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x34,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x34,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x32,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x32,
                        0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x32,0x3a,0x34,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,
                        0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,
                        0x20,0x20,0x30,0x33,0x3a,0x32,0x30,0x3a,0x30,0x30,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x34,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x34,0x3a,0x34,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x35,0x3a,0x32,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x36,
                        0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x36,0x3a,0x34,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x31,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x31,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x32,0x3a,0x32,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x33,
                        0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x34,0x3a,0x34,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,
                        0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,
                        0x20,0x20,0x30,0x35,0x3a,0x35,0x30,0x3a,0x30,0x30,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x37,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x38,0x3a,0x31,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x39,0x3a,0x32,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x31,0x30,
                        0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x31,0x31,0x3a,0x34,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x30,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x32,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x33,
                        0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x34,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,
                        0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,
                        0x20,0x20,0x30,0x35,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x36,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x37,0x3a,0x30,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x38,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x39,
                        0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x31,0x30,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x32,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x32,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x34,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,
                        0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x31,0x3a,0x32,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,
                        0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,
                        0x20,0x20,0x30,0x31,0x3a,0x34,0x30,0x3a,0x30,0x30,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x32,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x32,0x3a,0x32,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x32,0x3a,0x34,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x33,
                        0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x33,0x3a,0x32,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x30,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x32,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x33,
                        0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x34,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,
                        0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,
                        0x20,0x20,0x30,0x35,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x36,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x37,0x3a,0x30,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x38,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x39,
                        0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x31,0x30,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x33,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x30,0x3a,0x33,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x31,
                        0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x32,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,
                        0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,
                        0x20,0x20,0x30,0x32,0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,
                        0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
                        0x20,0x20,0x20,0x20,0x30,0x33,0x3a,0x30,0x30,0x3a,0x30,0x30,
                        0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,
                        0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x33,0x3a,0x33,0x30,0x3a,
                        0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,
                        0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x34,0x3a,0x30,
                        0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,0x6e,0x69,
                        0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,0x30,0x34,
                        0x3a,0x33,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x41,0x2d,0x4a,0x75,
                        0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,0x20,0x20,0x20,0x20,
                        0x30,0x35,0x3a,0x30,0x30,0x3a,0x30,0x30,0x0d,0x0a,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,
                        0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x2d,0x0d,0x0a];
  /*
 * Most recent known filename: js/misc/common.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Various functions that may (or might not) be used across the program.
 *
 */

"use strict";

function k_assert(condition = false, explanation = "(no reason given)")
{
    if (!condition)
    {
        rsed_n.incapacitate_rallysported(explanation);
        alert("RallySportED assertion failure. " + explanation);
        throw Error("RallySportED assertion failure: " + explanation);
    }
}

// Send out a user-facing message.
function k_message(message = "")
{
    console.log(message);
}

// Displays a popup notification to the user. Doesn't take user input. Not guaranteed to be modal.
function k_popup(message = "")
{
    /// Temp hack. A modifier's status will stick if the key is releasd while a modal popup is open,
    /// so just clear them all in advance.
    ui_input_n.reset_modifier_key_statuses();

    window.alert(message);
}

// Linear interpolation.
function k_lerp(x = 0, y = 0, interval = 0)
{
    return (x + (interval * (y - x)));
}

function k_clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}/*
 * Most recent known filename: js/color.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 */

"use strict";

const color_n = (function()
{
    const publicInterface = {};
    {
        // Red, green, blue, alpha.
        publicInterface.rgba_o = function(r = 55, g = 55, b = 55, a = 255)
        {
            k_assert((((r >= 0) && (r <= 255)) &&
                      ((g >= 0) && (g <= 255)) &&
                      ((b >= 0) && (b <= 255)) &&
                      ((a >= 0) && (a <= 255))), "The given color values are out of range.");

            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            
            // Returns the color as a "#rrggbb" string. Ignores alpha.
            this.to_hex = function()
            {
                const hex_value = function(value)
                {
                    return (((value < 10)? "0" : "") + value.toString(16));
                };

                return ("#" + hex_value(this.r) + hex_value(this.g) + hex_value(this.b));
            }
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/texture.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 */

"use strict";

const texture_n = (function()
{
    const publicInterface = {};
    {
        publicInterface.texture_o = function(width = 0, height = 0, pixels = [color_n.rgba_o])
        {
            this.width = width;
            this.height = height;

            // If set to true, any pixel in the texture whose palette index is 0 is considered
            // see-through and won't be drawn when rendering.
            this.hasAlpha = false;

            // For each pixel, a matching index in Rally-Sport's palette.
            this.paletteIndices = [];

            this.pixels = [];
            for (let i = 0; i < (width * height); i++)
            {
                k_assert((pixels[i] instanceof color_n.rgba_o), "Expected a color object.");
                this.pixels.push(new color_n.rgba_o(pixels[i].r, pixels[i].g, pixels[i].b, pixels[i].a));
            }
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/palette.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * Rally-Sport's four VGA mode 13h palettes.
 *
 */

"use strict";

const palette_n = (function()
{
    // There are four palettes in the game. This decides which of them is currently active.
    let currentPalette = 0;

    const palettes = [];

    const publicInterface = {};
    {
        // Re-initializes the palettes to their original values.
        publicInterface.reset_palettes = function()
        {
            palettes.length = 0;

            palettes.push([ new color_n.rgba_o(0, 0, 0, 255),
                            new color_n.rgba_o(8, 64, 16, 255),
                            new color_n.rgba_o(16, 96, 36, 255),
                            new color_n.rgba_o(24, 128, 48, 255),
                            new color_n.rgba_o(252, 0, 0, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(192, 192, 192, 255),
                            new color_n.rgba_o(128, 128, 128, 255),
                            new color_n.rgba_o(64, 64, 64, 255),
                            new color_n.rgba_o(0, 0, 252, 255),
                            new color_n.rgba_o(72, 128, 252, 255),
                            new color_n.rgba_o(208, 100, 252, 255),
                            new color_n.rgba_o(208, 72, 44, 255),
                            new color_n.rgba_o(252, 112, 76, 255),
                            new color_n.rgba_o(16, 96, 32, 255),
                            new color_n.rgba_o(32, 192, 64, 255),
                            new color_n.rgba_o(228, 56, 244, 255),
                            new color_n.rgba_o(132, 36, 172, 255),
                            new color_n.rgba_o(68, 92, 252, 255),
                            new color_n.rgba_o(252, 252, 48, 255),
                            new color_n.rgba_o(32, 32, 32, 255),
                            new color_n.rgba_o(152, 48, 24, 255),
                            new color_n.rgba_o(80, 24, 12, 255),
                            new color_n.rgba_o(124, 124, 24, 255),
                            new color_n.rgba_o(128, 0, 0, 255),
                            new color_n.rgba_o(12, 20, 132, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(136, 28, 128, 255),
                            new color_n.rgba_o(16, 252, 8, 255)]);

            palettes.push([ new color_n.rgba_o(0, 0, 0, 255),
                            new color_n.rgba_o(80, 88, 104, 255),
                            new color_n.rgba_o(96, 104, 120, 255),
                            new color_n.rgba_o(112, 128, 144, 255),
                            new color_n.rgba_o(252, 0, 0, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(192, 192, 192, 255),
                            new color_n.rgba_o(128, 128, 128, 255),
                            new color_n.rgba_o(64, 64, 64, 255),
                            new color_n.rgba_o(0, 0, 252, 255),
                            new color_n.rgba_o(72, 128, 252, 255),
                            new color_n.rgba_o(208, 100, 252, 255),
                            new color_n.rgba_o(208, 72, 44, 255),
                            new color_n.rgba_o(252, 112, 76, 255),
                            new color_n.rgba_o(8, 136, 16, 255),
                            new color_n.rgba_o(32, 192, 64, 255),
                            new color_n.rgba_o(228, 56, 244, 255),
                            new color_n.rgba_o(132, 36, 172, 255),
                            new color_n.rgba_o(68, 92, 252, 255),
                            new color_n.rgba_o(252, 252, 48, 255),
                            new color_n.rgba_o(32, 32, 32, 255),
                            new color_n.rgba_o(152, 48, 24, 255),
                            new color_n.rgba_o(80, 24, 12, 255),
                            new color_n.rgba_o(124, 124, 24, 255),
                            new color_n.rgba_o(128, 0, 0, 255),
                            new color_n.rgba_o(12, 20, 132, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(136, 28, 128, 255),
                            new color_n.rgba_o(16, 252, 8, 255)]);

            palettes.push([ new color_n.rgba_o(0, 0, 0, 255),
                            new color_n.rgba_o(72, 20, 12, 255),
                            new color_n.rgba_o(144, 44, 20, 255),
                            new color_n.rgba_o(168, 56, 28, 255),
                            new color_n.rgba_o(252, 0, 0, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(192, 192, 192, 255),
                            new color_n.rgba_o(128, 128, 128, 255),
                            new color_n.rgba_o(64, 64, 64, 255),
                            new color_n.rgba_o(0, 0, 252, 255),
                            new color_n.rgba_o(72, 128, 252, 255),
                            new color_n.rgba_o(208, 100, 252, 255),
                            new color_n.rgba_o(208, 72, 44, 255),
                            new color_n.rgba_o(252, 112, 76, 255),
                            new color_n.rgba_o(16, 96, 32, 255),
                            new color_n.rgba_o(32, 192, 64, 255),
                            new color_n.rgba_o(228, 56, 244, 255),
                            new color_n.rgba_o(132, 36, 172, 255),
                            new color_n.rgba_o(68, 92, 252, 255),
                            new color_n.rgba_o(252, 252, 48, 255),
                            new color_n.rgba_o(32, 32, 32, 255),
                            new color_n.rgba_o(152, 48, 24, 255),
                            new color_n.rgba_o(80, 24, 12, 255),
                            new color_n.rgba_o(124, 124, 24, 255),
                            new color_n.rgba_o(128, 0, 0, 255),
                            new color_n.rgba_o(12, 20, 132, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(136, 28, 128, 255),
                            new color_n.rgba_o(16, 252, 8, 255)]);

            palettes.push([ new color_n.rgba_o(0, 0, 0, 255),
                            new color_n.rgba_o(28, 52, 8, 255),
                            new color_n.rgba_o(64, 64, 16, 255),
                            new color_n.rgba_o(80, 84, 28, 255),
                            new color_n.rgba_o(252, 0, 0, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(192, 192, 192, 255),
                            new color_n.rgba_o(128, 128, 128, 255),
                            new color_n.rgba_o(64, 64, 64, 255),
                            new color_n.rgba_o(0, 0, 252, 255),
                            new color_n.rgba_o(72, 128, 252, 255),
                            new color_n.rgba_o(208, 100, 252, 255),
                            new color_n.rgba_o(208, 72, 44, 255),
                            new color_n.rgba_o(252, 112, 76, 255),
                            new color_n.rgba_o(32, 64, 32, 255),
                            new color_n.rgba_o(64, 128, 64, 255),
                            new color_n.rgba_o(228, 56, 244, 255),
                            new color_n.rgba_o(132, 36, 172, 255),
                            new color_n.rgba_o(68, 92, 252, 255),
                            new color_n.rgba_o(252, 252, 48, 255),
                            new color_n.rgba_o(32, 32, 32, 255),
                            new color_n.rgba_o(152, 48, 24, 255),
                            new color_n.rgba_o(80, 24, 12, 255),
                            new color_n.rgba_o(124, 124, 24, 255),
                            new color_n.rgba_o(128, 0, 0, 255),
                            new color_n.rgba_o(12, 20, 132, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(252, 252, 252, 255),
                            new color_n.rgba_o(136, 28, 128, 255),
                            new color_n.rgba_o(16, 252, 8, 255)]);
        }
        // Set new r,g,b values for the given palette entry in the currently-active palette.
        publicInterface.modify_palette_entry = function(paletteIdx, r, g, b)
        {
            k_assert((paletteIdx >= 0 && paletteIdx < palettes[currentPalette].length));

            palettes[currentPalette][paletteIdx].r = r;
            palettes[currentPalette][paletteIdx].g = g;
            palettes[currentPalette][paletteIdx].b = b;
        }

        publicInterface.set_palette_for_track = function(trackId = 0)
        {
            k_assert(((trackId >= 1) && (trackId <= 8)), "Trying to set palette for a track index out of bounds.");

            switch (trackId)
            {
                case 1:
                case 2:
                case 3:
                case 4:
                case 6:
                case 7: currentPalette = 0; break;
                case 5: currentPalette = 1; break;
                case 8: currentPalette = 3; break;
                default: k_assert(0, "Unknown track id for setting a palette."); break;
            }
        }

        publicInterface.palette_idx_to_rgba = function(idx = 0)
        {
            if (palettes.length === 0) return new color_n.rgba_o(0, 0, 0, 0);

            switch (idx)
            {
                // UI colors.
                case "black": return new color_n.rgba_o(0, 0, 0, 255);
                case "gray": case "grey": return new color_n.rgba_o(127, 127, 127, 255);
                case "lightgray": case "lightgrey": return new color_n.rgba_o(192, 192, 192, 255);
                case "dimgray": case "dimgrey": return new color_n.rgba_o(64, 64, 64, 255);
                case "white": return new color_n.rgba_o(255, 255, 255, 255);
                case "blue": return new color_n.rgba_o(0, 0, 255, 255);
                case "darkorchid": return new color_n.rgba_o(153, 50, 204, 255);
                case "paleorchid": return new color_n.rgba_o(158, 123, 176, 255);
                case "yellow": return new color_n.rgba_o(255, 255, 0, 255);
                case "red": return new color_n.rgba_o(255, 0, 0, 255);
                case "green": return new color_n.rgba_o(0, 255, 0, 255);
                case "gold": return new color_n.rgba_o(179, 112, 25, 255);
                
                // Rally-Sport's palettes.
                default: return palettes[currentPalette][idx||0];
            }
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/geometry.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Functions to do with space; like vectors, vertices, etc.
 *
 */

 "use strict";

const geometry_n = {};
{
    geometry_n.vector2_o = function(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    geometry_n.vector3_o = function(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;

        this.cross = function(other = geometry_n.vector3_o)
        {
            k_assert((other instanceof geometry_n.vector3_o), "Expected a vector.");

            const c = new geometry_n.vector3_o();

            c.x = ((this.y * other.z) - (this.z * other.y));
            c.y = ((this.z * other.x) - (this.x * other.z));
            c.z = ((this.x * other.y) - (this.y * other.x));

            return c;
        }

        this.normalize = function()
        {
            const sn = ((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
            if (sn != 0 && sn != 1)
            {
                const inv = (1.0 / Math.sqrt(sn));
                this.x *= inv;
                this.y *= inv;
                this.z *= inv;
            }
        }
    }

    geometry_n.vertex_o = function(x = 0, y = 0, z = 0, w = 1, u = 0, v = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        
        // Texture coordinates.
        this.u = u;
        this.v = v;

        // Transform the vertices by the given matrix.
        this.transform = function(m = [])
        {
            k_assert((m.length === 16), "Expected a 4 x 4 matrix to transform the vertex by.");
            
            const x_ = ((m[0] * this.x) + (m[4] * this.y) + (m[ 8] * this.z) + (m[12] * this.w));
            const y_ = ((m[1] * this.x) + (m[5] * this.y) + (m[ 9] * this.z) + (m[13] * this.w));
            const z_ = ((m[2] * this.x) + (m[6] * this.y) + (m[10] * this.z) + (m[14] * this.w));
            const w_ = ((m[3] * this.x) + (m[7] * this.y) + (m[11] * this.z) + (m[15] * this.w));

            this.x = x_;
            this.y = y_;
            this.z = z_;
            this.w = w_;
        };
    }

    geometry_n.polygon_o = function(numVertices = 3)
    {
        k_assert((numVertices > 2) && (numVertices < 10), "Bad vertex count.");

        this.v = [];
        for (let i = 0; i < numVertices; i++)
        {
            this.v.push(new geometry_n.vertex_o());
        }
        
        this.color = new color_n.rgba_o();
        this.texture = 0;

        // Whether to draw a wireframe around this polygon when rendering it.
        this.hasWireframe = false;

        // If true, this polygon won't be rendered with any solid fills.
        this.isEthereal = false;

        // A value that can be drawn into the mouse-picking buffer during rendering to identify this
        // polygon in the resulting image. Set its value to null to disable this functionality.
        this.mousePickId = null;
        
        // Duplicates the given polygon's relevant properties onto this one.
        this.clone_from = function(otherPolygon = {})
        {
            k_assert(((otherPolygon instanceof geometry_n.polygon_o) &&
                      (this.v.length === otherPolygon.v.length)), "Incompatible polygons for cloning.");

            // Vertices.
            for (let i = 0; i < otherPolygon.v.length; i++)
            {
                this.v[i].x = otherPolygon.v[i].x;
                this.v[i].y = otherPolygon.v[i].y;
                this.v[i].z = otherPolygon.v[i].z;
                this.v[i].w = otherPolygon.v[i].w;

                this.v[i].u = otherPolygon.v[i].u;
                this.v[i].v = otherPolygon.v[i].v;
            }
            
            this.color.r = otherPolygon.color.r;
            this.color.g = otherPolygon.color.g;
            this.color.b = otherPolygon.color.b;
            this.color.a = otherPolygon.color.a;

            this.texture = otherPolygon.texture;
            this.mousePickId = otherPolygon.mousePickId;
            this.hasWireframe = otherPolygon.hasWireframe;
            this.isEthereal = otherPolygon.isEthereal;
        };

        // Back-face culling.
        this.is_facing_camera = function()
        {
            if (this.v.length === 3) // For triangles.
            {
                // Based on https://stackoverflow.com/a/35280392.
                {
                    const ax = (this.v[0].x - this.v[1].x);
                    const ay = (this.v[0].y - this.v[1].y);
                    const bx = (this.v[0].x - this.v[2].x);
                    const by = (this.v[0].y - this.v[2].y);
                    const cz = ((ax * by) - (ay * bx));

                    return (cz >= 0);
                }
            }
            else
            {
                //k_assert(0, "Unsupported number of vertices for backface culling.");
                return true;
            }
        };
        
        // Transform the polygon's vertices by the given matrix.
        this.transform = function(m = [])
        {
            k_assert((m.length === 16), "Expected a 4 x 4 matrix to transform the polygon by.");
            
            for (let i = 0; i < this.v.length; i++)
            {
                this.v[i].transform(m);
            }
        };
        
        this.perspective_divide = function()
        {
            for (let i = 0; i < this.v.length; i++)
            {
                this.v[i].x /= this.v[i].w;
                this.v[i].y /= this.v[i].w;
                this.v[i].z /= this.v[i].w;
            }
        };
    }

    geometry_n.polygon_mesh_o = function(polygons = [geometry_n.polygon_o],
                                         translation = new geometry_n.vector3_o(0, 0, 0),
                                         rotation = new geometry_n.vector3_o(0, 0, 0))
    {
        k_assert((polygons.length > 0), "Expected a non-empty list of polygons.");
        k_assert((translation instanceof geometry_n.vector3_o), "Expected a translation vector.");
        k_assert((rotation instanceof geometry_n.vector3_o), "Expected a rotation vector.");

        this.polygons = [];
        for (let i = 0; i < polygons.length; i++)
        {
            k_assert((polygons[i] instanceof geometry_n.polygon_o), "Expected a polygon.");

            const newPoly = new geometry_n.polygon_o(polygons[i].v.length);
            newPoly.clone_from(polygons[i]);

            this.polygons.push(newPoly);
        }

        this.rotationVec = rotation;
        this.translationVec = translation;

        // A function that will be called on this object each frame before it's drawn to the screen.
        this.tick_function_f = function(){};

        // Returns a matrix by which the polygons of this mesh can be transformed into the mesh's object-space.
        this.object_space_matrix = function()
        {
            const m = matrix44_n.multiply_matrices(matrix44_n.translation_matrix(this.translationVec.x, this.translationVec.y, this.translationVec.z),
                                                   matrix44_n.rotation_matrix(this.rotationVec.x, this.rotationVec.y, this.rotationVec.z));

            k_assert((m.length === 16), "Expected to return a 4 x 4 object space matrix.");
            return m;
        }

        // Sorts the mesh's polygons from farthest to closest.
        this.sort_vertices_by_depth = function()
        {
            const sort_by_z = function(a, b)
            {
                const d1 = (a.v[0].z + a.v[1].z + a.v[2].z);
                const d2 = (b.v[0].z + b.v[1].z + b.v[2].z);

                return (d1 < d2);
            };

            this.polygons.sort(sort_by_z);
        }
    }
}
/*
 * Most recent known filename: js/matrix44.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * 4 x 4 matrix manipulation.
 * 
 *      Adapted from code originally written by Benny Bobaganoosh for his 3d software renderer
 *      (https://github.com/BennyQBD/3DSoftwareRenderer). Full attribution:
 *      {
 *          Copyright (c) 2014, Benny Bobaganoosh
 *          All rights reserved.
 *
 *          Redistribution and use in source and binary forms, with or without
 *          modification, are permitted provided that the following conditions are met:
 *
 *          1. Redistributions of source code must retain the above copyright notice, this
 *              list of conditions and the following disclaimer.
 *          2. Redistributions in binary form must reproduce the above copyright notice,
 *              this list of conditions and the following disclaimer in the documentation
 *              and/or other materials provided with the distribution.
 *
 *          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *          ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *          WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *          DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 *          ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *          (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *          LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *          ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *          (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *          SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *      }
 *
 */

"use strict";

const matrix44_n = (function()
{
    const publicInterface = {};
    {
        publicInterface.multiply_matrices = function(m1 = [], m2 = [])
        {
            k_assert(((m1.length === 16) && (m2.length === 16)), "Expected 4 x 4 matrices.");

            let mResult = [];
            for (let i = 0; i < 4; i++)
            {
                for (let j = 0; j < 4; j++)
                {
                    mResult[i + (j * 4)] = (m1[i + (0 * 4)] * m2[0 + (j * 4)]) +
                                        (m1[i + (1 * 4)] * m2[1 + (j * 4)]) +
                                        (m1[i + (2 * 4)] * m2[2 + (j * 4)]) +
                                        (m1[i + (3 * 4)] * m2[3 + (j * 4)]);
                }
            }

            k_assert((mResult.length === 16), "Expected a 4 x 4 matrix.");
            return mResult;
        }

        publicInterface.translation_matrix = function(x = 0.0, y = 0.0, z = 0.0)
        {
            let m = [];
            m[0]=1; m[4]=0; m[ 8]=0; m[12]=x;
            m[1]=0; m[5]=1; m[ 9]=0; m[13]=y;
            m[2]=0; m[6]=0; m[10]=1; m[14]=z;
            m[3]=0; m[7]=0; m[11]=0; m[15]=1;

            k_assert((m.length === 16), "Expected a 4 x 4 matrix.");
            return m;
        }

        publicInterface.rotation_matrix = function(x = 0.0, y = 0.0, z = 0.0)
        {
            let m1 = [], m2 = [], m3 = [];

            m1[0]=1;           m1[4]=0;            m1[ 8]=0;            m1[12]=0;
            m1[1]=0;           m1[5]=Math.cos(x);  m1[ 9]=-Math.sin(x); m1[13]=0;
            m1[2]=0;           m1[6]=Math.sin(x);  m1[10]=Math.cos(x);  m1[14]=0;
            m1[3]=0;           m1[7]=0;            m1[11]=0;            m1[15]=1;

            m2[0]=Math.cos(y); m2[4]=0;            m2[ 8]=-Math.sin(y); m2[12]=0;
            m2[1]=0;           m2[5]=1;            m2[ 9]=0;            m2[13]=0;
            m2[2]=Math.sin(y); m2[6]=0;            m2[10]=Math.cos(y);  m2[14]=0;
            m2[3]=0;           m2[7]=0;            m2[11]=0;            m2[15]=1;

            m3[0]=Math.cos(z); m3[4]=-Math.sin(z); m3[ 8]=0;            m3[12]=0;
            m3[1]=Math.sin(z); m3[5]=Math.cos(z);  m3[ 9]=0;            m3[13]=0;
            m3[2]=0;           m3[6]=0;            m3[10]=1;            m3[14]=0;
            m3[3]=0;           m3[7]=0;            m3[11]=0;            m3[15]=1;

            const temp = matrix44_n.multiply_matrices(m2, m3);
            const mResult = matrix44_n.multiply_matrices(m1, temp);

            k_assert((mResult.length === 16), "Expected a 4 x 4 matrix.");
            return mResult;
        }

        publicInterface.perspective_matrix = function(fov = 0.0, aspectRatio = 0.0, zNear = 0, zFar = 0)
        {
            const fovHalf = Math.tan(fov / 2);
            const zRange = (zNear - zFar);
            
            let m = [];
            m[0]=(1 / (fovHalf * aspectRatio)); m[4]=0;             m[ 8]=0;                          m[12]=0;
            m[1]=0;                             m[5]=(1 / fovHalf); m[ 9]=0;                          m[13]=0;
            m[2]=0;                             m[6]=0;             m[10]=((-zNear - zFar) / zRange); m[14]=(2 * zFar * (zNear / zRange));
            m[3]=0;                             m[7]=0;             m[11]=1;                          m[15]=0;

            k_assert((m.length === 16), "Expected a 4 x 4 matrix.");
            return m;
        }

        publicInterface.screen_space_matrix = function(width = 0, height = 0)
        {
            let m = [];
            m[0]=(width / 2); m[4]=0;             m[ 8]=0; m[12]=(width / 2) - 0.5;
            m[1]=0;           m[5]=-(height / 2); m[ 9]=0; m[13]=(height / 2) - 0.5;
            m[2]=0;           m[6]=0;             m[10]=1; m[14]=0;
            m[3]=0;           m[7]=0;             m[11]=0; m[15]=1;

            k_assert((m.length === 16), "Expected a 4 x 4 matrix.");
            return m;
        }

        publicInterface.identity_matrix = function()
        {
            let m = [];
            m[0]=1; m[4]=0; m[ 8]=0; m[12]=0;
            m[1]=0; m[5]=1; m[ 9]=0; m[13]=0;
            m[2]=0; m[6]=0; m[10]=1; m[14]=0;
            m[3]=0; m[7]=0; m[11]=0; m[15]=1;

            k_assert((m.length === 16), "Expected a 4 x 4 matrix.");
            return m;
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/poly_transform.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Routines for transforming polygons to screen-space.
 *
 */

"use strict";

const polygon_transform_n = (function()
{
    const publicInterface = {};
    {
        // Transforms the given polygons, with their associated object space matrix, into screen-space,
        // also accounting for the given camera orientation.
        publicInterface.transform_polygons = function(polygons = [],
                                                      objectSpaceMatrix = [], cameraMatrix = [],
                                                      screenWidth = 0, screenHeight = 0)
        {
            k_assert((polygons.length > 0), "Expected a non-empty list of polygons.");
            k_assert((objectSpaceMatrix.length === 16), "Expected a 4 x 4 matrix.");
            k_assert((cameraMatrix.length === 16), "Expected a 4 x 4 matrix.");
            k_assert(((screenWidth > 0) && (screenHeight > 0)), "The screen can't have 0 width or height.");
            
            // Create matrices with which we can transform the polygons, ultimately into
            // screen-space but also into clip-space in the interim.
            let toClipSpace = [];
            let toScreenSpace = [];
            {
                const viewSpace = matrix44_n.multiply_matrices(cameraMatrix, objectSpaceMatrix);
                
                // Clip-space, for clipping triangles against the viewport; although for now,
                // the interim step into clip-space is ignored, as no triangle clipping is to
                // be done.
                toClipSpace = matrix44_n.multiply_matrices(matrix44_n.perspective_matrix(0.75/*camera fov in radians*/, (screenWidth / screenHeight), 1, 1000),
                                                        viewSpace);

                toScreenSpace = matrix44_n.multiply_matrices(matrix44_n.screen_space_matrix(screenWidth, screenHeight),
                                                            toClipSpace);
            }
            
            // Transform the polygons.
            let transfPolys = [];
            {
                let k = 0;
                for (let i = 0; i < polygons.length; i++)
                {
                    k_assert((polygons[i] instanceof geometry_n.polygon_o), "Expected a polygon.");
                    
                    transfPolys[k] = new geometry_n.polygon_o(polygons[i].v.length);
                    transfPolys[k].clone_from(polygons[i]);

                    transfPolys[k].transform(toScreenSpace);

                    // Clip against the near plane. Instead of modulating the vertex positions,
                    // we'll just cull the entire polygon if any of its vertices are behind the plane.
                    if (transfPolys[k].v.some(v=>(v.w <= 0)))
                    {
                        transfPolys.pop();
                        continue;
                    }

                    transfPolys[k].perspective_divide();

                    k++;
                }
            }
            
            return transfPolys;
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/render/camera.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

Rsed.camera_n = (function()
{
    // The camera's position, in track tile units.
    const position = new geometry_n.vector3_o(15, 0, 13);
    
    const direction = new geometry_n.vector3_o(0, 0, 0);

    const moveSpeed = 0.4;

    const publicInterface = {};
    {
        // Restore the camera's default position.
        publicInterface.reset_camera_position = function()
        {
            position.x = 15;
            position.y = 0;
            position.z = 13;
        }

        publicInterface.move_camera = function(deltaX, deltaY, deltaZ, enforceBounds = true)
        {
            position.x += (deltaX * moveSpeed);
            position.y += (deltaY * moveSpeed);
            position.z += (deltaZ * moveSpeed);

            if (enforceBounds)
            {
                if (position.x < 0) position.x = 0;
                if (position.z < 1) position.z = 1;
                if (position.x > (Rsed.maasto_n.track_side_length() - this.view_width())) position.x = (Rsed.maasto_n.track_side_length() - this.view_width());
                if (position.z > (Rsed.maasto_n.track_side_length() - this.view_height()+1)) position.z = (Rsed.maasto_n.track_side_length() - this.view_height()+1);
            }
        }

        publicInterface.rotate_camera = function(rotX, rotY, rotZ)
        {
            k_assert(0, "This function has not yet been prepared for use.");
        }

        publicInterface.pos_x = function() { return position.x; }
        publicInterface.pos_y = function() { return position.y; }
        publicInterface.pos_z = function() { return position.z; }

        publicInterface.movement_speed = function() { return moveSpeed; }

        // How many tiles horizontally and vertically should be visible on screen with this camera.
        publicInterface.view_width = function() { return 17; }
        publicInterface.view_height = function() { return 17; }
    }
    return publicInterface;
})();/*
 * Most recent known filename: js/render/renderer.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * The (3d) renderer for RallySportED.
 *
 */

"use strict";

// Takes as an argument the id string of the container (e.g. <div>) inside which to
// create the render surface (<canvas>). The container must exist; the render surface
// will be created automatically, if need be. Note that the container should contain
// nothing beyond the render surface - its contents may get wiped by the renderer.
Rsed.renderer_o = function(containerElementId = "", scaleFactor = 1)
{
    this.renderSurfaceId = "render_surface_canvas";

    k_assert((document.getElementById(containerElementId) !== null), "Can't find this element.")
    this.renderSurface = new Rsed.render_surface_n.render_surface_o(this.renderSurfaceId,
                                                                    "canvas",
                                                                    containerElementId,
                                                                    Rsed.ngon_fill_n.fill_polygons);

    // The size of the render surface will match the size of its HTML container element, but
    // rasterization into the render surface will down/upscale by this scaling factor. For instance,
    // if the element's size is 400x400 and the scaling factor is 0.5, the image will be rastrized
    // as 200x200, and scaled back to 400x400 when displayed on the page.
    this.scalingFactor = scaleFactor;
    
    // An array of the meshes the renderer will draw to screen.
    this.meshes = [];

    // An array of textures that the renderer has access to.
    this.textures = [];

    this.cameraDirection = new geometry_n.vector3_o(0, 0, 0);
    this.cameraPosition = new geometry_n.vector3_o(0, 0, 260);

    // The function to call before rendering a frame. This might, for instance,
    // be a function that processes user input.
    this.preRefreshCallbackFn = null;

    // The function to call when the size of the render surface changes.
    this.resizeCallbackFn = null;

    // Will store the number of milliseconds that elapsed between the last
    // two frames.
    this.previousFrameLatencyMs = 0;
    this.previousRenderTimestamp = 0;

    this.set_prerefresh_callback = function(preRefreshFn)
    {
        k_assert((preRefreshFn instanceof Function), "Expected a function for the refresh callback.");
        this.preRefreshCallbackFn = preRefreshFn;
    }

    this.set_resize_callback = function(resizeFn)
    {
        k_assert((resizeFn instanceof Function), "Expected a function. for the resize callback.");
        this.resizeCallbackFn = resizeFn;
    }

    this.render_width = function() { return this.renderSurface.width; }
    this.render_height = function() { return this.renderSurface.height; }

    this.indicate_error = function(message)
    {
        this.renderSurface.update_size(this.scalingFactor);
        this.renderSurface.wipe_clean();

        ui_draw_n.draw_crash_message(this.renderSurface, message);
    }

    // The render loop. This will run continuously once called.
    this.run_renderer = function(timestamp = 0)
    {
        if (!rsed_n.isOperational) return;
        
        this.previousFrameLatencyMs = (timestamp - this.previousRenderTimestamp);
        this.previousRenderTimestamp = timestamp; 

        // Render the next frame.
        {
            this.preRefreshCallbackFn();

            if (this.renderSurface.update_size(this.scalingFactor))
            {
                this.resizeCallbackFn();
            }

            this.renderSurface.wipe_clean();

            // Transform and render any meshes that have been registered with this renderer.
            if (this.meshes.length > 0)
            {
                const viewMatrix = matrix44_n.multiply_matrices(matrix44_n.translation_matrix(this.cameraPosition.x,
                                                                                                this.cameraPosition.y,
                                                                                                this.cameraPosition.z),
                                                                matrix44_n.rotation_matrix(this.cameraDirection.x,
                                                                                            this.cameraDirection.y,
                                                                                            this.cameraDirection.z));

                let polyList = [];
                const surface = this.renderSurface;
                for (let i = 0; i < this.meshes.length; i++)
                {
                    const mesh = this.meshes[i];

                    mesh.tick_function_f();

                    const transformedPolys = polygon_transform_n.transform_polygons(mesh.polygons, mesh.object_space_matrix(),
                                                                                    viewMatrix, surface.width, surface.height);

                    polyList.push(...transformedPolys);
                }

                // Sort polygons by depth, since we don't do depth testing.
                polyList.sort(function(a, b)
                {
                    let d1 = 0;
                    let d2 = 0;
                        
                    for (let i = 0; i < a.v.length; i++) d1 += a.v[i].z;
                    for (let i = 0; i < b.v.length; i++) d2 += b.v[i].z;
                    
                    d1 /= a.v.length;
                    d2 /= b.v.length;
                        
                    return ((d1 === d2)? 0 : ((d1 < d2)? 1 : -1));
                });
                            
                surface.draw_polygons(polyList);
            }

            ui_draw_n.draw_ui(this.renderSurface);
        }

        window.requestAnimationFrame(this.run_renderer.bind(this));
    }

    // Adds a mesh to be rendered. Meshes don't need to be added for each frame - add it
    // once and you're good.
    this.register_mesh = function(mesh = geometry_n.polygon_mesh_o)
    {
        k_assert((mesh instanceof geometry_n.polygon_mesh_o), "Expected a polygon mesh.");
        this.meshes.push(mesh);
    }

    this.move_camera = function(deltaX = 0, deltaY = 0, deltaZ = 0)
    {
        this.cameraPosition.x += deltaX;
        this.cameraPosition.y += deltaY;
        this.cameraPosition.z += deltaZ;
    }

    this.mouse_pick_buffer_value_at = function(x = 0, y = 0)
    {
        if ((x < 0 || x >= this.renderSurface.width) ||
            (y < 0 || y >= this.renderSurface.height))
        {
            return -1;
        }

        return this.renderSurface.mousePickBuffer[x + y * this.renderSurface.width];
    }
}
/*
 * Most recent known filename: js/render_surface.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 * Provides an abstracted surface for rendering graphics onto the webpage. The surface
 * might be, for instance, an <svg> element.
 *
 */

"use strict";

Rsed.render_surface_n = (function()
{
    const publicInterface = {};
    {
        // The render surface is a HTML element of some kind - <svg> or <canvas>, for instance - embedded
        // in a container like <div>.
        publicInterface.render_surface_o = function(surfaceElementId = "",
                                                    surfaceElementName = "",
                                                    containerId = "",
                                                    polyFillFn = Function)
        {
            k_assert((surfaceElementId.length > 0), "Expected a non-null string.");
            k_assert((surfaceElementName.length > 0), "Expected a non-null string.");
            k_assert((containerId.length > 0), "Expected a non-null string.");
            k_assert((polyFillFn != null), "Expected a non-null polyfill function.");

            this.elementId = surfaceElementId;
            this.elementName = surfaceElementName;

            this.containerId = containerId;

            this.width = null;
            this.height = null;
            
            this.containerElement = document.getElementById(this.containerId);
            k_assert((this.containerElement != null), "Couldn't find a render surface element with the given id.");

            this.element = document.getElementById(this.elementId);

            // If the element doesn't already exist, create it. NOTE: This will wipe the
            // container's contents.
            if (this.element == null)
            {
                this.containerElement.innerHTML = "";

                switch(this.elementName)
                {
                    case "canvas":
                    {
                        this.element = document.createElement("canvas");
                        break;
                    }
                    case "svg":
                    {
                        this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        this.element.style.backgroundColor = "transparent";
                        this.element.style.pointerEvents = "none"; // Prevent polygons in the SVG from intercepting the mouse.
                        
                        break;
                    }
                    default:
                    {
                        k_assert(0, "Unknown render surface element id.");
                        break;
                    }
                }

                this.element.setAttribute("id", this.elementId);
                this.element.setAttribute("class", "canvas");
                this.containerElement.appendChild(this.element);
            }
            k_assert((this.element.parentNode === this.containerElement), "The render surface element doesn't appear to be embedded in the given container element.");
            k_assert((this.element != null), "Couldn't find a render surface element with the given id.");
            k_assert((this.element.tagName.toLowerCase() === this.elementName), "The element by the given id is not compatible with the given element name.");

            // A function that can be called by the render surface to draw polygons onto
            // itself.
            this.poly_filler = polyFillFn.bind(this);

            this.depthBuffer = [];

            // For mouse picking. This will match the size of the pixel buffer - as you're rasterizing into
            // the pixel buffer, you'll write into each corresponding pixel in this buffer some ID value of
            // whichever polygon you're rasterizing; so that by reading a value from this array at the
            // mouse coordinates, we know which polygon it's hovering over.
            this.mousePickBuffer = [];

            // Draw the given polygons onto this render surface.
            this.draw_polygons = function(polygons = [])
            {
                this.poly_filler(polygons);
            }

            // Update the size of the render surface to match the size of its container elemen, adjusted
            // by the given scaling factor. Returns true if the size was changed, false is the old size
            // already matched the present one.
            this.update_size = function(scalingFactor = 1)
            {
                const targetWidth = Math.floor(this.containerElement.clientWidth * scalingFactor);
                const targetHeight = Math.floor(this.containerElement.clientHeight * scalingFactor);

                // If the size is already correct, ignore the request to update the size.
                if ((this.width === targetWidth) &&
                    (this.height === targetHeight))
                {
                    return false;
                }

                this.width = targetWidth;
                this.height = targetHeight;
                
                k_assert(!isNaN(this.width) && !isNaN(this.height), "Failed to extract the canvas size.");

                this.element.setAttribute("width", this.width);
                this.element.setAttribute("height", this.height);

                // Initialize any auxiliary buffers.
                if (this.elementName === "canvas")
                {
                    this.mousePickBuffer = new Array(this.width * this.height);
                    //this.depthBuffer = new Array(this.width * this.height);
                }

                return true;
            }

            // Exposes the relevant portion of the surface for rendering.
            this.exposed = function()
            {
                switch (this.elementName)
                {
                    case "canvas":
                    {
                        return this.element.getContext("2d");
                    }
                    case "svg":
                    {
                        this.element.setAttribute("width", this.width);
                        this.element.setAttribute("height", this.height);

                        return this.element;
                    }
                    default:
                    {
                        k_assert(0, "Unknown render surface element id.");
                    }
                }
            }

            // Cleans-up the render surface, to a state where it will display nothing but
            // a blank slate onto the screen.
            this.wipe_clean = function()
            {
                const surface = this.exposed();

                switch (this.elementName)
                {
                    case "svg":
                    {
                        while (this.element.firstChild !== null)
                        {
                            this.element.removeChild(this.element.firstChild);
                        }

                        break;
                    }
                    case "canvas":
                    {
                        surface.fillStyle = "#101010";
                        surface.fillRect(0, 0, this.width, this.height);

                        // Reset auxiliary buffers.
                        this.mousePickBuffer.fill(ui_input_n.create_mouse_picking_id(ui_input_n.mousePickingType.void, {}));
                        //this.depthBuffer.fill(Number.MAX_VALUE);

                        break;
                    }
                    default:
                    {
                        k_assert(0, "Unknown render surface element id.");
                    }
                }
            }
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/track/maasto.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

Rsed.maasto_n = (function()
{
    // The number of tiles per side on this MAASTO.
    let maastoSideLength = 0

    const maxHeightmapValue = 255;
    const minHeightmapValue = -511;

    // The checkpoint is a point on the track next to which the player's car must pass for the
    // lap to be counted as valid.
    const trackCheckpoint = new geometry_n.vector2_o();

    // The side length, in world units, of a single ground tile.
    const tileSize = 128;

    // The MAASTO's height points. These will be about in the range -511..255.
    const heightmap = [];

    // For each tile on the MAASTO, the PALA texture it uses. These will be
    // index values in the range 0..255.
    const tilemap = [];

    // The x,y,z coordinates of each prop on this MAASTO.
    const propLocations = [];
    const propNames = [];

    // The maximum number of props that can exist on a track.
    const maxNumProps = 14;

    // The number of tiles on each side of the track that can't have user-placed props on them. This
    // prevents the user from placing props out of bounds, etc.
    const propMargin = 2;

    // The byte sizes of the binary MAASTO and VARIMAA data that our current heightmap and tilemap are based on.
    let originalMaastoBytesize = 0;
    let originalVarimaaBytesize = 0;

    const publicInterface = {};
    {
        publicInterface.tile_size = function()
        {
            return tileSize;
        }


        publicInterface.set_checkpoint_pos = function(x, y)
        {
            trackCheckpoint.x = x;
            trackCheckpoint.y = y;
        }

        publicInterface.num_props = function()
        {
            k_assert((propLocations.length === propNames.length), "Detected mismatched prop data.");

            return propLocations.length;
        }

        publicInterface.remove_prop = function(propIdx)
        {
            k_assert((propIdx >= 0 && propIdx < propLocations.length), "Trying to delete a prop whose index is out of bounds.");

            // Don't allow removing the finish line, since a track needs to have one at all times. But if you
            // really want to remove it, and you know what you're doing, you need to call some other function,
            // whichever that may be.
            if (propIdx === 0) return;

            propLocations.splice(propIdx, 1);
            propNames.splice(propIdx, 1);
        }

        // Returns a copy of the value such that it's clamped to within allowable track boundaries, considering both
        // the side length of the track and its prop margin. Note that the value is expected to be in tile units
        // multiplied by the tile size (e.g. 53 * 128 for tile 53).
        publicInterface.clamped_to_track_prop_boundaries = function(value)
        {
            const min = (this.prop_margin() * this.tile_size());
            const max = ((this.track_side_length() - this.prop_margin()) * this.tile_size());

            return k_clamp(value, min, max);
        }

        publicInterface.set_prop_position = function(propIdx, x, z)
        {
            k_assert((propIdx >= 0 && propIdx < propLocations.length), "Trying to move a prop whose index is out of bounds.");

            /// TODO: For now, this doesn't clamp the values to track boundaries, as some tracks made with
            /// old versions of RallySportED may try to put props outside of those boundaries (and expect
            /// it to succeed).
            propLocations[propIdx].x = x;
            propLocations[propIdx].z = z;
        }
        
        publicInterface.move_prop = function(propIdx, deltaX, deltaZ)
        {
            k_assert((propIdx >= 0 && propIdx < propLocations.length), "Trying to move a prop whose index is out of bounds.");

            propLocations[propIdx].x = this.clamped_to_track_prop_boundaries(propLocations[propIdx].x + deltaX);
            propLocations[propIdx].z = this.clamped_to_track_prop_boundaries(propLocations[propIdx].z + deltaZ);
        }

        publicInterface.level_terrain = function()
        {
            const heightString = window.prompt("Level the terrain to a height of...");
            if (heightString == null) return;

            const heightValue = Number(heightString);

            if (!Number.isInteger(heightValue) ||
                heightValue < minHeightmapValue ||
                heightValue > maxHeightmapValue)
            {
                window.alert("The given height value is out of range (" + minHeightmapValue + ".." + maxHeightmapValue + ").");
                return;
            }

            heightmap.fill(heightValue);
        }

        // Returns a byte array that can be saved into a RallySportED project file.
        publicInterface.get_saveable_maasto = function()
        {
            let bytes = new Uint8Array(heightmap.length * 2);

            // Convert our single-value heightmap into Rally-Sport's two-byte format.
            for (let i = 0; i < heightmap.length; i++)
            {
                const height = heightmap[i];
                let b1 = 0;
                let b2 = 0;

                if (height > 0)
                {
                    b2 = 255;
                    b1 = (255 - height);
                }
                else if (height <= 0)
                {
                    if (height < -255)
                    {
                        b2 = 1;
                        b1 = (Math.abs(height) - 256);
                    }
                    else
                    {
                        b2 = 0;
                        b1 = Math.abs(height);
                    }
                }

                bytes[i*2] = b1;
                bytes[i*2+1] = b2;
            }

            k_assert((bytes.length === originalMaastoBytesize), "Returning too many/few bytes in the saveable MAASTO buffer.");

            return bytes;
        }

        // Returns a byte array that can be saved into a RallySportED project file.
        publicInterface.get_saveable_varimaa = function()
        {
            let bytes = new Uint8Array(tilemap.length);

            for (let i = 0; i < tilemap.length; i++)
            {
                bytes[i] = tilemap[i];
            }

            k_assert((bytes.length === originalVarimaaBytesize), "Returning too many/few bytes in the saveable MAASTO buffer.");

            return bytes;
        }

        // Returns the x,y,z track coordinates of the given prop.
        publicInterface.position_of_prop = function(propId)
        {
            k_assert((propId >= 0 && propId < propLocations.length), "Querying prop position out of bounds.");
            return propLocations[propId];
        }

        // Returns the name of the given prop.
        publicInterface.name_of_prop = function(propId)
        {
            k_assert((propId >= 0 && propId < propNames.length), "Querying prop position out of bounds.");
            return propNames[propId].slice(0);
        }

        publicInterface.change_prop_type = function(propIdx, newPropIdx)
        {
            k_assert((propIdx >= 0 && propIdx < propNames.length), "Attempting to change prop type out of bounds.");
            propNames[propIdx] = props_n.prop_name_for_idx(newPropIdx);
        }

        publicInterface.set_prop_count = function(numProps = 0)
        {
            // Each track needs at least one prop, i.e. the starting line.
            k_assert(((numProps >= 1) && (numProps <= propLocations.length)), "Attempting to set prop count out of bounds (" + numProps + ").");

            propLocations.length = numProps;
            propNames.length = numProps;
        }

        // Removes any MAASTO data we've added, wiping the slate clean as it were.
        publicInterface.clear_maasto_data = function(propsToo = false)
        {
            maastoSideLength = 0;
            heightmap.length = 0;
            tilemap.length = 0;

            if (propsToo)
            {
                propLocations.length = 0;
                propNames.length = 0;
            }
        }

        publicInterface.add_prop_location = function(trackId = 0, propName = "", x = 0, y = 0, z = 0)
        {
            k_assert((trackId >= 0 && trackId <= 8), "Track id is out of bounds.");
            k_assert((propName.length > 0), "Expected a non-empty prop name.");

            /// Temp hack.
            if (trackId !== rsed_n.underlying_track_id()) return;

            if (propLocations.length >= maxNumProps)
            {
                k_popup("A track can have " + maxNumProps +" props, at most. This one has that many, already. Remove some to make room for more.");
                return;
            }
            
            const pos = new geometry_n.vector3_o(x, y, z);
            propLocations.push(pos);
            propNames.push(propName);
        }

        // Call this with a n array of height points (sideLength * sideLength) long.
        publicInterface.set_maasto = function(sideLength = 0, heights = [])
        {
            k_assert((heights[0] != null), "Can't set the MAASTO with potentially bad data.");
            k_assert((heights.length === (sideLength * sideLength)), "Incorrect number of height points for MAASTO.");

            maastoSideLength = sideLength;
            heightmap.push(...heights);
        }

        publicInterface.set_maasto_height_at = function(x = 0, y = 0, newHeight = 0)
        {
            k_assert(((x >= 0 && x < maastoSideLength) &&
                      (y >= 0 && y < maastoSideLength)), "Attempting to set MAASTO height out of bounds (" + x + "," + y + ").");

            if (newHeight > maxHeightmapValue) newHeight = maxHeightmapValue;
            else if (newHeight < minHeightmapValue) newHeight = minHeightmapValue;

            heightmap[x + y * maastoSideLength] = newHeight;
        }

        publicInterface.set_varimaa_tile_at = function(x = 0, y = 0, palaIdx = 0)
        {
            k_assert(((x >= 0 && x < maastoSideLength) &&
                      (y >= 0 && y < maastoSideLength)), "Attempting to set a VARIMAA tile out of bounds (" + x + "," + y + ").");

            tilemap[x + y * maastoSideLength] = palaIdx;
        }

        publicInterface.set_varimaa = function(sideLength = 0, tiles = [])
        {
            k_assert((sideLength === maastoSideLength), "Expected the MAASTO side length to be set and identical to that of the VARIMAA.");
            tilemap.push(...tiles);
        }

        publicInterface.maasto_height_at = function(x = 0, y = 0)
        {
            x = Math.floor(x);
            y = Math.floor(y);

            if (x < 0 || x >= maastoSideLength ||
                y < 0 || y >= maastoSideLength)
            {
                return 0;
            }

            return heightmap[x + y * maastoSideLength];
        }

        publicInterface.varimaa_tile_at = function(x = 0, y = 0)
        {
            x = Math.floor(x);
            y = Math.floor(y);

            if (x < 0 || x >= maastoSideLength ||
                y < 0 || y >= maastoSideLength)
            {
                return 0;
            }

            return tilemap[x + y * maastoSideLength];
        }

        // The game by default has four different 'skins' for spectators, and it decides which skin a
        // spectator will be given based on the spectator's x,y coordinates on the track. This will
        // return the correct skin for the given coordinates.
        publicInterface.spectator_texture_at = function(tileX = 0, tileY = 0)
        {
            const firstSpectatorTexIdx = 236;      // Index of the first PALA representing a (standing) spectator. Assumes consecutive arrangement.
            const numSkins = 4;
            const sameRows = ((this.track_side_length() == 128)? 16 : 32); // The game will repeat the same pattern of variants on the x axis this many times.

            const yOffs = (Math.floor(tileY / sameRows)) % numSkins;
            const texOffs = ((tileX + (numSkins - 1)) + (yOffs * (numSkins - 1))) % numSkins;

            const textureIdx = (firstSpectatorTexIdx + texOffs);

            return textureIdx;
        }

        // Returns a polygon mesh of the track at the given viewing position, given in track tile units.
        publicInterface.maasto_mesh = function(viewOffsetX = 0, viewOffsetZ = 0)
        {
            // The list of polygons that make up the track mesh.
            const polys = [];

            const topdown = (ui_view_n.current_view() === "3d-topdown");

            // We'll center the track on the screen with these.
            const trackOffsetX = topdown? -1152 : -1088;
            const trackOffsetY = topdown? -1800 : -680;
            const trackOffsetZ = topdown? 700 : 2612;

            const wireframeOnRequest = ui_view_n.show3dWireframe;

            // Add the ground tiles.
            for (let z = 0; z < Rsed.camera_n.view_height(); z++)
            {
                for (let x = 0; x < Rsed.camera_n.view_width(); x++)
                {
                    const tileX = (x + viewOffsetX);
                    const tileZ = (z + viewOffsetZ);

                    const vertX = ((x * tileSize) + trackOffsetX);
                    const vertZ = (trackOffsetZ - (z * tileSize));

                    let tilePala = this.varimaa_tile_at(tileX, (tileZ - 1));

                    // If the mouse cursor is hovering over this tile, mark it with the brush's PALA.
                    if (tileX === ui_input_n.mouse_tile_hover_x() &&
                        (tileZ - 1) === ui_input_n.mouse_tile_hover_y())
                    {
                        tilePala = ui_brush_n.brush_pala_idx();
                    }

                    // Constuct the ground quad polygon.
                    const quad = new geometry_n.polygon_o(4);
                    {
                        // The heights of the ground quad's corner points.
                        const height1 = trackOffsetY + this.maasto_height_at( tileX,       tileZ);
                        const height2 = trackOffsetY + this.maasto_height_at((tileX + 1),  tileZ);
                        const height3 = trackOffsetY + this.maasto_height_at((tileX + 1), (tileZ - 1));
                        const height4 = trackOffsetY + this.maasto_height_at( tileX,      (tileZ - 1));
                        
                        quad.v[0] = new geometry_n.vertex_o( vertX,             height1, vertZ);
                        quad.v[1] = new geometry_n.vertex_o((vertX + tileSize), height2, vertZ);
                        quad.v[2] = new geometry_n.vertex_o((vertX + tileSize), height3, (vertZ + tileSize));
                        quad.v[3] = new geometry_n.vertex_o( vertX,             height4, (vertZ + tileSize));
                        
                        quad.hasWireframe = wireframeOnRequest;
                        quad.texture = palat_n.pala_texture(tilePala);
                    }

                    // We'll encode this ground quad's tile coordinates into a 32-bit id value, which during
                    // rasterization we'll write into the mouse-picking buffer, so we can later determine which
                    // quad, if any, the mouse cursor is hovering over.
                    quad.mousePickId = ui_input_n.create_mouse_picking_id(ui_input_n.mousePickingType.ground,
                                                                          {"tileX":tileX,
                                                                           "tileZ":(tileZ - 1)});

                    polys.push(quad);

                    // If this tile has a billboard, add that too.
                    if (tilePala > 239 && tilePala <= 247)
                    {
                        const baseHeight = trackOffsetY + this.maasto_height_at(tileX, (tileZ - 1));

                        const bill = new geometry_n.polygon_o(4);
                        bill.v[0] = new geometry_n.vertex_o( vertX,             baseHeight,          vertZ);
                        bill.v[1] = new geometry_n.vertex_o((vertX + tileSize), baseHeight,          vertZ);
                        bill.v[2] = new geometry_n.vertex_o((vertX + tileSize), baseHeight+tileSize, vertZ);
                        bill.v[3] = new geometry_n.vertex_o( vertX,             baseHeight+tileSize, vertZ);

                        switch (tilePala)
                        {
                            // Spectators.
                            case 240:
                            case 241:
                            case 242: bill.texture = palat_n.pala_texture(this.spectator_texture_at(tileX, (tileZ - 1)), true);
                            break;
        
                            // Shrubs.
                            case 243: bill.texture = palat_n.pala_texture(208, true); break;
                            case 244: bill.texture = palat_n.pala_texture(209, true); break;
                            case 245: bill.texture = palat_n.pala_texture(210, true); break;
        
                            // Small poles.
                            case 246:
                            case 247: bill.texture = palat_n.pala_texture(211, true); break;
                            case 250: bill.texture = palat_n.pala_texture(212, true); break;
        
                            default: k_assert(0, "Unrecognized billboard texture."); continue;
                        }

                        polys.push(bill);
                    }
                    // If the tile has a bridge, add that.
                    else if (tilePala === 248 || tilePala === 249)
                    {
                        const bridge = new geometry_n.polygon_o(4);
                        bridge.v[0] = new geometry_n.vertex_o( vertX,             trackOffsetY, vertZ);
                        bridge.v[1] = new geometry_n.vertex_o((vertX + tileSize), trackOffsetY, vertZ);
                        bridge.v[2] = new geometry_n.vertex_o((vertX + tileSize), trackOffsetY, (vertZ+tileSize));
                        bridge.v[3] = new geometry_n.vertex_o( vertX,             trackOffsetY, (vertZ+tileSize));

                        bridge.texture = palat_n.pala_texture(177, true);

                        polys.push(bridge);
                    }
                }
            }

            // Add any track prop meshes that should be visible on the currently-drawn track.
            for (let i = 0; i < propLocations.length; i++)
            {
                const pos = propLocations[i];
                if ((pos.x >= (Rsed.camera_n.pos_x() * tileSize)) &&
                    (pos.x <= ((Rsed.camera_n.pos_x() + Rsed.camera_n.view_width()) * tileSize)) &&
                    (pos.z >= (Rsed.camera_n.pos_z() * tileSize)) &&
                    (pos.z <= ((Rsed.camera_n.pos_z() + Rsed.camera_n.view_height()) * tileSize)))
                {
                    const x = (pos.x + trackOffsetX - (viewOffsetX * tileSize));
                    const z = (trackOffsetZ - pos.z + (viewOffsetZ * tileSize));
                    const groundHeight = trackOffsetY + this.maasto_height_at((pos.x / tileSize), (pos.z / tileSize));
                    const y = (groundHeight + pos.y);

                    const mesh = props_n.prop_mesh(propNames[i], i, x, y, z, wireframeOnRequest);
                    polys.push(...mesh);
                }
            }
            
            /// Temp hack. We're tilting down all the ground elements to get the viewing angle we want,
            /// but really it should be the camera's view vector that's pointed down and not the objects
            /// themselves.
            return new geometry_n.polygon_mesh_o(polys, new geometry_n.vector3_o(0, 0, 0),
                                                        new geometry_n.vector3_o(topdown? (-Math.PI / 2) : -0.45, 0, 0));
        }

        publicInterface.prop_locations = function() { return propLocations.slice(0); }
        publicInterface.prop_names = function() { return propNames.slice(0); }

        publicInterface.track_checkpoint_x = function() { return trackCheckpoint.x; }
        publicInterface.track_checkpoint_y = function() { return trackCheckpoint.y; }

        publicInterface.prop_margin = function() { return propMargin; }

        publicInterface.track_side_length = function() { return maastoSideLength; }

        publicInterface.set_maasto_bytesize = function(numBytes) { originalMaastoBytesize = numBytes; }
        publicInterface.set_varimaa_bytesize = function(numBytes) { originalVarimaaBytesize = numBytes; }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/track/palat.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

const palat_n = (function()
{
    // Resolution of a single PALA.
    const palaWidth = 16;
    const palaHeight = 16;

    // The list of PALA textures that we know about.
    const palat = [];

    // The list of PALA textures that we know about, with alpha-testing enabled.
    const palatWithAlpha = [];

    let originalPalatBytesize = 0;

    const publicInterface = {};
    {
        publicInterface.set_palat_bytesize = function(numBytes)
        {
            originalPalatBytesize = numBytes;
        }

        // Returns a byte array that can be saved into a RallySportED project file.
        publicInterface.get_saveable_palat = function()
        {
            let bytes = new Uint8Array(originalPalatBytesize);
            
            let idx = 0;
            for (let i = 0; i < palat.length; i++)
            {
                for (let y = (palaHeight - 1); y >= 0; y--) // Iterate backward to flip the image on y.
                {
                    for (let x = 0; x < palaWidth; x++)
                    {
                        if (idx >= originalPalatBytesize) return bytes;

                        bytes[idx++] = palat[i].paletteIndices[x + y * palaWidth];
                    }
                }
            }

            return bytes;
        }

        // Removes any PALAT data we've added, wiping the slate clean as it were.
        publicInterface.clear_palat_data = function()
        {
            palat.length = 0;
            palatWithAlpha.length = 0;
        }

        // Adds the given texture as a known PALA.
        publicInterface.add_pala = function(palaTexture = texture_n.texture_o)
        {
            k_assert((palaTexture instanceof texture_n.texture_o), "Expected a texture object.");

            let tex = new texture_n.texture_o;
            tex.pixels = palaTexture.pixels.slice(0);
            tex.paletteIndices = palaTexture.paletteIndices.slice(0);
            tex.width = palaTexture.width;
            tex.height = palaTexture.height;
            tex.hasAlpha = false;
            palat.push(tex);
    
            tex = new texture_n.texture_o;
            tex.pixels = palaTexture.pixels.slice(0);
            tex.paletteIndices = palaTexture.paletteIndices.slice(0);
            tex.width = palaTexture.width;
            tex.height = palaTexture.height;
            tex.hasAlpha = true;
            palatWithAlpha.push(tex);
        }

        // Returns the PALA with the given index.
        publicInterface.pala_texture = function(palaIdx = 0, withAlpha = false)
        {
            const palaSource = (withAlpha? palatWithAlpha : palat);
           // k_assert((palaSource[palaIdx] != null), "Can't return a valid PALA texture.");
            //k_assert((palaSource[palaIdx] instanceof texture_n.texture_o), "Expected a texture object.");

            return (palaSource[palaIdx] == null)? null : palaSource[palaIdx];
        }

        publicInterface.num_palas = function() { return palat.length; }
        publicInterface.pala_width = function() { return palaWidth; }
        publicInterface.pala_height = function() { return palaHeight; }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/track/props.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

const props_n = (function()
{
    // The collection of prop meshes we know about, as an array of vertices for each mesh.
    const propMeshes = [];

    // The name of each prop in the prop meshes array.
    const propNames = [];

    // A list of the textures we can use on props.
    const propTextures = [];

    const publicInterface = {};
    {
        publicInterface.clear_prop_textures = function()
        {
            propTextures.length = 0;
        }

        publicInterface.clear_prop_data = function()
        {
            propMeshes.length = 0;
            propNames.length = 0;
            propTextures.length = 0;
        }

        publicInterface.add_prop_texture = function(texture = texture_n.texture_o)
        {
            k_assert((texture instanceof texture_n.texture_o), "Expected a texture object.");

            texture.hasAlpha = true;
            propTextures.push(texture);
        }

        publicInterface.add_prop_mesh = function(name = "", polygons = [geometry_n.polygon_o])
        {
            k_assert((polygons[0] instanceof geometry_n.polygon_o), "Expected a polygon mesh.");
            k_assert((name.length > 0), "Expected a non-empty prop name string.");
            k_assert((polygons.length > 0), "Expectd a non-empty mesh.");
            
            propMeshes.push(polygons);
            propNames.push(name);
        }

        publicInterface.prop_name_for_idx = function(propIdx)
        {
            k_assert((propIdx >= 0 && propIdx < propNames.length), "Querying a prop name out of bounds.");
            return propNames[propIdx];
        }

        publicInterface.prop_idx_for_name = function(propName = "")
        {
            const propIdx = propNames.indexOf(propName);
            k_assert((propIdx >= 0 && propIdx < propNames.length), "Can't find the given prop name to return an index.");

            return propIdx;
        }

        // Returns a copy of the mesh of the prop of the given name, offset by the given x,y,z.
        publicInterface.prop_mesh = function(name = "", idOnTrack = 0, offsetX = 0, offsetY = 0, offsetZ = 0, wireframeEnabled = false)
        {
            k_assert((name.length > 0), "Expected a non-empty prop mesh name string.");

            const idx = propNames.indexOf(name);
            const sourceMesh = propMeshes[idx];
            k_assert((idx >= 0), "Couldn't find a prop with the given name.");

            const copyMesh = [];
            for (let i = 0; i < sourceMesh.length; i++)
            {
                copyMesh.push(new geometry_n.polygon_o(sourceMesh[i].v.length));
                copyMesh[i].clone_from(sourceMesh[i]);

                copyMesh[i].hasWireframe = wireframeEnabled;

                copyMesh[i].isEthereal = ui_view_n.hideProps;

                copyMesh[i].mousePickId = ui_input_n.create_mouse_picking_id(ui_input_n.mousePickingType.prop,
                                                                             {propIdx:idx, propTrackId:idOnTrack});

                for (let v = 0; v < copyMesh[i].v.length; v++)
                {
                    copyMesh[i].v[v].x += offsetX;
                    copyMesh[i].v[v].y += offsetY;
                    copyMesh[i].v[v].z += offsetZ;
                }
            }

            return copyMesh;
        }

        publicInterface.prop_texture = function(idx)
        {
            if (idx == null) return null;

            k_assert((idx >= 0 && idx < propTextures.length), "Tried to access a prop texture out of bounds.");

            return propTextures[idx];
        }

        publicInterface.prop_names = function() { return propNames.slice(0); }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/track/manifesto.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 * 
 * Parses RallySportED's manifesto files.
 *
 */

"use strict";

Rsed.manifesto_n = (function()
{
    const manifestoCommands = Object.freeze({"0": apply_0,
                                             "1": apply_1,
                                             "2": apply_2,
                                             "3": apply_3,
                                             "4": apply_4,
                                             "5": apply_5,
                                             "6": apply_6,
                                             "10": apply_10,
                                             "99": apply_99})

    // Command: require. Sets up the track with the correct MAASTO, VARIMAA, etc. files.
    // You'd generally wait until the promise this returns resolves before engaging any
    // other manifesto commands, since they might otherwise be modifying incomplete data.
    function apply_0(args = [])
    {
        return new Promise((resolve, reject) =>
        {
            k_assert((args.length === 3), "Invalid number of arguments to manifesto command 0. Expected 4 but received " + args.length + ".");

            const trackId = Math.floor(Number(args[0]));
            const palatId = Math.floor(Number(args[1]));
            const minRSEDLoaderVersion = Number(args[2]);

            rsed_n.initialize_track_data(trackId).then(()=>{resolve();});
        });
    }

    // Command: road. Sets up the game's driving physics for various kinds of road surfaces.
    function apply_1(args = [])
    {
        k_assert((args.length === 1), "Invalid number of arguments to manifesto command 1. Expected 1 but received " + args.length + ".");
    }

    // Command: num_objs. Sets the number of props (in addition to the starting line) on the track.
    function apply_2(args = [])
    {
        k_assert((args.length === 1), "Invalid number of arguments to manifesto command 2. Expected 1 but received " + args.length + ".");

        const numObjs = Math.floor(Number(args[0]));

        Rsed.maasto_n.set_prop_count(numObjs);
    }

    // Command: add_obj. Adds a new prop to the track.
    function apply_3(args = [])
    {
        k_assert((args.length === 5), "Invalid number of arguments to manifesto command 3. Expected 5 but received " + args.length + ".");

        const propTypeIdx = Math.floor(Number(args[0]) - 1);
        const posX = Math.floor(((Number(args[1]) * 2) * Rsed.maasto_n.tile_size()) + Number(args[3]));
        const posZ = Math.floor(((Number(args[2]) * 2) * Rsed.maasto_n.tile_size()) + Number(args[4]));

        Rsed.maasto_n.add_prop_location(rsed_n.underlying_track_id(), props_n.prop_name_for_idx(propTypeIdx), posX, 0, posZ);
    }

    // Command: change_obj_type. Changes the type of the given prop.
    function apply_4(args = [])
    {
        k_assert((args.length === 2), "Invalid number of arguments to manifesto command 4. Expected 2 but received " + args.length + ".");

        const targetPropIdx = Math.floor(Number(args[0]) - 1);
        const newType = Math.floor(Number(args[1]) - 1);

        Rsed.maasto_n.change_prop_type(targetPropIdx, newType);
    }

    // Command: move_obj. Moves the position of the given prop.
    function apply_5(args = [])
    {
        k_assert((args.length === 5), "Invalid number of arguments to manifesto command 5. Expected 5 but received " + args.length + ".");

        const targetPropIdx = Math.floor(Number(args[0]) - 1);
        const posX = Math.floor(((Number(args[1]) * 2) * Rsed.maasto_n.tile_size()) + Number(args[3]));
        const posZ = Math.floor(((Number(args[2]) * 2) * Rsed.maasto_n.tile_size()) + Number(args[4]));

        Rsed.maasto_n.set_prop_position(targetPropIdx, posX, posZ);
    }

    // Command: move_starting_pos. Moves the starting line. Note that this doesn't move the
    // starting line prop, but the starting position of the player's car. So we can ignore
    // it in the editor.
    function apply_6(args = [])
    {
        k_assert((args.length === 4), "Invalid number of arguments to manifesto command 6. Expected 4 but received " + args.length + ".");
    }

    // Command: change_palette_entry. Changes the given palette index to the given r,g,b values.
    function apply_10(args = [])
    {
        k_assert((args.length === 4), "Invalid number of arguments to manifesto command 10. Expected 4 but received " + args.length + ".");

        const targetPaletteIdx = Math.floor(Number(args[0]));
        const r = Math.floor(Number(args[1] * 4));
        const g = Math.floor(Number(args[2] * 4));
        const b = Math.floor(Number(args[3] * 4));
        
        palette_n.modify_palette_entry(targetPaletteIdx, r, g, b);
    }

    // Command: stop. Stops parsing the manifesto file.
    function apply_99(args = [])
    {
        k_assert((args.length === 0), "Invalid number of arguments to manifesto command 99. Expected no arguments but received " + args.length + ".");
    }

    const publicInterface = {};
    {
        // Enacts the given manifesto string. Returns a promise which is resolved once the manifesto has been
        // fully applied.
        publicInterface.apply_manifesto = function(manifestoString)
        {
            return new Promise((resolve, reject) =>
            {
                const lines = manifestoString.split("\n").filter(Boolean);
                k_assert((lines.length >= 2), "Invalid number of lines in the manifesto file.");

                // Apply the first manifesto command, 0, which sets up the track by loading in all data, etc.
                const params = lines[0].split(" ");
                const commandId = Number(params.shift());
                const initialize_track = manifestoCommands[0];
                k_assert((commandId === 0), "Expected the first command in the manifesto to be 0.");

                // Once the first command has finished loading all data, we can continue with the other
                // manifesto commands, which manipulate those data.
                initialize_track(params)
                .then(()=>
                {
                    for (let i = 1; i < lines.length; i++)
                    {
                        const params = lines[i].split(" ");
                        const commandId = Number(params.shift());
                        const command = manifestoCommands[commandId];
                        k_assert((command != null), "Unsupported command (" + commandId + ") in the manifesto file.");

                        if ((commandId === 99) && (i !== (lines.length - 1)))
                        {
                            k_assert(0, "Expected the command 99 to be the manifesto's last one.");
                        }

                        command(params);
                    }
                })
                .then(()=>{resolve();});
            });
        }

        // Will take the given manifesto string (the full contents of a manifesto file) and process it for
        // saving. This processing will involve, for instance, updating track prop positions in instances
        // of command #5.
        publicInterface.get_saveable_manifesto = function(manifestoString)
        {
            const manifLines = manifestoString.split("\n").filter(Boolean);

            let newManifesto = "";

            // Copy verbatim any manifesto commands we won't update.
            for (let i = 0; i < (manifLines.length - 1); i++)
            {
                const params = manifLines[i].split(" ");
                k_assert(params.length > 0, "Did not expect an empty parameters list.");

                switch (params[0])
                {
                    case 2:
                    case 4:
                    case 5: break;
                    default: newManifesto += (manifLines[i] + "\n");
                }
            }

            // Add command 2 to set the number of props.
            newManifesto += ("2 " + Rsed.maasto_n.num_props() + "\n");
            
            // Add command 5 for all props on the track, except for the starting line (first prop in the list), so they
            // get put in their correct places.
            {
                const propLocations = Rsed.maasto_n.prop_locations();

                for (let i = 1; i < propLocations.length; i++)
                {
                    const globalX = Math.floor((propLocations[i].x / Rsed.maasto_n.tile_size()) / 2);
                    const globalZ = Math.floor((propLocations[i].z / Rsed.maasto_n.tile_size()) / 2);

                    const localX = Math.floor((((propLocations[i].x / Rsed.maasto_n.tile_size()) / 2) - globalX) * 256);
                    const localZ = Math.floor((((propLocations[i].z / Rsed.maasto_n.tile_size()) / 2) - globalZ) * 256);

                    newManifesto += ("5 " + (i + 1) + " " + globalX + " " + globalZ + " " + localX + " " + localZ + "\n");
                }
            }

            // Add command 4 for all props, except for the starting line, to make sure they're the right type.
            {
                const propNames = Rsed.maasto_n.prop_names();
                
                for (let i = 1; i < propNames.length; i++)
                {
                    const typeId = props_n.prop_idx_for_name(propNames[i]);

                    newManifesto += ("4 " + (i + 1) + " " + (typeId + 1) + "\n");
                }
            }

            newManifesto += "99\n";

            return newManifesto;
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/font.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 * The UI font.
 * 
 */

"use strict";

const ui_font_n = (function()
{
    const charWidth = 8;
    const charHeight = 8;
    const firstChar = ' ';
    const lastChar = '_';

    const X = "lightgray";
    const Z = 1;
    const W = "white";
    const L = "blue";
    const R = "gold";
    const _ = "dimgray";
    const charset = 
           [0,0,0,0,0,0,0,0, // Space
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,X,0,0,0,0, // #
            X,X,X,X,X,0,0,0,
            0,X,0,X,0,0,0,0,
            X,X,X,X,X,0,0,0,
            0,X,0,X,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,Z,Z,Z,0,0,0,	// $
            0,0,Z,0,0,Z,0,0,
            0,0,Z,0,0,0,Z,0,
            0,0,Z,0,0,Z,0,0,
            0,0,Z,Z,Z,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,	// %
            0,_,_,0,_,_,0,0,
            0,_,_,0,_,_,_,_,
            0,0,0,0,0,0,_,_,
            0,_,_,0,_,_,0,0,
            0,0,0,0,0,0,_,_,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,	// &
            0,W,W,L,W,W,0,0,
            0,W,W,L,W,W,W,W,
            0,L,L,L,L,L,W,W,
            0,W,W,L,W,W,L,L,
            0,0,0,0,0,0,W,W,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,    // *
            0,X,0,X,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,X,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,	//
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,	// @
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,	// G
            X,0,0,0,0,0,0,0,
            X,0,X,X,0,0,0,0,
            X,0,0,X,0,0,0,0,
            0,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0, // M
            X,X,X,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            ,0,0,0,0,0,0,0, // N
            X,0,X,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0, // Q
            X,0,0,X,0,0,0,0,
            X,0,0,X,0,0,0,0,
            X,0,X,X,0,0,0,0,
            0,X,X,X,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0, // W
            X,0,0,X,0,0,0,0,
            X,X,X,X,0,0,0,0,
            X,X,X,X,0,0,0,0,
            0,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            X,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            X,0,0,0,0,0,0,0,
            X,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            X,X,0,0,0,0,0,0,
            0,0,X,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,R,R,R,R,0,0,0, // ^.
            0,0,0,R,R,0,0,0,
            0,0,R,0,R,0,0,0,
            0,R,0,0,R,0,0,0,
            R,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,

            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,X,X,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0];

    const publicInterface = {};
    {
        // Returns a copy of the pixels in the charset of the given charactrr.
        publicInterface.character = function(ch = 'A')
        {
            let idx = ch.charCodeAt(0);
            k_assert(((idx >= firstChar.charCodeAt(0)) && (idx <= lastChar.charCodeAt(0)),
                     "Was asked for a font character that isn't in the charset."));

            // Convert to 0-indexed, where 0 is the first character.
            idx -= firstChar.charCodeAt(0);

            // Convert to a starting index of this character in the charset.
            idx = (idx * charWidth * charHeight);

            const character = charset.slice(idx, (idx + (charWidth * charHeight)));
            k_assert((character.length === (charWidth * charHeight)), "Failed to return the given character.");

            return character;
        }

        publicInterface.font_width = function() { return charWidth; }
        publicInterface.font_height = function() { return charHeight; }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/cursor.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 * The mouse cursor.
 * 
 */

"use strict";

const ui_cursor_n = (function()
{
    const cursorWidth = 16;
    const cursorHeight = 16;

    const X = 5;
    const Y = 6;
    const _ = 20;
    const graphic =
        [_,_,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        _,X,_,0,0,0,0,0,0,0,0,0,0,0,0,0,
        _,Y,X,_,0,0,0,0,0,0,0,0,0,0,0,0,
        _,Y,X,X,_,0,0,0,0,0,0,0,0,0,0,0,
        _,Y,Y,X,X,_,0,0,0,0,0,0,0,0,0,0,
        _,Y,Y,X,X,X,_,0,0,0,0,0,0,0,0,0,
        _,Y,Y,Y,X,X,X,_,0,0,0,0,0,0,0,0,
        _,Y,Y,Y,X,X,X,X,_,0,0,0,0,0,0,0,
        _,Y,Y,Y,Y,X,_,_,_,0,0,0,0,0,0,0,
        _,Y,_,_,Y,Y,_,0,0,0,0,0,0,0,0,0,
        _,_,0,0,_,Y,X,_,0,0,0,0,0,0,0,0,
        0,0,0,0,_,Y,Y,_,0,0,0,0,0,0,0,0,
        0,0,0,0,0,_,_,_,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    const publicInterface = {};
    {
        publicInterface.graphic = function()
        {
            return graphic.slice(0);
        }

        publicInterface.cursor_width = function() { return cursorWidth; }
        publicInterface.cursor_height = function() { return cursorHeight; }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/view.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 * 
 */

"use strict";

const ui_view_n = (function()
{
    const availableViews = Object.freeze(["3d", "3d-topdown", "2d-topdown"]);

    let currentView = availableViews[0];

    const publicInterface = {};
    {
        // Set to true to display the PALAT pane, i.e. a side window with thumbnails of all the
        // available PALA textures.
        publicInterface.showPalatPane = false;

        // Set to true if the user wants 3d models (and the ground) to be displayed with a wireframe
        // around each polygon.
        publicInterface.show3dWireframe = true;

        // Set to true if the user wants props to not be visible in the 3d view.
        publicInterface.hideProps = false;

        publicInterface.set_view = function(view = "")
        {
            k_assert(availableViews.includes(view), "Can't find the given view to set.");
            currentView = view;
        }

        publicInterface.toggle_view = function(firstView = "", secondView = "")
        {
            k_assert(availableViews.includes(firstView), "Can't find the given view to set.");
            k_assert(availableViews.includes(secondView), "Can't find the given view to set.");

            currentView = ((currentView === firstView)? secondView : firstView);
        }

        publicInterface.current_view = function()
        {
            k_assert(availableViews.includes(currentView), "Holding an invalid view.");
            return currentView.slice(0);
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/brush.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 * 
 */

"use strict";

const ui_brush_n = (function()
{
    // How large of a radius the brush paints with. A value of 0 means one tile.
    let brushSize = 0;

    // Which PALA texture the brush paints with, currently.
    let brushPalaIdx = 3;

    const publicInterface = {};
    {
        // Set to true to have the brush smoothen the terrain heightmap.
        publicInterface.brushSmoothens = false;

        publicInterface.brushAction = Object.freeze({void:0, changeHeight:1, changePala:2, smoothenGround:3});

        // Modify the terrain at the given x,y coordinates with the given brush action.
        publicInterface.apply_brush_to_terrain = function(brushAction = 0, value = 0, x = 0, y = 0)
        {
            for (let by = -brushSize; by <= brushSize; by++)
            {
                const tileZ = (y + by);
                if (tileZ < 0 || tileZ >= Rsed.maasto_n.track_side_length()) continue;

                for (let bx = -brushSize; bx <= brushSize; bx++)
                {
                    const tileX = (x + bx);
                    if (tileX < 0 || tileX >= Rsed.maasto_n.track_side_length()) continue;

                    switch (brushAction)
                    {
                        case this.brushAction.changeHeight:
                        {
                            if (this.brushSmoothens)
                            {
                                if (tileX < 1 || tileX >=  (Rsed.maasto_n.track_side_length() - 1)) continue;
                                if (tileZ < 1 || tileZ >= (Rsed.maasto_n.track_side_length() - 1)) continue;
    
                                let avgHeight = 0;
                                avgHeight += Rsed.maasto_n.maasto_height_at(tileX+1, tileZ);
                                avgHeight += Rsed.maasto_n.maasto_height_at(tileX-1, tileZ);
                                avgHeight += Rsed.maasto_n.maasto_height_at(tileX, tileZ+1);
                                avgHeight += Rsed.maasto_n.maasto_height_at(tileX, tileZ-1);
                                avgHeight += Rsed.maasto_n.maasto_height_at(tileX+1, tileZ+1);
                                avgHeight += Rsed.maasto_n.maasto_height_at(tileX+1, tileZ-1);
                                avgHeight += Rsed.maasto_n.maasto_height_at(tileX-1, tileZ+1);
                                avgHeight += Rsed.maasto_n.maasto_height_at(tileX-1, tileZ-1);
                                avgHeight /= 8;
                                    
                                Rsed.maasto_n.set_maasto_height_at(tileX, tileZ, Math.floor(((avgHeight + Rsed.maasto_n.maasto_height_at(tileX, tileZ) * 7) / 8)));
                            }
                            else
                            {
                                Rsed.maasto_n.set_maasto_height_at(tileX, tileZ, (Rsed.maasto_n.maasto_height_at(tileX, tileZ) + value));
                            }

                            break;
                        }
                        case this.brushAction.changePala:
                        {
                            Rsed.maasto_n.set_varimaa_tile_at(tileX, tileZ, value);

                            break;
                        }
                        default: k_assert(0, "Unknown brush action.");
                    }
                }
            }
        }

        publicInterface.set_brush_size = function(newSize = 0)
        {
            k_assert((newSize >= 0), "Attempted to set an invalid brush size.");
            brushSize = newSize;
        }

        publicInterface.brush_size = function()
        {
            return brushSize;
        }

        publicInterface.set_brush_pala_idx = function(newPalaIdx = 0)
        {
            k_assert((newPalaIdx >= 0), "Attempted to set an invalid brush PALA index.");
            brushPalaIdx = newPalaIdx;
        }
        
        publicInterface.brush_pala_idx = function()
        {
            return brushPalaIdx;
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/draw.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 * Renders the RallySportED UI.
 * 
 */

"use strict";

const ui_draw_n = (function()
{
    // The pixel buffer that UI render commands will draw into.
    let pixelSurface = null;

    // The mouse-picking pixel buffer tha UI render commands will write into.
    let mousePickBuffer = null;

    // This will hold a pre-baked PALAT pane image, i.e. thumbnails for all the PALA textures,
    // as RGBA color values. Its size (rows * columns) will be set dynamically depending on the
    // window resolution.
    const palatPaneBuffer = [];
    const palatPaneMousePick = [];
    let numPalatPaneCols = 9;
    let numPalatPaneRows = 29;
    let palatPaneWidth = ((numPalatPaneCols * (palat_n.pala_width() / 2)) + 1);
    let palatPaneHeight = ((numPalatPaneRows * (palat_n.pala_height() / 2)) + 1);
    
    function put_pixel(x = 0, y = 0, r = 255, g = 255, b = 255)
    {
        const idx = ((x + y * pixelSurface.width) * 4);
        pixelSurface.data[idx + 0] = r;
        pixelSurface.data[idx + 1] = g;
        pixelSurface.data[idx + 2] = b;
        pixelSurface.data[idx + 3] = 255;
    }

    function put_mouse_pick_value(x = 0, y = 0, value = 0)
    {
        mousePickBuffer[(x + y * pixelSurface.width)] = value;
    }

    // Draws the given set of paletted pixels (each being a value in the range 0..31 in Rally-Sport's
    // palette) of the given dimensions, starting at the x,y screen coordinates and working right/down.
    // If alpha is true, will not draw pixels that have a palette index of 0.
    function draw_image(pixels = [], mousePick = [], width = 0, height = 0, x = 0, y = 0, alpha = false)
    {
        // Convert from percentages into absolute screen coordinates.
        if (x < 0) x = Math.floor(-x * pixelSurface.width);
        if (y < 0) y = Math.floor(-y * pixelSurface.height);

        x = Math.floor(x);
        y = Math.floor(y);

        k_assert((mousePick instanceof Array ||mousePick === null), "Expected a valid mouse-picking buffer.");
        k_assert((pixelSurface != null), "Expected a valid pixel surface.");
        k_assert(((pixels[0] != null) && (pixels.length > 0)), "Expected a valid array of pixels.");
        k_assert(((width > 0) && (height > 0)), "Expected a valid image resolution.");
        k_assert(((x >= 0) || (x < pixelSurface.width) ||
                  (y >= 0) || (y < pixelSurface.height)), "Invalid screen coordinates for drawing the image.");

        for (let cy = 0; cy < height; cy++)
        {
            if ((y + cy) < 0) continue;
            if ((y + cy) >= pixelSurface.height) break;

            for (let cx = 0; cx < width; cx++)
            {
                if ((x + cx) < 0) continue;
                if ((x + cx) >= pixelSurface.width) break;

                const pixel = pixels[cx + cy * width];
                if (alpha && (pixel === 0)) continue;

                const color = ((pixel instanceof color_n.rgba_o)? pixel : palette_n.palette_idx_to_rgba(pixel));
                put_pixel((x + cx), (y + cy), color.r, color.g, color.b);

                if (mousePick != null)
                {
                    put_mouse_pick_value((x + cx), (y + cy), mousePick[cx + cy * width]);
                }
            }
        }
    }

    // Draws the given string onto the screen at the given coordinates.
    // NOTE: If a coordinate's value is less than 0, its absolute value is interpreted as a percentage
    // of the screen's resolution in the range 0..1.
    function draw_string(string = "", x = 0, y = 0)
    {
        string = String(string).toUpperCase();

        k_assert((pixelSurface != null), "Expected a valid pixel surface.");
        k_assert((string.length != null), "Expected a non-empty string");

        // Convert from percentages into absolute screen coordinates.
        if (x < 0) x = Math.floor(-x * pixelSurface.width);
        if (y < 0) y = Math.floor(-y * pixelSurface.height);

        // Draw the string, one character at a time.
        for (let i = 0; i < string.length; i++)
        {
            const character = ui_font_n.character(string[i]);
            const width = ui_font_n.font_width();
            const height = ui_font_n.font_height();
            draw_image(character, null, width, height, x, y, false);
            
            x += ((ui_font_n.font_width() / 2) + 0.3);
        }
    }

    // Draws the mouse cursor, and any indicators attached to it.
    function draw_mouse_cursor()
    {
        /// Drawing the mouse cursors directly into the canvas is disabled for performance reasons.
        /*const graphic = ui_cursor_n.graphic();
        const width = ui_cursor_n.cursor_width();
        const height = ui_cursor_n.cursor_height();
        draw_image(graphic, null, width, height, ui_input_n.mouse_pos_x(), ui_input_n.mouse_pos_y(), true);*/

        if (ui_input_n.mouse_hover_type() === ui_input_n.mousePickingType.ui &&
            ui_input_n.mouse_hover_args().elementId === ui_input_n.uiElement.palat_pane)
        {
            draw_string("PALA:" + ui_input_n.mouse_hover_args().x, ui_input_n.mouse_pos_x() + 10, ui_input_n.mouse_pos_y() + 17);
        }
        else if (ui_brush_n.brushSmoothens)
        {
            draw_string("SMOOTHING", ui_input_n.mouse_pos_x() + 10, ui_input_n.mouse_pos_y() + 17);
        }
    }

    function draw_watermark()
    {
        draw_string("RALLY", -.012, 3);
        draw_string("SPORT", -.012, 3 + ui_font_n.font_height()-1);
        draw_string("ED%", -.012, 3 + ((ui_font_n.font_height()-1) * 2));
    }

    function draw_footer_info()
    {
        const x = ui_input_n.mouse_tile_hover_x();
        const y = ui_input_n.mouse_tile_hover_y();

        let str = "HEIGHT:+000 PALA:000 X,Y:000,000";
        switch (ui_input_n.mouse_hover_type())
        {
            case ui_input_n.mousePickingType.ground:
            {
                const xStr = String(x).padStart(3, "0");
                const yStr = String(y).padStart(3, "0");
                const heightStr = (Rsed.maasto_n.maasto_height_at(x, y) < 0? "-" : "+") +
                                  String(Math.abs(Rsed.maasto_n.maasto_height_at(x, y))).padStart(3, "0");
                const palaStr = String(Rsed.maasto_n.varimaa_tile_at(x, y)).padStart(3, "0");

                str = "HEIGHT:" + heightStr + " PALA:" + palaStr +" X,Y:"+xStr+","+yStr;

                break;
            }
            case ui_input_n.mousePickingType.prop:
            {
                str = "PROP:" + props_n.prop_name_for_idx(ui_input_n.mouse_hover_args().idx) +
                      " IDX:" + ui_input_n.mouse_hover_args().idx + "(" + ui_input_n.mouse_hover_args().trackId + ")";
            }
        }

        draw_string(str, 0, rsed_n.render_height() - ui_font_n.font_height()-0);
    }

    function draw_fps()
    {
        const fpsString = "FPS: " + Math.round((1000 / (rsed_n.render_latency() || 1)));
        draw_string(fpsString, pixelSurface.width - (fpsString.length * ui_font_n.font_width()/2) - 73, 3);
    }

    function draw_palat_pane()
    {
        if (palatPaneBuffer.length > 0)
        {
            draw_image(palatPaneBuffer, palatPaneMousePick, palatPaneWidth, palatPaneHeight, 0, 0);
        }
    }

    function draw_minimap()
    {
        // The minimap image by iterating over the tilemap and grabbing a pixel off each corresponding
        // PALA texture.
        /// TODO: You can pre-generate the image rather than re-generating it each frame.
        const width = 64;
        const height = 32;
        const xMul = (Rsed.maasto_n.track_side_length() / width);
        const yMul = (Rsed.maasto_n.track_side_length() / height);
        const image = [];   // An array of palette indices that forms the minimap image.
        const mousePick = [];
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                const tileX = (x * xMul);
                const tileZ = (y * yMul);

                const pala = palat_n.pala_texture(Rsed.maasto_n.varimaa_tile_at(tileX, tileZ));
                let color = ((pala == null)? 0 : pala.paletteIndices[1]);

                // Have a black outline.
                if (y % (height - 1) === 0) color = "black";
                if (x % (width - 1) === 0) color = "black";

                image.push(color);
                mousePick.push(ui_input_n.create_mouse_picking_id(ui_input_n.mousePickingType.ui,
                                                                  {elementId:ui_input_n.uiElement.minimap,
                                                                   uiX:tileX, uiY:tileZ}));
            }
        }

        draw_image(image, null, width, height, pixelSurface.width - width - 4, 3, false);

        // Draw a frame around the camera view on the minimap.
        if (image && xMul && yMul)
        {
            const frame = [];
            const frameWidth = Math.round((Rsed.camera_n.view_width() / xMul));
            const frameHeight = Math.floor((Rsed.camera_n.view_height() / yMul));
            
            for (let y = 0; y < frameHeight; y++)
            {
                for (let x = 0; x < frameWidth; x++)
                {
                    let color = 0;
                    if (y % (frameHeight - 1) === 0) color = "yellow";
                    if (x % (frameWidth - 1) === 0) color = "yellow";

                    frame.push(color);
                }
            }

            const camX = (Rsed.camera_n.pos_x() / xMul);
            const camZ = (Rsed.camera_n.pos_z() / yMul);
            draw_image(frame, null, frameWidth, frameHeight, pixelSurface.width - width - 4 + camX, 3 + camZ, true);
        }
    }

    function draw_active_pala()
    {
        const currentPala = ui_brush_n.brush_pala_idx();
        const pala = palat_n.pala_texture(currentPala);

        if (pala != null)
        {
            draw_image(pala.paletteIndices, null, 16, 16, pixelSurface.width - 16 - 5, 34 + 3, false);
            draw_string((ui_brush_n.brush_size() + 1) + "*", pixelSurface.width - 16 - 4 + 6, 34 + 3 + 16)
        }
    }

    /// FIXME: This gets very slow to draw, because each pixel is paletted. Pre-bake the image as RGBA values
    /// into a buffer and just blit it out, updating the buffer whenever you edit the VARIMAA.
    function draw_paint_view()
    {
        // Draw a large minimap of the track in the middle of the screen.
        const width = Math.floor(rsed_n.render_width() * 0.81);
        const height = Math.floor(rsed_n.render_height() * 0.72);
        {
            const xMul = (Rsed.maasto_n.track_side_length() / width);
            const zMul = (Rsed.maasto_n.track_side_length() / height);
            const image = [];   // An array of palette indices that forms the minimap image.
            const mousePick = [];

            for (let z = 0; z < height; z++)
            {
                for (let x = 0; x < width; x++)
                {
                    const tileX = Math.floor(x * xMul);
                    const tileZ = Math.floor(z * zMul);

                    const pala = palat_n.pala_texture(Rsed.maasto_n.varimaa_tile_at(tileX, tileZ));
                    let color = ((pala == null)? 0 : pala.paletteIndices[1]);

                    // Create an outline.
                    if (z % (height - 1) === 0) color = "gray";
                    if (x % (width - 1) === 0) color = "gray";

                    // Indicate the location of the track's checkpoint.
                    if ((tileX === Rsed.maasto_n.track_checkpoint_x()) &&
                        (tileZ === Rsed.maasto_n.track_checkpoint_y()))
                    {
                        color = "white";
                    }

                    image.push(color);
                    mousePick.push(ui_input_n.create_mouse_picking_id(ui_input_n.mousePickingType.ui,
                        {elementId:ui_input_n.uiElement.large_minimap,
                        uiX:tileX, uiY:tileZ}));
                }
            }



            draw_image(image, mousePick, width, height, ((pixelSurface.width / 2) - (width / 2)), ((pixelSurface.height / 2) - (height / 2)), false);
        }

        draw_string("TRACK SIZE:" + Rsed.maasto_n.track_side_length() + "," + Rsed.maasto_n.track_side_length(),
                    ((pixelSurface.width / 2) - (width / 2)),
                    ((pixelSurface.height / 2) - (height / 2)) - ui_font_n.font_height());
    }

    const publicInterface = {};
    {
        // Call this when RallySportED crashes and you want the user to be given a visual indication of that
        // on the render surface.
        // NOTE: Avoid calling k_assert in this function, since the function itself may be called on asserts.
        publicInterface.draw_crash_message = function(renderSurface, message)
        {
            if (!(renderSurface instanceof Rsed.render_surface_n.render_surface_o)) return;

            pixelSurface = renderSurface.exposed().getImageData(0, 0, renderSurface.width, renderSurface.height);

            draw_string(">RALLYSPORTED CRASHED. SORRY ABOUT THAT!", 2, ui_font_n.font_height());

            renderSurface.exposed().putImageData(pixelSurface, 0, 0);
            pixelSurface = null;
        }

        publicInterface.draw_ui = function(renderSurface = Rsed.render_surface_n.render_surface_o)
        {
            k_assert((renderSurface instanceof Rsed.render_surface_n.render_surface_o), "Expected to receive the render surface.");

            // Draw the UI.
            pixelSurface = renderSurface.exposed().getImageData(0, 0, renderSurface.width, renderSurface.height);
            mousePickBuffer = renderSurface.mousePickBuffer;
            k_assert((mousePickBuffer.length === (pixelSurface.width * pixelSurface.height)), "Incompatible mouse-picking buffer.");
            {
                switch (ui_view_n.current_view())
                {
                    case "3d":
                    case "3d-topdown":
                    {
                        //draw_fps();
                        draw_watermark();
                        draw_minimap();
                        draw_active_pala();
                        draw_footer_info();
                        if (ui_view_n.showPalatPane) draw_palat_pane();

                        break;
                    }
                    case "2d-topdown":
                    {
                        draw_paint_view();
                        draw_active_pala();
                        if (ui_view_n.showPalatPane) draw_palat_pane();
                        
                        break;
                    }
                    default: break;
                }

                draw_mouse_cursor();
            }
            renderSurface.exposed().putImageData(pixelSurface, 0, 0);
            pixelSurface = null;
            mousePickBuffer = null;
        }

        // Create a set of thumbnails of the contents of the current PALAT file. We'll display this pane of
        // thumbnails to the user for selecting PALAs.
        publicInterface.prebake_palat_pane = function()
        {
            const maxNumPalas = 253;
            if (palat_n.num_palas() < maxNumPalas) return;

            palatPaneBuffer.length = 0;
            palatPaneMousePick.length = 0;

            // Recompute the pane's dimensions based on the current display size.
            /// FIXME: Leaves unnecessary empty rows for some resolutions.
            numPalatPaneRows = (Math.floor(rsed_n.render_height() / 8) - 1);
            numPalatPaneCols = Math.ceil(253 / numPalatPaneRows);
            palatPaneWidth = ((numPalatPaneCols * (palat_n.pala_width() / 2)) + 1);
            palatPaneHeight = ((numPalatPaneRows * (palat_n.pala_height() / 2)) + 1);
        
            let palaIdx = 0;
            for (let y = 0; y < numPalatPaneRows; y++)
            {
                for (let x = 0; x < numPalatPaneCols; (x++, palaIdx++))
                {
                    if (palaIdx > maxNumPalas) break;

                    const pala = palat_n.pala_texture(palaIdx);
                    for (let py = 0; py < palat_n.pala_height(); py++)
                    {
                        for (let px = 0; px < palat_n.pala_width(); px++)
                        {
                            const palaTexel = Math.floor(px + py * palat_n.pala_width());
                            const bufferTexel = Math.floor((Math.floor(x * palat_n.pala_width() + px) / 2) +
                                                            Math.floor((y * palat_n.pala_height() + py) / 2) * palatPaneWidth);

                            palatPaneBuffer[bufferTexel] = palette_n.palette_idx_to_rgba(pala.paletteIndices[palaTexel]);
                            palatPaneMousePick[bufferTexel] = ui_input_n.create_mouse_picking_id(ui_input_n.mousePickingType.ui,
                                                                                                 {elementId:ui_input_n.uiElement.palat_pane, uiX:palaIdx, uiY:0});
                        }
                    }
                }
            }

            // Draw a grid over the PALA thumbnails.
            for (let i = 0; i < numPalatPaneRows * palat_n.pala_height()/2; i++)
            {
                for (let x = 0; x < numPalatPaneCols; x++)
                {
                    palatPaneBuffer[(x * palat_n.pala_width()/2) + i * palatPaneWidth] = "black";
                }
            }
            for (let i = 0; i < numPalatPaneCols * palat_n.pala_width()/2; i++)
            {
                for (let y = 0; y < numPalatPaneRows; y++)
                {
                    palatPaneBuffer[i + (y * palat_n.pala_height()/2) * palatPaneWidth] = "black";
                }
            }
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/input.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 * Handles user input.
 * 
 */

"use strict";

const ui_input_n = (function()
{
    const publicInterface = {};

    // The current x,y pixel position of the mouse on the screen.
    const mousePos = new geometry_n.vector2_o(0, 0);

    // The number of pixels the mouse has moved since the last time set_mouse_pos() was called.
    const mousePosDelta = new geometry_n.vector2_o(0, 0);

    // The x,y coordinates of the ground tile the mouse is currently hovering over.
    const mouseTileHover = new geometry_n.vector2_o(-1, -1);

    // Whenever the user presses down a mouse button, this object gets filled with relevant information
    // about the click's target (e.g. track prop), so we can maintain that information across frames.
    // This helps us prevent, for instance, accidentally grabbing a prop when moving the mouse over it
    // while painting the ground.
    let mouseLock = null;

    // Mouse-picking information about what's under the cursor at present.
    /// TODO. Move mouse-picking stuff into its own unit.
    let hoverPickType = 0;
    let hoverArgs = {};

    // Bit sizes for the various arguments that can be stored in the mouse-picking id.
    /// TODO. Move mouse-picking stuff into its own unit.
    const numBitsForIndex = 5;
    const numBitsForTileCoords = 13;
    const numBitsForPropIdx = 10;
    const numBitsForPropTrackId = 10;
    const numBitsForUiElementId = 5;
    const numBitsForUiCoord = 11;

    // Mouse button statuses.
    let mouseLeftPressed = false;
    let mouseMiddlePressed = false;
    let mouseRightPressed = false;

    // Modifier key statuses.
    let ctrlPressed = false;
    let shiftPressed = false;

    // Keyboard key statuses.
    const keyDown = [];

    function enact_key_presses()
    {
        const movement = new geometry_n.vector3_o(0, 0, 0);

        if (keyDown["s"]) movement.x += -1;
        if (keyDown["f"]) movement.x += 1;
        if (keyDown["e"]) movement.z += -1;
        if (keyDown["d"]) movement.z += 1;

        //movement.normalize(); /// TODO: Disabled for now, since diagonal movement is too jerky without the double movement speed.
        Rsed.camera_n.move_camera(movement.x, movement.y, movement.z);
    }

    // Depending on which mouse button (if any) the user has pressed, make corresponding things happen.
    function enact_mouse_clicks()
    {
        if (!(mouseLeftPressed | mouseRightPressed | mouseMiddlePressed)) 
        {
            mouseLock = null;
            return;
        }

        // If we don't already have mouse lock, see which lock we should acquire, based on what the
        // user clicked on.
        if (mouseLock == null)
        {
            switch (hoverPickType)
            {
                case publicInterface.mousePickingType.prop:
                {
                    mouseLock = {grab:"prop",propTrackId:ui_input_n.mouse_hover_args().trackId};
                    break;
                }
                case publicInterface.mousePickingType.ground:
                {
                    mouseLock = {grab:"ground"};
                    break;
                }
                case publicInterface.mousePickingType.ui:
                {
                    mouseLock = {grab:"ui",
                                 elementId:hoverArgs.elementId,
                                 x:hoverArgs.x,
                                 y:hoverArgs.y};  
                    break;
                }
                case publicInterface.mousePickingType.void:
                {
                    return;
                }
                default: k_assert(0, "Unhandled mouse lock type."); break;
            }
        }
        else if (mouseLock.hibernating)
        {
            return;
        }

        // Commit an action depending on what the user clicked on.
        /// FIXME: The nested code gets a bit ugly/unclear here.
        switch (mouseLock.grab)
        {
            case "ground":
            {
                if (hoverPickType !== publicInterface.mousePickingType.ground) return;

                if (shiftPressed)
                {
                    // Add a new prop.
                    if (mouseLeftPressed)
                    {
                        const x = Rsed.maasto_n.clamped_to_track_prop_boundaries(hoverArgs.tileX * Rsed.maasto_n.tile_size());
                        const z = Rsed.maasto_n.clamped_to_track_prop_boundaries(hoverArgs.tileZ * Rsed.maasto_n.tile_size());

                        Rsed.maasto_n.add_prop_location(rsed_n.underlying_track_id(), "tree", x, 0, z);

                        mouseLock.hibernating = true;
                    }
                }
                // Edit/paint the terrain.
                else
                {
                    if (mouseLeftPressed | mouseRightPressed)
                    {
                        const delta = (mouseLeftPressed? 2 : (mouseRightPressed? -2 : 0));
                        ui_brush_n.apply_brush_to_terrain(ui_brush_n.brushAction.changeHeight, delta,
                                                        hoverArgs.tileX, hoverArgs.tileZ);
                    }
                    else if (mouseMiddlePressed)
                    {
                        ui_brush_n.apply_brush_to_terrain(ui_brush_n.brushAction.changePala, ui_brush_n.brush_pala_idx(),
                                                          hoverArgs.tileX, hoverArgs.tileZ);
                    }
                }

                break;
            }
            case "prop":
            {
                k_assert((mouseLock.propTrackId != null), "Expected the prop track id as a parameter to prop grabs.");

                if (mouseLeftPressed)
                {
                    // Remove the selected prop.
                    if (shiftPressed)
                    {
                        Rsed.maasto_n.remove_prop(mouseLock.propTrackId);
                        mouseLock.hibernating = true;
                    }
                    // Drag the prop.
                    else
                    {
                        // For now, don't allow moving the starting line (prop #0).
                        if (mouseLock.propTrackId !== 0)
                        {
                            Rsed.maasto_n.move_prop(mouseLock.propTrackId, ui_input_n.mouse_pos_delta_x()*6, ui_input_n.mouse_pos_delta_y()*12)
                        }
                    }
                }

                break;
            }
            case "ui":
            {
                k_assert((mouseLock.elementId != null), "Expected the element id as a parameter to ui grabs.");
                k_assert((mouseLock.x != null && mouseLock.y != null), "Expected x,y coordinates as parameters to ui grabs.");

                switch (mouseLock.elementId)
                {
                    case publicInterface.uiElement.palat_pane:
                    {
                        if (mouseLeftPressed | mouseRightPressed) ui_brush_n.set_brush_pala_idx(mouseLock.x);

                        break;
                    }
                    case publicInterface.uiElement.large_minimap:
                    {
                        if (mouseMiddlePressed)
                        {
                            ui_brush_n.apply_brush_to_terrain(ui_brush_n.brushAction.changePala, ui_brush_n.brush_pala_idx(),
                                                              mouseLock.x, mouseLock.y);
                                               
                            // We want the user to be able to paint by dragging the cursor, so we release the mouse lock here
                            // and let it refresh itself next frame with a (potentially) new cursor position.
                            mouseLock = null;
                        }

                        break;
                    }
                    default: k_assert(0, "Unhandled UI element click."); break;
                }
                break;
            }
            default: k_assert(0, "Unknown mouse grab type."); break;
        }
    }
    
    function reset_mouse_hover_info()
    {
        hoverPickType = 0;
        hoverArgs = {};
        
        mouseTileHover.x = -1000;
        mouseTileHover.y = -1000;
    }

    // Public interface.
    {
        publicInterface.mousePickingType = Object.freeze({void:0, ground:1, prop:2, ui:3});

        // The different user-interactible elements in the UI. Their index values in this list will be
        // used for mouse-picking identification.
        publicInterface.uiElement = Object.freeze({void:0, palat_pane:1, minimap:2, large_minimap:3, active_pala:4});

        // Encodes the given arguments into a single 32-bit value, which can be e.g. written into a
        // mouse-picking buffer element for later extraction. The picking type string decides in which
        // pre-set order/manner the arguments should be packed.
        publicInterface.create_mouse_picking_id = function(pickType = 0, args = {})
        {
            k_assert(((pickType & ((1<<numBitsForIndex)-1)) === pickType), "Can't store the picking index in the given number of bytes.");

            let id = pickType;
            switch (pickType)
            {
                case this.mousePickingType.void:
                {
                    return id;
                }
                case this.mousePickingType.ui:
                {
                    const numBitsRequired = (numBitsForUiElementId + (numBitsForUiCoord * 2) + numBitsForIndex);

                    k_assert((numBitsRequired <= 32), "Not enough bits to store the mouse-picking args for a UI element.");
                    k_assert((args.elementId != null && args.uiX != null && args.uiY != null), "Missing arguments for a UI picking id.");

                    id |= (args.uiX << numBitsForIndex);
                    id |= (args.uiY << (numBitsForIndex + numBitsForUiCoord));
                    id |= (args.elementId << (numBitsForIndex + (numBitsForUiCoord * 2)));

                    return id;
                }
                case this.mousePickingType.prop:
                {
                    const numBitsRequired = (numBitsForPropIdx + numBitsForPropTrackId + numBitsForIndex);

                    k_assert((numBitsRequired <= 32), "Not enough bits to store the mouse-picking args for a prop.");
                    k_assert((args.propIdx != null && args.propTrackId != null), "Missing arguments for a prop picking id.");

                    id |= (args.propIdx << numBitsForIndex);
                    id |= (args.propTrackId << (numBitsForIndex + numBitsForPropIdx));

                    return id;
                }
                case this.mousePickingType.ground:
                {
                    const numBitsRequired = (numBitsForTileCoords * 2 + numBitsForIndex);

                    k_assert((numBitsRequired <= 32), "Not enough bits to store the mouse-picking args for a ground tile.");
                    k_assert((args.tileX != null && args.tileZ != null), "Missing arguments for a ground picking id.");

                    // The tile coordinates can be out of bounds when the camera is moved outside of the
                    // track's boundaries. In that case, simply ignore them, since there's no interactible
                    // ground elements outside of the track.
                    if ((args.tileX < 0) || (args.tileX >= Rsed.maasto_n.track_side_length()) ||
                        (args.tileZ < 0) || (args.tileZ >= Rsed.maasto_n.track_side_length()))
                    {
                        return null;
                    }

                    k_assert(((args.tileX & ((1<<numBitsForTileCoords)-1)) === args.tileX), "Can't store the MAASTO x coordinate in the picking id.");
                    k_assert(((args.tileZ & ((1<<numBitsForTileCoords)-1)) === args.tileZ), "Can't store the MAASTO z coordinate in the picking id.");

                    id |= (args.tileX << numBitsForIndex);
                    id |= (args.tileZ << (numBitsForIndex + numBitsForTileCoords));

                    return id;
                }
                default: k_assert(0, "Undefined mouse-picking case when packing."); return null;
            }

            k_assert(0, "Fell through (shouldn't have) when creating a mouse-picking id.");
        }

        publicInterface.get_mouse_picking_type = function(mousePickingValue)
        {
            return (mousePickingValue & ((1 << numBitsForIndex) - 1));
        }

        publicInterface.reset_mouse_hover_info = function()
        {
            hoverPickType = 0;
            hoverArgs = {};
        }

        publicInterface.get_mouse_picking_args = function(mousePickingValue = 0, pickType = 0)
        {
            const args = {};
            switch (pickType)
            {
                case this.mousePickingType.ui:
                {
                    const coordMask = ((1 << numBitsForUiCoord) - 1);
                    const idMask = ((1 << numBitsForUiElementId) - 1);
                    args.x = ((mousePickingValue >>> numBitsForIndex) & coordMask);
                    args.y = ((mousePickingValue >>> (numBitsForIndex + numBitsForUiCoord)) & coordMask);
                    args.elementId = ((mousePickingValue >>> (numBitsForIndex + (numBitsForUiCoord * 2))) & idMask);

                    return args;
                }
                case this.mousePickingType.ground:
                {
                    const mask = ((1 << numBitsForTileCoords) - 1);
                    args.tileX = ((mousePickingValue >>> numBitsForIndex) & mask);
                    args.tileZ = ((mousePickingValue >>> (numBitsForIndex + numBitsForTileCoords)) & mask);

                    return args;
                }
                case this.mousePickingType.prop:
                {
                    const mask = ((1 << numBitsForPropIdx) - 1);
                    args.idx = ((mousePickingValue >>> numBitsForIndex) & mask);
                    args.trackId = ((mousePickingValue >>> (numBitsForIndex + numBitsForPropIdx)) & mask);

                    return args;
                }
                default: return null;
            }

            k_assert(0, "Fell through (shouldn't have) when extracting mouse-picking args.");
        }

        publicInterface.enact_inputs = function()
        {
            enact_mouse_clicks();
            enact_key_presses();

            // Mouse position deltas shouldn't carry across frames, so now that we've enacted all inputs,
            // we can reset them.
            mousePosDelta.x = 0;
            mousePosDelta.y = 0;
        }

        publicInterface.set_mouse_pos = function(x = 0, y = 0)
        {
            // Don't set the mouse position out of bounds.
            if ((x < 0 || x >= rsed_n.render_width()) ||
                (y < 0 || y >= rsed_n.render_height()))
            {
                return;
            }

            mousePosDelta.x = (x - mousePos.x);
            mousePosDelta.y = (y - mousePos.y);

            mousePos.x = x;
            mousePos.y = y;

            // Update mouse-picking info, i.e. find out what the mouse cursor is hovering over.
            {
                reset_mouse_hover_info();

                const mousePickValue = rsed_n.mouse_pick_buffer_value_at(x, y);
                hoverPickType = this.get_mouse_picking_type(mousePickValue);
                hoverArgs = this.get_mouse_picking_args(mousePickValue, hoverPickType);

                switch(hoverPickType)
                {
                    case this.mousePickingType.ground:
                    {
                        mouseTileHover.x = hoverArgs.tileX;
                        mouseTileHover.y = hoverArgs.tileZ;

                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
        }

        publicInterface.reset_modifier_key_statuses = function()
        {
            ctrlPressed = false;
            shiftPressed = false;
        }

        // Inform us of a key up/down event. Note: Takes in a HTML onkey* event.
        publicInterface.update_key_status = function(keyEvent, isDown)
        {
            if (keyEvent.ctrlKey ||
                keyEvent.key === "Control") /// TODO: With which browsers would (key === "control") fail to detect?
            {
                ctrlPressed = isDown;
            }
            if (keyEvent.shiftKey ||
                keyEvent.key === "Shift") /// TODO: With which browsers would (key === "shift") fail to detect?
            {
                shiftPressed = isDown;
            }
            else
            {
                /// FIXME: Depending on the browser, the correct code could be in .keyCode or .which.
                const key = String.fromCharCode(keyEvent.keyCode).toLowerCase();
                keyDown[key] = isDown;
            }
        }

        publicInterface.mouse_pos_x = function() { return mousePos.x; }
        publicInterface.mouse_pos_y = function() { return mousePos.y; }

        publicInterface.mouse_pos_delta_x = function() { return mousePosDelta.x; }
        publicInterface.mouse_pos_delta_y = function() { return mousePosDelta.y; }

        publicInterface.mouse_tile_hover_x = function() { return mouseTileHover.x; }
        publicInterface.mouse_tile_hover_y = function() { return mouseTileHover.y; }

        publicInterface.mouse_hover_type = function() { return (hoverPickType || null); }
        publicInterface.mouse_hover_args = function() { return hoverArgs; }

        publicInterface.set_left_click = function(isDown) { mouseLeftPressed = isDown; }
        publicInterface.set_right_click = function(isDown) { mouseRightPressed = isDown; }
        publicInterface.set_middle_click = function(isDown) { mouseMiddlePressed = isDown; }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/render/line_draw.js
 *
 * Tarpeeksi Hyvae Soft 2018
 * 
 */

"use strict";

Rsed.draw_line_n = (function()
{
    const publicInterface = {};
    {
        // 'Draw' a Bresenham line between the two points into a 1d array. In other words, each element
        // in the array represents the y coordinate, and each value at that element the x coordinate.
        publicInterface.line_into_array = function(vert1 = geometry_n.vertex_o,
                                                   vert2 = geometry_n.vertex_o,
                                                   array = [], yOffset = 0)
        {
            k_assert((vert1 instanceof geometry_n.vertex_o), "Expected a vertex.");
            k_assert((vert2 instanceof geometry_n.vertex_o), "Expected a vertex.");

            yOffset = Math.floor(yOffset);

            let x0 = Math.floor(vert1.x);
            let y0 = Math.floor(vert1.y);
            const x1 = Math.floor(vert2.x);
            const y1 = Math.floor(vert2.y);

            // If true, we won't touch non-null elements in the array. Useful in preventing certain
            // edge rendering errors.
            const noOverwrite = (y1 <= y0);

            // Bresenham line algo. Adapted from https://stackoverflow.com/a/4672319.
            {
                let dx = Math.abs(x1 - x0);
                let dy = Math.abs(y1 - y0);
                const sx = (x0 < x1)? 1 : -1;
                const sy = (y0 < y1)? 1 : -1; 
                let err = (((dx > dy)? dx : -dy) / 2);
                
                while (true)
                {
                    // Mark the pixel.
                    if (noOverwrite)
                    {
                        if (array[y0 - yOffset] == null) array[y0 - yOffset] = x0;
                    }
                    else
                    {
                        array[y0 - yOffset] = x0;
                    }

                    if ((x0 === x1) &&
                        (y0 === y1))
                    {
                        break;
                    }

                    const e2 = err;
                    if (e2 > -dx)
                    {
                        err -= dy;
                        x0 += sx;
                    }
                    if (e2 < dy)
                    {
                        err += dx;
                        y0 += sy;
                    }
                }
            }
        }

        publicInterface.line_onto_canvas = function(vert1 = geometry_n.vertex_o, vert2 = geometry_n.vertex_o,
                                                    canvas = [], width = 0, height = 0,
                                                    r = 0, g = 0, b = 0)
        {
            k_assert((canvas.length > 0), "Expected the canvas to be a non-zero-length array.");
            k_assert((vert1 instanceof geometry_n.vertex_o), "Expected a vertex.");
            k_assert((vert2 instanceof geometry_n.vertex_o), "Expected a vertex.");

            function put_pixel(x = 0, y = 0)
            {
                if (x < 0 || x >= width) return;
                if (y < 0 || y >= height) return;

                const idx = ((x + y * width) * 4);
                canvas[idx + 0] = r;
                canvas[idx + 1] = g;
                canvas[idx + 2] = b;
                canvas[idx + 3] = 255;
            }

            let x0 = Math.floor(vert1.x);
            let y0 = Math.floor(vert1.y);
            const x1 = Math.floor(vert2.x);
            const y1 = Math.floor(vert2.y);

            // Bresenham line algo. Adapted from https://stackoverflow.com/a/4672319.
            {
                let dx = Math.abs(x1 - x0);
                let dy = Math.abs(y1 - y0);
                const sx = (x0 < x1)? 1 : -1;
                const sy = (y0 < y1)? 1 : -1; 
                let err = (((dx > dy)? dx : -dy) / 2);
                
                while (true)
                {
                    put_pixel(x0, y0);

                    if ((x0 === x1) &&
                        (y0 === y1))
                    {
                        break;
                    }

                    const e2 = err;
                    if (e2 > -dx)
                    {
                        err -= dy;
                        x0 += sx;
                    }
                    if (e2 < dy)
                    {
                        err += dx;
                        y0 += sy;
                    }
                }
            }
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/render/ngon_fill.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * An n-gon rasterizer for the HTML5 canvas.
 * Note that the drawing functions expect 'this' to point to the render surface object into whose
 * render context/pixel buffers we'll rasterize.
 * 
 */

"use strict";

Rsed.ngon_fill_n = (function()
{
    const publicInterface = {};
    {
        publicInterface.fill_polygons = function(polygons = [])
        {
            k_assert((this instanceof Rsed.render_surface_n.render_surface_o), "Expected the function to be bound to a render surface.");
            k_assert((polygons[0] instanceof geometry_n.polygon_o), "Expected polygons.");
            k_assert((polygons.length > 0), "Received an empty list of triangles to rasterize.");

            const surface = this;
            const width = surface.width;
            const height = surface.height;

            // We'll rasterize the polygons into the canvas's pixel array.
            const pixelMap = surface.exposed().getImageData(0, 0, width, height);

            for (let i = 0; i < polygons.length; i++)
            {
                k_assert((polygons[i] instanceof geometry_n.polygon_o), "Expected a polygon");

                const poly = new geometry_n.polygon_o(polygons[i].v.length);
                poly.clone_from(polygons[i]);

                // Find which of the polygon's vertices form the polygon's left side and which the right.
                // With that information, we can then fill in the horizontal pixel spans between them.
                // The vertices will be arranged such that the first entry in the 'left' list will be the
                // polygon's top-most (lowest y) vertex, and entries after that successively higher in y.
                // For the 'right' list, the first entry will be the polygon's bottom-most vertex, and
                // entries following successively lower in y. In other words, by tracing the vertices
                // first through 'left' and then 'right', you end up with an anti-clockwise loop around
                // the polygon.
                const leftVerts = [];
                const rightVerts = [];
                {
                    // Sort the vertices by increasing y, i.e. by height.
                    poly.v.sort(function(a, b){ return (a.y === b.y)? 0 : ((a.y < b.y)? -1 : 1); });
                    const topVert = poly.v[0];
                    const bottomVert = poly.v[poly.v.length-1];

                    // The left side will always start with the top-most vertex, and the right side with
                    // the bottom-most vertex.
                    leftVerts.push(topVert);
                    rightVerts.push(bottomVert);

                    // Trace a line along x,y between the top-most vertex and the bottom-most vertex; and for
                    // the two intervening vertices, find whether they're to the left or right of that line on
                    // x. Being on the left side of that line means the vertex is on the polygon's left side,
                    // and same for the right side.
                    for (let p = 1; p < (poly.v.length-1); p++)
                    {
                        const lr = k_lerp(topVert.x, bottomVert.x, ((poly.v[p].y - topVert.y) / (bottomVert.y - topVert.y)));
                        
                        if (poly.v[p].x >= lr)
                        {
                            rightVerts.push(poly.v[p]);
                        }
                        else
                        {
                            leftVerts.push(poly.v[p]);
                        }
                    }

                    // Sort the two sides' vertices so that we can trace them anti-clockwise starting from the top,
                    // going down to the bottom vertex on the left side, and then back up to the top vertex along
                    // the right side.
                    leftVerts.sort(function(a, b){ return (a.y === b.y)? 0 : ((a.y < b.y)? -1 : 1); });
                    rightVerts.sort(function(a, b){ return (a.y === b.y)? 0 : ((a.y > b.y)? -1 : 1); });

                    k_assert(((leftVerts.length !== 0) && (rightVerts.length !== 0)), "Expected each side list to have at least one vertex.");
                    k_assert(((leftVerts.length + rightVerts.length) === poly.v.length), "Vertices appear to have gone missing.");
                }

                // Create arrays where the index represents the y coordinate and the values x
                // coordinates at that y.
                let leftEdge = [];
                let rightEdge = [];
                {
                    let prevVert = leftVerts[0];
                    for (let l = 1; l < leftVerts.length; l++)
                    {
                        Rsed.draw_line_n.line_into_array(prevVert, leftVerts[l], leftEdge, poly.v[0].y);
                        prevVert = leftVerts[l];
                    }
                    Rsed.draw_line_n.line_into_array(prevVert, rightVerts[0], leftEdge, poly.v[0].y);
                    prevVert = rightVerts[0];
                    for (let r = 1; r < rightVerts.length; r++)
                    {
                        Rsed.draw_line_n.line_into_array(prevVert, rightVerts[r], rightEdge, poly.v[0].y);
                        prevVert = rightVerts[r];
                    }
                    Rsed.draw_line_n.line_into_array(prevVert, leftVerts[0], rightEdge, poly.v[0].y);
                }

                // Draw the polygon.
                {
                    // Solid or textured fill.
                    if (!poly.isEthereal)
                    {
                        const polyYOffset = Math.floor(poly.v[0].y);
                        const polyHeight = leftEdge.length;
                        const texture = poly.texture;

                        let v = 0;
                        const vDelta = ((texture == null)? 0 : ((texture.height - 0.001) / (polyHeight-1)));

                        for (let y = 0; y < polyHeight; y++)
                        {
                            const rowWidth = (rightEdge[y] - leftEdge[y]);
                            if (rowWidth <= 0) continue;

                            let u = 0;
                            const uDelta = ((texture == null)? 0 : ((texture.width - 0.001) / rowWidth));

                            while (leftEdge[y] <= rightEdge[y])
                            {
                                if (leftEdge[y] >= 0 && leftEdge[y] < width)
                                {
                                    const px = leftEdge[y];
                                    const py = (y + polyYOffset);

                                    if (py >= 0 && py < height)
                                    {
                                        const idx = ((px + py * width) * 4);
                                        
                                        // Solid fill.
                                        if (texture == null)
                                        {
                                            pixelMap.data[idx + 0] = poly.color.r;
                                            pixelMap.data[idx + 1] = poly.color.g;
                                            pixelMap.data[idx + 2] = poly.color.b;
                                            pixelMap.data[idx + 3] = poly.color.a;
                                        }
                                        // Textured fill.
                                        else
                                        {
                                            const texelIdx = (Math.floor(u) + Math.floor(v) * texture.width);
                                            const color = texture.pixels[texelIdx];
            
                                            // Alpha testing.
                                            if (!texture.hasAlpha || texture.paletteIndices[texelIdx] != 0)
                                            {
                                                pixelMap.data[idx + 0] = color.r;
                                                pixelMap.data[idx + 1] = color.g;
                                                pixelMap.data[idx + 2] = color.b;
                                                pixelMap.data[idx + 3] = color.a;
                                            }
                                        }

                                        if (poly.mousePickId !== null)
                                        {
                                            surface.mousePickBuffer[px + py * width] = poly.mousePickId;
                                        }
                                    }
                                }

                                leftEdge[y]++;
                                u += uDelta;
                            }

                            v += vDelta;
                        }
                    }

                    // Draw a wireframe around any polygons that wish for one.
                    /// CLEANUP: The code for this is a bit unsightly.
                    if (poly.hasWireframe)
                    {
                        const wireShade = ((poly.isEthereal)? 100 : 0);

                        let prevVert = leftVerts[0];
                        for (let l = 1; l < leftVerts.length; l++)
                        {
                            Rsed.draw_line_n.line_onto_canvas(prevVert, leftVerts[l], pixelMap.data, width, height, wireShade, wireShade, wireShade);
                            prevVert = leftVerts[l];
                        }
                        Rsed.draw_line_n.line_onto_canvas(prevVert, rightVerts[0], pixelMap.data, width, height, wireShade, wireShade, wireShade);
                        prevVert = rightVerts[0];
                        for (let r = 1; r < rightVerts.length; r++)
                        {
                            Rsed.draw_line_n.line_onto_canvas(prevVert, rightVerts[r], pixelMap.data, width, height, wireShade, wireShade, wireShade);
                            prevVert = rightVerts[r];
                        }
                        Rsed.draw_line_n.line_onto_canvas(prevVert, leftVerts[0], pixelMap.data, width, height, wireShade, wireShade, wireShade);
                    }
                }
            }

            surface.exposed().putImageData(pixelMap, 0, 0);
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/file/resource-loader.js
 *
 * Tarpeeksi Hyvae Soft 2018, 2019 /
 * RallySportED-js
 * 
 * Loads data from various resource files related to Rally-Sport and RallySportED.
 *
 */

"use strict";

const resource_loader_n = (function()
{
    // The names of the types of binary resources we recognize.
    // Any binary resource we're asked to load must be one of these types.
    const binaryResourceTypes = Object.freeze(["palat",
                                               "maasto",
                                               "varimaa",
                                               "kierros",
                                               "track-header",
                                               "prop-textures",
                                               "rsed-project-zip"]);

    // The names of the types of JSON resources we recognize.
    // Any JSON resource we're asked to load must be one of these types.
    const jsonResourceTypes = Object.freeze(["prop-meshes",
                                             "prop-locations"]);

    // Takes in a JSON object describing the locations of each track's props; for instance,
    //
    //   "tracks":
    //   [
    //      {
    //         "trackId": 1,
    //         "props":
    //         [
    //            {"name": "finish(normal)", "x": 3328, "y": 0, "z": 2016},
    //            {"name": "tree", "x": 3500, "y": 0, "z": 3872}
    //         ]
    //      }
    //   ]
    //
    // and adds them into RallySportED.
    //
    function load_prop_locations(data = Object)
    {
        k_assert((data.tracks != null), "Expected a JSON object containing track prop locations.");
        data.tracks.forEach(track=>
        {
            k_assert((track.props != null), "Expected a JSON object containing track prop locations.");
            track.props.forEach(prop=>
            {
                Rsed.maasto_n.add_prop_location(track.trackId, prop.name, prop.x, prop.y, prop.z);
            });
        });
    }

    // Takes in a JSON object describing the 3d mesh data of each track's props; for instance,
    //
    //   "props":
    //   [
    //      {
    //         "displayName": "tree",
    //         "propId": 3492597896,
    //         "polygons":
    //         [
    //            {"textureIdx": null, "paletteIdx": 15, "verts": [-21, -500, 12, 21, -500, -12, 60, -550, -38, -15, -550, -63]},
    //            {"textureIdx": null, "paletteIdx": 14, "verts": [-15, -550, -63, 60, -550, -38, 0, -425, -138]}
    //         ]
    //      }
    //   ]
    //
    // and converts these meshes into RallySportED's mesh format for rendering.
    //
    function load_prop_meshes(data = Object)
    {
        k_assert((data.props != null), "Expected a JSON object containing prop meshes.");
        data.props.forEach(prop=>
        {
            const convertedPolygons = [];

            k_assert((prop.polygons != null), "Encountered a track prop with no polygons.");
            prop.polygons.forEach(propPoly=>
            {
                const numVertices = (propPoly.verts.length / 3);
                const convertedPoly = new geometry_n.polygon_o(numVertices);

                convertedPoly.texture = props_n.prop_texture(propPoly.textureIdx);
                convertedPoly.color = palette_n.palette_idx_to_rgba(propPoly.paletteIdx);

                k_assert((convertedPoly.v.length === numVertices), "Incorrect number of vertices in prop polygon.");
                convertedPoly.v.forEach((vertex, idx)=>
                {
                    vertex.x = propPoly.verts[idx*3];
                    vertex.y = -propPoly.verts[idx*3+1];
                    vertex.z = -propPoly.verts[idx*3+2];
                });

                convertedPolygons.push(convertedPoly);
            });

            props_n.add_prop_mesh(prop.displayName, convertedPolygons);
        });
    }

    // Takes in a byte array describing the current track's header; and loads it into
    // RallySportED. For information about Rally-Sport's track headers, refer to the
    // documentation on Rally-Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
    function load_track_header(data = Uint8Array)
    {
        // Track checkpoint.
        {
            const byteOffs = ((rsed_n.underlying_track_id() - 1) * 18);
            const checkpointX = (data[byteOffs + 13] * 2);
            const checkpointY = (data[byteOffs + 15] * 2);
            Rsed.maasto_n.set_checkpoint_pos(checkpointX, checkpointY);
        }
    }

    // Takes in a byte array providing track prop textures' pixel data; and creates a copy
    // of the data converted into RallySportED's texture format for use in rendering. For
    // information about Rally-Sport's prop textures, refer to the documentation on Rally-
    // Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
    function load_prop_textures(data = Uint8Array)
    {
        let idx = 0;
        const numTextures = data[idx++];

        for (let i = 0; i < numTextures; i++)
        {
            const texture = new texture_n.texture_o();
            texture.width = data[idx++];
            texture.height = data[idx++];

            for (let t = 0; t < (texture.width * texture.height); t++)
            {
                let paletteIdx = data[idx++];
                if (paletteIdx < 0 || paletteIdx > 31) paletteIdx = 0;

                texture.pixels.push(palette_n.palette_idx_to_rgba(paletteIdx));
                texture.paletteIndices.push(paletteIdx);
            }

            props_n.add_prop_texture(texture);
        }
    }

    const publicInterface = {};
    {
        // Loads a RallySportED project's data from file, and feeds it to the given callback
        // function.
        publicInterface.load_project_data = function(args = {}, returnCallback)
        {
            k_assert((returnCallback instanceof Function), "Expected to receive a callback function.");

            const projectData = {};

            // Get the data from a zip file.
            if (args.fromZip)
            {
                const zipContents = new JSZip();

                zipContents.loadAsync(args.zipFile)
                .then(()=>
                {
                    // Parse the zip file's contents. We'll require that it contains exactly one directory, which stores
                    // the project's $FT and DTA files.
                    const files = [];
                    {
                        const dirs = [];
                        zipContents.forEach((path, entry)=>
                        {
                            if (entry.dir)
                            {
                                dirs.push(entry);
                            }
                            else files.push(entry);
                        });

                        if (dirs.length != 1)
                        {
                            alert("The RallySportED project zip file must contain at least one directory under which the project's .DTA and .$FT files are found.");
                            return;
                        }

                        projectData.name = dirs[0].name.slice(0, -1).toLowerCase();

                        switch (projectData.name)
                        {
                            // For the original Rally-Sport tracks, have display names that reflect the in-game names
                            // rather than the project names (like "demoa", "demob", ...).
                            case "demoa": projectData.displayName = "Nurtsi-cruising"; break;
                            case "demob": projectData.displayName = "Vesistövedätys"; break;
                            case "democ": projectData.displayName = "Ralli-cross"; break;
                            case "demod": projectData.displayName = "Yleisö-ek"; break;
                            case "demoe": projectData.displayName = "Very slippery.."; break;
                            case "demof": projectData.displayName = "You asked it.."; break;
                            case "demog": projectData.displayName = "Bumps and jumps"; break;
                            case "demoh": projectData.displayName = "Short and easy"; break;

                            // Otherwise, use the project name as the display name.
                            default: projectData.displayName = (projectData.name.charAt(0).toUpperCase() + projectData.name.slice(1));
                        }

                        // Find the project's $FT and DTA files inside the zip file.
                        let manifestoFile = null, dtaFile = null;
                        {
                            files.forEach(file=>
                            {
                                if (manifestoFile && dtaFile) return;

                                const suffix = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
                                const basePath = file.name.slice(0, file.name.lastIndexOf(".")).toLowerCase();
                                const baseName = basePath.slice(basePath.lastIndexOf("/") + 1);

                                // Each resource file is expected to hold the same name as the project itself.
                                if (baseName !== projectData.name) return;

                                switch (suffix)
                                {
                                    case "$ft": manifestoFile = file; break;
                                    case "dta": dtaFile = file; break;
                                    default: break;
                                }
                            });

                            if (!manifestoFile || !dtaFile)
                            {
                                alert("The given RallySportED project zip file didn't contain all of the required .DTA and .$FT files.");
                                return;
                            }
                        }

                        // Extract the project's $FT and DTA files from the zip file.
                        (async()=>
                        {
                            projectData.manifestoData = await manifestoFile.async("string");
                            projectData.dtaData = await dtaFile.async("arraybuffer");

                            returnCallback(projectData);
                        })();
                    }
                })
                .catch((error)=>{k_assert(0, "Failed to extract project data (JSZip error: '" + error + "').");});
            }
            else
            {
                k_assert(0, "Unknown file format for loading project data.");
            }
        }

        // Takes in a byte array containing a Rally-Sport's track textures' pixel data; and
        // loads it into RallySportED. For information about Rally-Sport's track textures,
        // refer to the documentation on Rally-Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
        publicInterface.load_palat_data = function(bytes)
        {
            // The dimensions of a single texture.
            const palaWidth = 16;
            const palaHeight = 16;

            // How many textures we expect to receive.
            const numPalas = 256;

            k_assert((bytes.byteLength === (numPalas * palaWidth * palaHeight)), "Incorrect number of bytes for PALA data.");

            // Add each PALA as an individual texture.
            for (let i = 0; i < numPalas; i++)
            {
                const texture = new texture_n.texture_o();

                texture.width = palaWidth;
                texture.height = palaHeight;

                for (let y = (palaHeight - 1); y >= 0; y--) // Iterate backwards to flip the texture on y.
                {
                    for (let x = 0; x < palaWidth; x++)
                    {
                        let paletteIdx = bytes[(x + y * palaWidth) + (i * (palaWidth * palaHeight))];
                        if ((paletteIdx < 0) || (paletteIdx > 31)) paletteIdx = 0;

                        texture.pixels.push(palette_n.palette_idx_to_rgba(paletteIdx));
                        texture.paletteIndices.push(paletteIdx);
                    }
                }

                palat_n.add_pala(texture);
            }

            // Create an image containing thumbnails of all the textures we loaded.
            ui_draw_n.prebake_palat_pane();
        }

        // Takes in a byte array containing a track's tilemap; and loads it into RallySportED.
        // For information about Rally-Sport's track tilemaps, refer to the documentation on
        // Rally-Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
        publicInterface.load_varimaa_data = function(bytes)
        {
            const tilesPerSide = Math.sqrt(bytes.byteLength);
            k_assert(((tilesPerSide === 64) || (tilesPerSide === 128)), "Unsupported VARIMAA size.");

            // Verify the data.
            for (let i = 0; i < bytes.byteLength; i++)
            {
                k_assert((Number.isInteger(bytes[i])), "Detected invalid VARIMAA data.");
                k_assert((bytes[i] >= 0 && bytes[i] <= 255), "Detected invalid VARIMAA data.");
            }

            Rsed.maasto_n.set_varimaa(tilesPerSide, bytes);
        }

        // Takes in a byte array containing a track's heightmap; and loads it into RallySportED.
        // For information about Rally-Sport's track heightmaps, refer to the documentation on
        // Rally-Sport's data formats at github.com/leikareipa/rallysported/tree/master/docs.
        publicInterface.load_maasto_data = function(bytes)
        {
            const tilesPerSide = Math.sqrt(bytes.byteLength / 2);
            k_assert(((tilesPerSide === 64) || (tilesPerSide === 128)), "Unsupported MAASTO size.");

            // Convert Rally-Sport's two-byte height format into RallySportED's single values.
            const convertedHeightmap = [];
            for (let i = 0; i < (bytes.byteLength / 2); i++)
            {
                const b1 = bytes[i*2];
                const b2 = bytes[i*2+1];

                const height = (b2 === 1)? (-256 - b1)  // More than -255 below ground level.
                                         : (b2 - b1);   // Above ground when b2 == 255, otherwise below ground.

                convertedHeightmap.push(height);
            }

            k_assert((convertedHeightmap.length === (tilesPerSide * tilesPerSide)), "Detected an invalid MAASTO height conversion.");

            Rsed.maasto_n.set_maasto(tilesPerSide, convertedHeightmap);
        }

        // Loads from a JSON file resources of the given type.
        publicInterface.load_json_resource = function(filename = "", resourceType = "")
        {
            k_assert(((typeof filename === "string") && (filename.length > 0)), "Expected a non-null filename string.");
            k_assert(jsonResourceTypes.includes(resourceType), "Expected a valid resource type.");

            return new Promise((resolve, reject)=>
            {
                fetch(filename)
                .then((response)=>response.json())
                .then((data)=>
                {
                    switch (resourceType)
                    {
                        case "prop-meshes": load_prop_meshes(data); break;
                        case "prop-locations": load_prop_locations(data); break;
                        default: k_assert(0, "Unknown resource type."); reject(); break;
                    }
                    
                    resolve();
                })
                .catch((error)=>{k_assert(0, "Failed to fetch resource file " + filename + ". Error: " + error)});
            });
        }

        // Loads from a binary file resources of the given type; returning a promise resolved once the
        // data has been loaded and processed. The receptacle is an object that can receive from this
        // function the raw data loaded from file (without subsequent processing by this function), and
        // is required for some of the resource types.
        publicInterface.load_binary_resource = function(filename = "", resourceType = "", receptacle)
        {
            k_assert((filename.length > 0), "Expected a non-empty string.");
            k_assert(binaryResourceTypes.includes(resourceType), "Expected a valid resource type.");

            return new Promise((resolve, reject)=>
            {
                fetch(filename)
                .then((response)=>response.arrayBuffer())
                .then((dataBuffer)=>
                {
                    const bytes = new Uint8Array(dataBuffer);
                    k_assert((bytes != null), "Received invalid binary file data.");

                    switch (resourceType)
                    {
                        case "rsed-project-zip": receptacle(bytes); break;
                        case "track-header": load_track_header(bytes); break;
                        case "prop-textures": load_prop_textures(bytes); break;
                        case "palat": publicInterface.load_palat_data(bytes); break;
                        case "maasto": publicInterface.load_maasto_data(bytes); break;
                        case "varimaa": publicInterface.load_varimaa_data(bytes); break;
                        default: k_assert(0, "Unknown resource type."); reject(); break;
                    }

                    resolve();
                })
                .catch((error)=>{k_assert(0, "Failed to fetch resource file " + filename + ". Error: " + error)});
            });
        }
    }
    return publicInterface;
})();
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
        k_assert((dtaData instanceof ArrayBuffer), "Expected the project assets to come in as an array buffer.");
    
        Rsed.maasto_n.clear_maasto_data();
        palat_n.clear_palat_data();
        Rsed.camera_n.reset_camera_position();

        // Extract the data from the project file.
        {
            let i = 0;
            const endianness = true;

            // MAASTO data.
            {
                const maastoBytesize = (new DataView(dtaData, i, 4).getUint32(0, endianness));
                i+=4;
                k_assert(((i + maastoBytesize) <= dtaData.byteLength), "Was about to read project data out of bounds.");
                const maastoBytes = new Uint8Array(dtaData.slice(i, i + maastoBytesize));
                i+=maastoBytesize;

                Rsed.maasto_n.set_maasto_bytesize(maastoBytesize);
                resource_loader_n.load_maasto_data(maastoBytes, Rsed.maasto_n.set_maasto);
            }

            // VARIMAA data.
            {
                const varimaaBytesize = (new DataView(dtaData, i, 4).getUint32(0, endianness));
                i+=4;
                k_assert(((i + varimaaBytesize) <= dtaData.byteLength), "Was about to read project data out of bounds.");
                const varimaaBytes = new Uint8Array(dtaData.slice(i, i+varimaaBytesize));
                i+=varimaaBytesize;

                Rsed.maasto_n.set_varimaa_bytesize(varimaaBytesize);
                resource_loader_n.load_varimaa_data(varimaaBytes, Rsed.maasto_n.set_varimaa);
            }

            // PALAT data.
            {
                const palatBytesize = (new DataView(dtaData, i, 4).getUint32(0, endianness));
                i+=4;
                k_assert(((i + palatBytesize) <= dtaData.byteLength), "Was about to read project data out of bounds.");
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
                    k_assert(0, "Unexpected number of PALA bytes in the project file.");
                }

                palat_n.set_palat_bytesize(palatBytesize);
                resource_loader_n.load_palat_data(palatBytes, palat_n.add_pala);
            }
        }
    }

    const publicInterface = {};
    {
        // Will return true if the given project is valid. Otherwise, will throw an error.
        publicInterface.verify_project_validity = function(projectToVerify)
        {
            k_assert((projectToVerify instanceof Rsed.project_n.project_o), "Was asked to test the validity of a non-RallySportED project.");

            k_assert(((projectToVerify != null) && (projectToVerify.isValidProject)), "Failed to load the given zipped RallySportED project file.");
            k_assert((projectToVerify.name != null && projectToVerify.displayName != null), "Failed to load the given zipped RallySportED project file.");

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
                default: k_assert(0, "Unknown RallySportED project zip file locality."); return null;
            }
        }

        publicInterface.generate_download_of_project = function(project = Rsed.project_n.project_o)
        {
            k_assert((project instanceof Rsed.project_n.project_o), "Expected a RallySportED project object.");

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
                const palatBytes = palat_n.get_saveable_palat();

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
            .catch((error)=>{k_assert(0, error);});
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
/*
 * Most recent known filename: js/rsed.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED for the browser.
 *
 */

"use strict";

const rsed_n = (function()
{
    // The project we've currently got loaded. When the user makes edits or requests a save,
    // this is the target project.
    let project = null;

    // Which of Rally-Sport's eight tracks the current project is based on.
    let underlyingTrackId = 1;

    // Strings with which to build URLs to track assets.
    const tracksFileExtension = ".zip";
    const tracksDirectory = "track-list/files/";

    const renderScalingMultiplier = 0.25;

    // Test various browser compatibility factors, and give the user messages of warning where appropriate.
    function check_browser_compatibility()
    {
        // We expect to export projects with JSZip using blobs.
        if (!JSZip.support.blob)
        {
            alert("NOTE: This browser doesn't support saving RallySportED projects. Any changes you make to a track in this session will be lost.");
        }
    }

    // Initialize the renderer.
    const renderer = new Rsed.renderer_o("render_container", renderScalingMultiplier);
    {
        // This function will run before each frame is painted.
        renderer.set_prerefresh_callback(function()
        {
            // Create the scene mesh to be rendered.
            {
                renderer.meshes = [];

                if (ui_view_n.current_view() !== "2d-topdown")
                {
                    renderer.register_mesh(Rsed.maasto_n.maasto_mesh(Math.floor(Rsed.camera_n.pos_x()), Math.floor(Rsed.camera_n.pos_z())));
                }
            }

            ui_input_n.enact_inputs();
        });

        // This function will be called whenever the size of the render surface changes.
        renderer.set_resize_callback(function()
        {
            ui_draw_n.prebake_palat_pane();
        });
    }

    const htmlUI = (function()
    {
        const uiContainer = new Vue(
        {
            el:"#html-ui",
            data:
            {
                // The display name of the track that's currently open in the editor.
                trackName:"",

                propList:[],

                // Whether the UI should be displayed or kept invisible at this time.
                uiVisible:false,
            },
            methods:
            {
                // Called when the user selects a prop from the prop dropdown menu.
                /// TODO: Needs to be somewhere more suitable, and named something more descriptive.
                activate_prop:function(name = "")
                {
                    Rsed.maasto_n.change_prop_type(ui_input_n.mouse_hover_args().trackId, props_n.prop_idx_for_name(name));
                    window.close_dropdowns();

                    return;
                },
                
                refresh:function()
                {
                    this.trackName = project.displayName;
                    this.propList = props_n.prop_names()
                                           .filter(propName=>(!propName.startsWith("finish"))) /// Temp hack. Finish lines are not to be user-editable.
                                           .map(propName=>({propName}));

                    return;
                }
            }
        });

        const publicInterface = {};
        {
            publicInterface.refresh = function()
            {
                uiContainer.refresh();

                return;
            };
    
            publicInterface.set_visible = function(isVisible)
            {
                uiContainer.uiVisible = isVisible;

                return;
            };
        }
        return publicInterface;
    })();

    const publicInterface = {};
    {
        // Set to false if you want to incapacitate the program, e.g. as a result of an error throwing.
        // If not operational, the program won't respond to user input and won't display anything to
        // the user.
        publicInterface.isOperational = true;

        publicInterface.scaling_multiplier = function() { return renderScalingMultiplier; }
    
        publicInterface.load_project = function(args = {})
        {
            htmlUI.set_visible(false);

            if (args.fromZip)
            {
                k_assert((args.locality != null && args.zipFile != null), "Received invalid arguments for loading a project from a zip file.");

                project = Rsed.project_n.make_project_from_zip(args.locality, args.zipFile,
                                                               (newProject)=>
                                                               {
                                                                   project = newProject;
                                                                   Rsed.project_n.verify_project_validity(project);
                                                                   htmlUI.refresh();
                                                                   htmlUI.set_visible(true);
                                                               });
            }
            else
            {
                htmlUI.set_visible(true);

                k_assert(0, "Was given no project no load. There should've been one.");
            }
        }

        // Starts the program. The renderer will keep requesting a new animation frame, and will call the
        // callback functions we've set at that rate.
        publicInterface.launch_rallysported = function(args = {})
        {
            check_browser_compatibility();
            renderer.run_renderer();
            this.load_project(args);
        }

        // Exports the project's data into a zip file the user can download.
        publicInterface.save_project_to_disk = function()
        {
            if (project == null)
            {
                k_message("Was asked to save the project while it was null. Ignoring this.");
                return;
            }

            Rsed.project_n.generate_download_of_project(project);
        }

        // Loads all relevant base assets for the given track, clearing away any such previously-loaded
        // assets. You might call this, for instance, at the start of parsing a manifesto file, so there's
        // a clean slate to work on. Note that, with the exception of prop textures, this won't load any
        // data that's available in RallySportED project files (like MAASTO, VARIMAA, and PALAT), but
        // will clear away any existing entries of then from memory.
        publicInterface.initialize_track_data = function(trackId)
        {
            k_assert(((trackId >= 1) && (trackId <= 8)), "The given track id is out of bounds.");

            underlyingTrackId = trackId;

            return new Promise((resolve, reject) =>
            {
                const exeAssetDir = "distributable/assets/rallye-exe/";

                props_n.clear_prop_data();
                palat_n.clear_palat_data();
                palette_n.reset_palettes();
                Rsed.camera_n.reset_camera_position();
                Rsed.maasto_n.clear_maasto_data(true);
                palette_n.set_palette_for_track(underlyingTrackId);

                (async()=>
                {
                    await resource_loader_n.load_binary_resource(exeAssetDir + "prop-textures.bin", "prop-textures");
                    await resource_loader_n.load_json_resource(exeAssetDir + "prop-meshes.json", "prop-meshes");
                    await resource_loader_n.load_json_resource(exeAssetDir + "prop-locations.json", "prop-locations");
                    await resource_loader_n.load_binary_resource(exeAssetDir + "track-header.bin", "track-header");
                    resolve();
                })();
            });
        }

        // Gets called when something is dropped onto RallySportED's render canvas. We expect
        // the drop to be a zip file containing the files of a RallySportED project for us to
        // load up. If it's not, we'll ignore the drop.
        publicInterface.drop_handler = function(event)
        {
            // Don't let the browser handle the drop.
            event.preventDefault();

            // See if we received a zip file that we could load.
            const zipFile = [].map.call(event.dataTransfer.items, (item)=>{return item.getAsFile()})
                                  .filter(file=>(file != null))
                                  .filter(file=>(file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase() === "zip"))
                                  [0] || null;
 
            if (!zipFile)
            {
                k_message("The drag contained no RallySportED zip files. Ignoring it.");
                return;
            }

            // We now presumably have a zipped RallySportED project that we can load, so ket's do that.
            rsed_n.load_project({fromZip:true,locality:"local",zipFile});
            /// TODO: .then(()=>{//cleanup.});

            // Clear the address bar's parameters to reflect the fact that the user has loaded a local
            // track resource instead of specifying a server-side resource via the address bar.
            const basePath = (window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1));
            window.history.replaceState({}, document.title, basePath);
        }

        publicInterface.incapacitate_rallysported = function(message)
        {
            renderer.indicate_error(message);
            publicInterface.isOperational = false;
        }

        publicInterface.render_width = function() { return renderer.render_width(); }
        publicInterface.render_height = function() { return renderer.render_height(); }

        publicInterface.render_latency = function() { return renderer.previousFrameLatencyMs; }

        publicInterface.mouse_pick_buffer_value_at = function(x, y) { return renderer.mouse_pick_buffer_value_at(x, y); }

        publicInterface.underlying_track_id = function() { return underlyingTrackId; }

        publicInterface.tracks_file_extension = function() { return tracksFileExtension; }
        publicInterface.tracks_directory = function() { return tracksDirectory; }

        publicInterface.render_surface_id = function() { return renderer.renderSurfaceId; }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/misc/window.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Provides logic for dealing with the host HTML page.
 *
 */

"use strict";

/// Temp hack. Set to true when a dropdown list is visible. We do this to prevent the editor from
/// receiving mouse events in the meantime, so there won't be accidental terrain edits etc. that
/// might otherwise fall through the dropdown menu.
let RSED_DROPDOWN_ACTIVATED = false;

/// Temp hack. Gets updated with onmousemove, and stores the mouse's position relative to the
/// canvas.
const RSED_MOUSE_POS = {x:0, y:0};

// Parses any address bar parameters, then launches RallySportED.
window.onload = function(event)
{
    // Parse any parameters the user supplied on the address line. Generally speaking, these
    // will direct which track's assets RallySportED should load up when it starts.
    const args = {};
    {
        const params = new URLSearchParams(window.location.search);

        // Server-side custom tracks. These have an id string that identifies the track.
        if (params.has("track"))
        {
            args.fromZip = true;
            args.locality = "server";
            args.zipFile = params.get("track");

            // Sanitize input.
            if (!(typeof args.zipFile === "string") ||
                !(/^[a-k2-9]+$/.test(args.zipFile)))
            {
                k_assert(0, "Invalid track identifier detected. Can't continue.");
                return;
            }
        }
        // Server side original tracks from Rally-Sport's demo. These take a value in the range 1..8,
        // corresponding to the eight tracks in the demo.
        else if (params.has("original"))
        {
            const trackId = parseInt(params.get("original"), 10);
            k_assert((trackId >= 1 && trackId <= 8), "The given track id is out of bounds.");

            args.fromZip = true;
            args.locality = "server";
            args.zipFile = ("demo" + String.fromCharCode("a".charCodeAt(0) + trackId - 1));

            // Sanitize input.
            if (!(typeof args.zipFile === "string") ||
                !(/^[a-z1-8]+$/.test(args.zipFile)))
            {
                k_assert(0, "Invalid track identifier detected. Can't continue.");
                return;
            }
        }
        else // Default.
        {
            args.fromZip = true;
            args.locality = "server";
            args.zipFile = "demod";
        }
    }

    args.zipFile = (rsed_n.tracks_directory() + args.zipFile + rsed_n.tracks_file_extension());
    
    rsed_n.launch_rallysported(args);
}

// Disable the right-click browser menu, since we want to use the right mouse button for other things.
window.oncontextmenu = function(event)
{
    if (RSED_DROPDOWN_ACTIVATED)
    {
        page_n.close_dropdowns();
        return false;
    }

    if (event.target.id !== rsed_n.render_surface_id()) return;

    // Display a right-click menu for changing the type of the prop under the cursor.
    if (ui_input_n.mouse_hover_type() === ui_input_n.mousePickingType.prop &&
        !props_n.prop_name_for_idx(ui_input_n.mouse_hover_args().idx).toLowerCase().startsWith("finish")) /// Temp hack. Disallow changing any prop's type to a finish line, which is a special item.
    {
        const propDowndown = document.getElementById("prop-dropdown");
        
        propDowndown.style.transform = "translate(" + (RSED_MOUSE_POS.x - 40) + "px, " + (RSED_MOUSE_POS.y - 0) + "px)";
        propDowndown.classList.toggle("show");

        RSED_DROPDOWN_ACTIVATED = true;
    }

    return false;
}

window.close_dropdowns = function()
{
    const dropdowns = document.getElementsByClassName("dropdown_list");
    for (let i = 0; i < dropdowns.length; i++)
    {
        if (dropdowns[i].classList.contains("show")) dropdowns[i].classList.toggle("show");
    }

    RSED_DROPDOWN_ACTIVATED = false;
    ui_input_n.reset_mouse_hover_info();
}

// The program uses onmousedown for primary click processing, but onclick is used here
// to close any open dropdown lists.
window.onclick = function(event)
{
    if (RSED_DROPDOWN_ACTIVATED)
    {
        page_n.close_dropdowns();
        return false;
    }
}

window.onmousedown = function(event)
{
    switch (event.button)
    {
        case 0: ui_input_n.set_left_click(true); break;
        case 1: ui_input_n.set_middle_click(true); break;
        case 2: ui_input_n.set_right_click(true); break;
        default: break;
    }
}

window.onmouseup = function(event)
{
    switch (event.button)
    {
        case 0: ui_input_n.set_left_click(false); break;
        case 1: ui_input_n.set_middle_click(false); break;
        case 2: ui_input_n.set_right_click(false); break;
        default: break;
    }
}

window.onmousemove = function(event)
{
    if (event.target.id !== rsed_n.render_surface_id())
    {
        /// Temp hack. Prevent mouse clicks over prop dropdown dialogs from falling through and
        /// inadvertently editing the terrain.
        if (ui_input_n.mouse_hover_type() !== ui_input_n.mousePickingType.prop)
        {
            ui_input_n.reset_mouse_hover_info();
        }

        return;
    }

    if (!RSED_DROPDOWN_ACTIVATED)
    {
        RSED_MOUSE_POS.x = (event.clientX - event.target.getBoundingClientRect().left);
        RSED_MOUSE_POS.y = (event.clientY - event.target.getBoundingClientRect().top);

        ui_input_n.set_mouse_pos(Math.floor(RSED_MOUSE_POS.x * rsed_n.scaling_multiplier()),
                                Math.floor(RSED_MOUSE_POS.y * rsed_n.scaling_multiplier()));
    }
}

window.onkeydown = function(event)
{
    ui_input_n.update_key_status(event, true);

    /// Temp hack. Process some of the key presses here, for convenience.
    {
        if (event.repeat) return;

        switch (event.keyCode)
        {
            case "q": case 81: ui_view_n.toggle_view("2d-topdown", "3d"); break;
            case "w": case 87: ui_view_n.show3dWireframe = !ui_view_n.show3dWireframe; break;
            case "a": case 65: ui_view_n.showPalatPane = !ui_view_n.showPalatPane; break;
            case "r": case 82: ui_view_n.toggle_view("3d", "3d-topdown"); break;
            case "l": case 76: Rsed.maasto_n.level_terrain(); break;
            case "b": case 66: ui_view_n.hideProps = !ui_view_n.hideProps; break;
            case "spacebar": case 32: ui_brush_n.brushSmoothens = !ui_brush_n.brushSmoothens; event.preventDefault(); break;
            case "1": case 49: ui_brush_n.set_brush_size(0); break;
            case "2": case 50: ui_brush_n.set_brush_size(1); break;
            case "3": case 51: ui_brush_n.set_brush_size(2); break;
            case "4": case 52: ui_brush_n.set_brush_size(3); break;
            case "5": case 53: ui_brush_n.set_brush_size(8); break;
            case "tab": case 9: event.preventDefault(); break;
            default: break;
        }
    }
}

window.onkeyup = function(event)
{
    ui_input_n.update_key_status(event, false);
}
