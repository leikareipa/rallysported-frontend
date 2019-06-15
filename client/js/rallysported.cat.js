// WHAT: Concatenated JavaScript source files
// PROGRAM: RallySportED-js
// AUTHOR: Tarpeeksi Hyvae Soft
// VERSION: live (15 June 2019 23:07:59 UTC)
// LINK: https://www.github.com/leikareipa/rallysported-js/
// INCLUDES: { JSZip (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso }
// INCLUDES: { FileSaver.js (c) 2016 Eli Grey }
// INCLUDES: { The retro n-gon renderer (c) 2019 Tarpeeksi Hyvae Soft }
// FILES:
//	../client/js/jszip/jszip.min.js
//	../client/js/filesaver/FileSaver.min.js
//	../client/js/retro-ngon/rngon.cat.js
//	../client/js/rallysported/rallysported.js
//	../client/js/rallysported/project/manifesto.js
//	../client/js/rallysported/project/project.js
//	../client/js/rallysported/misc/constants.js
//	../client/js/rallysported/misc/shared-mode.js
//	../client/js/rallysported/world/world-builder.js
//	../client/js/rallysported/world/camera.js
//	../client/js/rallysported/visual/texture.js
//	../client/js/rallysported/visual/palette.js
//	../client/js/rallysported/track/varimaa.js
//	../client/js/rallysported/track/maasto.js
//	../client/js/rallysported/track/palat.js
//	../client/js/rallysported/track/props.js
//	../client/js/rallysported/ui/font.js
//	../client/js/rallysported/ui/view.js
//	../client/js/rallysported/ui/brush.js
//	../client/js/rallysported/ui/draw.js
//	../client/js/rallysported/ui/input.js
//	../client/js/rallysported/ui/window.js
//	../client/js/rallysported/core.js
/////////////////////////////////////////////////

/*!

JSZip v3.1.5 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.JSZip=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d=a("./utils"),e=a("./support"),f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,g,h,i,j,k=[],l=0,m=a.length,n=m,o="string"!==d.getTypeOf(a);l<a.length;)n=m-l,o?(b=a[l++],c=l<m?a[l++]:0,e=l<m?a[l++]:0):(b=a.charCodeAt(l++),c=l<m?a.charCodeAt(l++):0,e=l<m?a.charCodeAt(l++):0),g=b>>2,h=(3&b)<<4|c>>4,i=n>1?(15&c)<<2|e>>6:64,j=n>2?63&e:64,k.push(f.charAt(g)+f.charAt(h)+f.charAt(i)+f.charAt(j));return k.join("")},c.decode=function(a){var b,c,d,g,h,i,j,k=0,l=0,m="data:";if(a.substr(0,m.length)===m)throw new Error("Invalid base64 input, it looks like a data url.");a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");var n=3*a.length/4;if(a.charAt(a.length-1)===f.charAt(64)&&n--,a.charAt(a.length-2)===f.charAt(64)&&n--,n%1!==0)throw new Error("Invalid base64 input, bad content length.");var o;for(o=e.uint8array?new Uint8Array(0|n):new Array(0|n);k<a.length;)g=f.indexOf(a.charAt(k++)),h=f.indexOf(a.charAt(k++)),i=f.indexOf(a.charAt(k++)),j=f.indexOf(a.charAt(k++)),b=g<<2|h>>4,c=(15&h)<<4|i>>2,d=(3&i)<<6|j,o[l++]=b,64!==i&&(o[l++]=c),64!==j&&(o[l++]=d);return o}},{"./support":30,"./utils":32}],2:[function(a,b,c){"use strict";function d(a,b,c,d,e){this.compressedSize=a,this.uncompressedSize=b,this.crc32=c,this.compression=d,this.compressedContent=e}var e=a("./external"),f=a("./stream/DataWorker"),g=a("./stream/DataLengthProbe"),h=a("./stream/Crc32Probe"),g=a("./stream/DataLengthProbe");d.prototype={getContentWorker:function(){var a=new f(e.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new g("data_length")),b=this;return a.on("end",function(){if(this.streamInfo.data_length!==b.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),a},getCompressedWorker:function(){return new f(e.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},d.createWorkerFrom=function(a,b,c){return a.pipe(new h).pipe(new g("uncompressedSize")).pipe(b.compressWorker(c)).pipe(new g("compressedSize")).withStreamInfo("compression",b)},b.exports=d},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(a,b,c){"use strict";var d=a("./stream/GenericWorker");c.STORE={magic:"\0\0",compressWorker:function(a){return new d("STORE compression")},uncompressWorker:function(){return new d("STORE decompression")}},c.DEFLATE=a("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(a,b,c){"use strict";function d(){for(var a,b=[],c=0;c<256;c++){a=c;for(var d=0;d<8;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function e(a,b,c,d){var e=h,f=d+c;a^=-1;for(var g=d;g<f;g++)a=a>>>8^e[255&(a^b[g])];return a^-1}function f(a,b,c,d){var e=h,f=d+c;a^=-1;for(var g=d;g<f;g++)a=a>>>8^e[255&(a^b.charCodeAt(g))];return a^-1}var g=a("./utils"),h=d();b.exports=function(a,b){if("undefined"==typeof a||!a.length)return 0;var c="string"!==g.getTypeOf(a);return c?e(0|b,a,a.length,0):f(0|b,a,a.length,0)}},{"./utils":32}],5:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.createFolders=!0,c.date=null,c.compression=null,c.compressionOptions=null,c.comment=null,c.unixPermissions=null,c.dosPermissions=null},{}],6:[function(a,b,c){"use strict";var d=null;d="undefined"!=typeof Promise?Promise:a("lie"),b.exports={Promise:d}},{lie:58}],7:[function(a,b,c){"use strict";function d(a,b){h.call(this,"FlateWorker/"+a),this._pako=null,this._pakoAction=a,this._pakoOptions=b,this.meta={}}var e="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,f=a("pako"),g=a("./utils"),h=a("./stream/GenericWorker"),i=e?"uint8array":"array";c.magic="\b\0",g.inherits(d,h),d.prototype.processChunk=function(a){this.meta=a.meta,null===this._pako&&this._createPako(),this._pako.push(g.transformTo(i,a.data),!1)},d.prototype.flush=function(){h.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},d.prototype.cleanUp=function(){h.prototype.cleanUp.call(this),this._pako=null},d.prototype._createPako=function(){this._pako=new f[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var a=this;this._pako.onData=function(b){a.push({data:b,meta:a.meta})}},c.compressWorker=function(a){return new d("Deflate",a)},c.uncompressWorker=function(){return new d("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:59}],8:[function(a,b,c){"use strict";function d(a,b,c,d){f.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=b,this.zipPlatform=c,this.encodeFileName=d,this.streamFiles=a,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}var e=a("../utils"),f=a("../stream/GenericWorker"),g=a("../utf8"),h=a("../crc32"),i=a("../signature"),j=function(a,b){var c,d="";for(c=0;c<b;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},k=function(a,b){var c=a;return a||(c=b?16893:33204),(65535&c)<<16},l=function(a,b){return 63&(a||0)},m=function(a,b,c,d,f,m){var n,o,p=a.file,q=a.compression,r=m!==g.utf8encode,s=e.transformTo("string",m(p.name)),t=e.transformTo("string",g.utf8encode(p.name)),u=p.comment,v=e.transformTo("string",m(u)),w=e.transformTo("string",g.utf8encode(u)),x=t.length!==p.name.length,y=w.length!==u.length,z="",A="",B="",C=p.dir,D=p.date,E={crc32:0,compressedSize:0,uncompressedSize:0};b&&!c||(E.crc32=a.crc32,E.compressedSize=a.compressedSize,E.uncompressedSize=a.uncompressedSize);var F=0;b&&(F|=8),r||!x&&!y||(F|=2048);var G=0,H=0;C&&(G|=16),"UNIX"===f?(H=798,G|=k(p.unixPermissions,C)):(H=20,G|=l(p.dosPermissions,C)),n=D.getUTCHours(),n<<=6,n|=D.getUTCMinutes(),n<<=5,n|=D.getUTCSeconds()/2,o=D.getUTCFullYear()-1980,o<<=4,o|=D.getUTCMonth()+1,o<<=5,o|=D.getUTCDate(),x&&(A=j(1,1)+j(h(s),4)+t,z+="up"+j(A.length,2)+A),y&&(B=j(1,1)+j(h(v),4)+w,z+="uc"+j(B.length,2)+B);var I="";I+="\n\0",I+=j(F,2),I+=q.magic,I+=j(n,2),I+=j(o,2),I+=j(E.crc32,4),I+=j(E.compressedSize,4),I+=j(E.uncompressedSize,4),I+=j(s.length,2),I+=j(z.length,2);var J=i.LOCAL_FILE_HEADER+I+s+z,K=i.CENTRAL_FILE_HEADER+j(H,2)+I+j(v.length,2)+"\0\0\0\0"+j(G,4)+j(d,4)+s+z+v;return{fileRecord:J,dirRecord:K}},n=function(a,b,c,d,f){var g="",h=e.transformTo("string",f(d));return g=i.CENTRAL_DIRECTORY_END+"\0\0\0\0"+j(a,2)+j(a,2)+j(b,4)+j(c,4)+j(h.length,2)+h},o=function(a){var b="";return b=i.DATA_DESCRIPTOR+j(a.crc32,4)+j(a.compressedSize,4)+j(a.uncompressedSize,4)};e.inherits(d,f),d.prototype.push=function(a){var b=a.meta.percent||0,c=this.entriesCount,d=this._sources.length;this.accumulate?this.contentBuffer.push(a):(this.bytesWritten+=a.data.length,f.prototype.push.call(this,{data:a.data,meta:{currentFile:this.currentFile,percent:c?(b+100*(c-d-1))/c:100}}))},d.prototype.openedSource=function(a){this.currentSourceOffset=this.bytesWritten,this.currentFile=a.file.name;var b=this.streamFiles&&!a.file.dir;if(b){var c=m(a,b,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:c.fileRecord,meta:{percent:0}})}else this.accumulate=!0},d.prototype.closedSource=function(a){this.accumulate=!1;var b=this.streamFiles&&!a.file.dir,c=m(a,b,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(c.dirRecord),b)this.push({data:o(a),meta:{percent:100}});else for(this.push({data:c.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},d.prototype.flush=function(){for(var a=this.bytesWritten,b=0;b<this.dirRecords.length;b++)this.push({data:this.dirRecords[b],meta:{percent:100}});var c=this.bytesWritten-a,d=n(this.dirRecords.length,c,a,this.zipComment,this.encodeFileName);this.push({data:d,meta:{percent:100}})},d.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},d.prototype.registerPrevious=function(a){this._sources.push(a);var b=this;return a.on("data",function(a){b.processChunk(a)}),a.on("end",function(){b.closedSource(b.previous.streamInfo),b._sources.length?b.prepareNextSource():b.end()}),a.on("error",function(a){b.error(a)}),this},d.prototype.resume=function(){return!!f.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},d.prototype.error=function(a){var b=this._sources;if(!f.prototype.error.call(this,a))return!1;for(var c=0;c<b.length;c++)try{b[c].error(a)}catch(a){}return!0},d.prototype.lock=function(){f.prototype.lock.call(this);for(var a=this._sources,b=0;b<a.length;b++)a[b].lock()},b.exports=d},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(a,b,c){"use strict";var d=a("../compressions"),e=a("./ZipFileWorker"),f=function(a,b){var c=a||b,e=d[c];if(!e)throw new Error(c+" is not a valid compression method !");return e};c.generateWorker=function(a,b,c){var d=new e(b.streamFiles,c,b.platform,b.encodeFileName),g=0;try{a.forEach(function(a,c){g++;var e=f(c.options.compression,b.compression),h=c.options.compressionOptions||b.compressionOptions||{},i=c.dir,j=c.date;c._compressWorker(e,h).withStreamInfo("file",{name:a,dir:i,date:j,comment:c.comment||"",unixPermissions:c.unixPermissions,dosPermissions:c.dosPermissions}).pipe(d)}),d.entriesCount=g}catch(h){d.error(h)}return d}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(a,b,c){"use strict";function d(){if(!(this instanceof d))return new d;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files={},this.comment=null,this.root="",this.clone=function(){var a=new d;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a}}d.prototype=a("./object"),d.prototype.loadAsync=a("./load"),d.support=a("./support"),d.defaults=a("./defaults"),d.version="3.1.5",d.loadAsync=function(a,b){return(new d).loadAsync(a,b)},d.external=a("./external"),b.exports=d},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(a,b,c){"use strict";function d(a){return new f.Promise(function(b,c){var d=a.decompressed.getContentWorker().pipe(new i);d.on("error",function(a){c(a)}).on("end",function(){d.streamInfo.crc32!==a.decompressed.crc32?c(new Error("Corrupted zip : CRC32 mismatch")):b()}).resume()})}var e=a("./utils"),f=a("./external"),g=a("./utf8"),e=a("./utils"),h=a("./zipEntries"),i=a("./stream/Crc32Probe"),j=a("./nodejsUtils");b.exports=function(a,b){var c=this;return b=e.extend(b||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:g.utf8decode}),j.isNode&&j.isStream(a)?f.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):e.prepareContent("the loaded zip file",a,!0,b.optimizedBinaryString,b.base64).then(function(a){var c=new h(b);return c.load(a),c}).then(function(a){var c=[f.Promise.resolve(a)],e=a.files;if(b.checkCRC32)for(var g=0;g<e.length;g++)c.push(d(e[g]));return f.Promise.all(c)}).then(function(a){for(var d=a.shift(),e=d.files,f=0;f<e.length;f++){var g=e[f];c.file(g.fileNameStr,g.decompressed,{binary:!0,optimizedBinaryString:!0,date:g.date,dir:g.dir,comment:g.fileCommentStr.length?g.fileCommentStr:null,unixPermissions:g.unixPermissions,dosPermissions:g.dosPermissions,createFolders:b.createFolders})}return d.zipComment.length&&(c.comment=d.zipComment),c})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(a,b,c){"use strict";function d(a,b){f.call(this,"Nodejs stream input adapter for "+a),this._upstreamEnded=!1,this._bindStream(b)}var e=a("../utils"),f=a("../stream/GenericWorker");e.inherits(d,f),d.prototype._bindStream=function(a){var b=this;this._stream=a,a.pause(),a.on("data",function(a){b.push({data:a,meta:{percent:0}})}).on("error",function(a){b.isPaused?this.generatedError=a:b.error(a)}).on("end",function(){b.isPaused?b._upstreamEnded=!0:b.end()})},d.prototype.pause=function(){return!!f.prototype.pause.call(this)&&(this._stream.pause(),!0)},d.prototype.resume=function(){return!!f.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},b.exports=d},{"../stream/GenericWorker":28,"../utils":32}],13:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,b),this._helper=a;var d=this;a.on("data",function(a,b){d.push(a)||d._helper.pause(),c&&c(b)}).on("error",function(a){d.emit("error",a)}).on("end",function(){d.push(null)})}var e=a("readable-stream").Readable,f=a("../utils");f.inherits(d,e),d.prototype._read=function(){this._helper.resume()},b.exports=d},{"../utils":32,"readable-stream":16}],14:[function(a,b,c){"use strict";b.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(a,b){return new Buffer(a,b)},allocBuffer:function(a){return Buffer.alloc?Buffer.alloc(a):new Buffer(a)},isBuffer:function(a){return Buffer.isBuffer(a)},isStream:function(a){return a&&"function"==typeof a.on&&"function"==typeof a.pause&&"function"==typeof a.resume}}},{}],15:[function(a,b,c){"use strict";function d(a){return"[object RegExp]"===Object.prototype.toString.call(a)}var e=a("./utf8"),f=a("./utils"),g=a("./stream/GenericWorker"),h=a("./stream/StreamHelper"),i=a("./defaults"),j=a("./compressedObject"),k=a("./zipObject"),l=a("./generate"),m=a("./nodejsUtils"),n=a("./nodejs/NodejsStreamInputAdapter"),o=function(a,b,c){var d,e=f.getTypeOf(b),h=f.extend(c||{},i);h.date=h.date||new Date,null!==h.compression&&(h.compression=h.compression.toUpperCase()),"string"==typeof h.unixPermissions&&(h.unixPermissions=parseInt(h.unixPermissions,8)),h.unixPermissions&&16384&h.unixPermissions&&(h.dir=!0),h.dosPermissions&&16&h.dosPermissions&&(h.dir=!0),h.dir&&(a=q(a)),h.createFolders&&(d=p(a))&&r.call(this,d,!0);var l="string"===e&&h.binary===!1&&h.base64===!1;c&&"undefined"!=typeof c.binary||(h.binary=!l);var o=b instanceof j&&0===b.uncompressedSize;(o||h.dir||!b||0===b.length)&&(h.base64=!1,h.binary=!0,b="",h.compression="STORE",e="string");var s=null;s=b instanceof j||b instanceof g?b:m.isNode&&m.isStream(b)?new n(a,b):f.prepareContent(a,b,h.binary,h.optimizedBinaryString,h.base64);var t=new k(a,s,h);this.files[a]=t},p=function(a){"/"===a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},q=function(a){return"/"!==a.slice(-1)&&(a+="/"),a},r=function(a,b){return b="undefined"!=typeof b?b:i.createFolders,a=q(a),this.files[a]||o.call(this,a,null,{dir:!0,createFolders:b}),this.files[a]},s={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(a){var b,c,d;for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],c=b.slice(this.root.length,b.length),c&&b.slice(0,this.root.length)===this.root&&a(c,d))},filter:function(a){var b=[];return this.forEach(function(c,d){a(c,d)&&b.push(d)}),b},file:function(a,b,c){if(1===arguments.length){if(d(a)){var e=a;return this.filter(function(a,b){return!b.dir&&e.test(a)})}var f=this.files[this.root+a];return f&&!f.dir?f:null}return a=this.root+a,o.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(d(a))return this.filter(function(b,c){return c.dir&&a.test(b)});var b=this.root+a,c=r.call(this,b),e=this.clone();return e.root=c.name,e},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!==a.slice(-1)&&(a+="/"),b=this.files[a]),b&&!b.dir)delete this.files[a];else for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];return this},generate:function(a){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(a){var b,c={};try{if(c=f.extend(a||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:e.utf8encode}),c.type=c.type.toLowerCase(),c.compression=c.compression.toUpperCase(),"binarystring"===c.type&&(c.type="string"),!c.type)throw new Error("No output type specified.");f.checkSupport(c.type),"darwin"!==c.platform&&"freebsd"!==c.platform&&"linux"!==c.platform&&"sunos"!==c.platform||(c.platform="UNIX"),"win32"===c.platform&&(c.platform="DOS");var d=c.comment||this.comment||"";b=l.generateWorker(this,c,d)}catch(i){b=new g("error"),b.error(i)}return new h(b,c.type||"string",c.mimeType)},generateAsync:function(a,b){return this.generateInternalStream(a).accumulate(b)},generateNodeStream:function(a,b){return a=a||{},a.type||(a.type="nodebuffer"),this.generateInternalStream(a).toNodejsStream(b)}};b.exports=s},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(a,b,c){b.exports=a("stream")},{stream:void 0}],17:[function(a,b,c){"use strict";function d(a){e.call(this,a);for(var b=0;b<this.data.length;b++)a[b]=255&a[b]}var e=a("./DataReader"),f=a("../utils");f.inherits(d,e),d.prototype.byteAt=function(a){return this.data[this.zero+a]},d.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f-this.zero;return-1},d.prototype.readAndCheckSignature=function(a){var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.readData(4);return b===f[0]&&c===f[1]&&d===f[2]&&e===f[3]},d.prototype.readData=function(a){if(this.checkOffset(a),0===a)return[];var b=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,b},b.exports=d},{"../utils":32,"./DataReader":18}],18:[function(a,b,c){"use strict";function d(a){this.data=a,this.length=a.length,this.index=0,this.zero=0}var e=a("../utils");d.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<this.zero+a||a<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(a){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return e.transformTo("string",this.readData(a))},readData:function(a){},lastIndexOfSignature:function(a){},readAndCheckSignature:function(a){},readDate:function(){var a=this.readInt(4);return new Date(Date.UTC((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1))}},b.exports=d},{"../utils":32}],19:[function(a,b,c){"use strict";function d(a){e.call(this,a)}var e=a("./Uint8ArrayReader"),f=a("../utils");f.inherits(d,e),d.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,b},b.exports=d},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(a,b,c){"use strict";function d(a){e.call(this,a)}var e=a("./DataReader"),f=a("../utils");f.inherits(d,e),d.prototype.byteAt=function(a){return this.data.charCodeAt(this.zero+a)},d.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)-this.zero},d.prototype.readAndCheckSignature=function(a){var b=this.readData(4);return a===b},d.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,b},b.exports=d},{"../utils":32,"./DataReader":18}],21:[function(a,b,c){"use strict";function d(a){e.call(this,a)}var e=a("./ArrayReader"),f=a("../utils");f.inherits(d,e),d.prototype.readData=function(a){if(this.checkOffset(a),0===a)return new Uint8Array(0);var b=this.data.subarray(this.zero+this.index,this.zero+this.index+a);return this.index+=a,b},b.exports=d},{"../utils":32,"./ArrayReader":17}],22:[function(a,b,c){"use strict";var d=a("../utils"),e=a("../support"),f=a("./ArrayReader"),g=a("./StringReader"),h=a("./NodeBufferReader"),i=a("./Uint8ArrayReader");b.exports=function(a){var b=d.getTypeOf(a);return d.checkSupport(b),"string"!==b||e.uint8array?"nodebuffer"===b?new h(a):e.uint8array?new i(d.transformTo("uint8array",a)):new f(d.transformTo("array",a)):new g(a)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],24:[function(a,b,c){"use strict";function d(a){e.call(this,"ConvertWorker to "+a),this.destType=a}var e=a("./GenericWorker"),f=a("../utils");f.inherits(d,e),d.prototype.processChunk=function(a){this.push({data:f.transformTo(this.destType,a.data),meta:a.meta})},b.exports=d},{"../utils":32,"./GenericWorker":28}],25:[function(a,b,c){"use strict";function d(){e.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}var e=a("./GenericWorker"),f=a("../crc32"),g=a("../utils");g.inherits(d,e),d.prototype.processChunk=function(a){this.streamInfo.crc32=f(a.data,this.streamInfo.crc32||0),this.push(a)},b.exports=d},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(a,b,c){"use strict";function d(a){f.call(this,"DataLengthProbe for "+a),this.propName=a,this.withStreamInfo(a,0)}var e=a("../utils"),f=a("./GenericWorker");e.inherits(d,f),d.prototype.processChunk=function(a){if(a){var b=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=b+a.data.length}f.prototype.processChunk.call(this,a)},b.exports=d},{"../utils":32,"./GenericWorker":28}],27:[function(a,b,c){"use strict";function d(a){f.call(this,"DataWorker");var b=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,a.then(function(a){b.dataIsReady=!0,b.data=a,b.max=a&&a.length||0,b.type=e.getTypeOf(a),b.isPaused||b._tickAndRepeat()},function(a){b.error(a)})}var e=a("../utils"),f=a("./GenericWorker"),g=16384;e.inherits(d,f),d.prototype.cleanUp=function(){f.prototype.cleanUp.call(this),this.data=null},d.prototype.resume=function(){return!!f.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,e.delay(this._tickAndRepeat,[],this)),!0)},d.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(e.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},d.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var a=g,b=null,c=Math.min(this.max,this.index+a);if(this.index>=this.max)return this.end();switch(this.type){case"string":b=this.data.substring(this.index,c);break;case"uint8array":b=this.data.subarray(this.index,c);break;case"array":case"nodebuffer":b=this.data.slice(this.index,c)}return this.index=c,this.push({data:b,meta:{percent:this.max?this.index/this.max*100:0}})},b.exports=d},{"../utils":32,"./GenericWorker":28}],28:[function(a,b,c){"use strict";function d(a){this.name=a||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}d.prototype={push:function(a){this.emit("data",a)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(a){this.emit("error",a)}return!0},error:function(a){return!this.isFinished&&(this.isPaused?this.generatedError=a:(this.isFinished=!0,this.emit("error",a),this.previous&&this.previous.error(a),this.cleanUp()),!0)},on:function(a,b){return this._listeners[a].push(b),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(a,b){if(this._listeners[a])for(var c=0;c<this._listeners[a].length;c++)this._listeners[a][c].call(this,b)},pipe:function(a){return a.registerPrevious(this)},registerPrevious:function(a){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=a.streamInfo,this.mergeStreamInfo(),this.previous=a;var b=this;return a.on("data",function(a){b.processChunk(a)}),a.on("end",function(){b.end()}),a.on("error",function(a){b.error(a)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;this.isPaused=!1;var a=!1;return this.generatedError&&(this.error(this.generatedError),a=!0),this.previous&&this.previous.resume(),!a},flush:function(){},processChunk:function(a){this.push(a)},withStreamInfo:function(a,b){return this.extraStreamInfo[a]=b,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var a in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(a)&&(this.streamInfo[a]=this.extraStreamInfo[a])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var a="Worker "+this.name;return this.previous?this.previous+" -> "+a:a}},b.exports=d},{}],29:[function(a,b,c){"use strict";function d(a,b,c){switch(a){case"blob":return h.newBlob(h.transformTo("arraybuffer",b),c);case"base64":return k.encode(b);default:return h.transformTo(a,b)}}function e(a,b){var c,d=0,e=null,f=0;for(c=0;c<b.length;c++)f+=b[c].length;switch(a){case"string":return b.join("");case"array":return Array.prototype.concat.apply([],b);case"uint8array":for(e=new Uint8Array(f),c=0;c<b.length;c++)e.set(b[c],d),d+=b[c].length;return e;case"nodebuffer":return Buffer.concat(b);default:throw new Error("concat : unsupported type '"+a+"'")}}function f(a,b){return new m.Promise(function(c,f){var g=[],h=a._internalType,i=a._outputType,j=a._mimeType;a.on("data",function(a,c){g.push(a),b&&b(c)}).on("error",function(a){g=[],f(a)}).on("end",function(){try{var a=d(i,e(h,g),j);c(a)}catch(b){f(b)}g=[]}).resume()})}function g(a,b,c){var d=b;switch(b){case"blob":case"arraybuffer":d="uint8array";break;case"base64":d="string"}try{this._internalType=d,this._outputType=b,this._mimeType=c,h.checkSupport(d),this._worker=a.pipe(new i(d)),a.lock()}catch(e){this._worker=new j("error"),this._worker.error(e)}}var h=a("../utils"),i=a("./ConvertWorker"),j=a("./GenericWorker"),k=a("../base64"),l=a("../support"),m=a("../external"),n=null;if(l.nodestream)try{n=a("../nodejs/NodejsStreamOutputAdapter")}catch(o){}g.prototype={accumulate:function(a){return f(this,a)},on:function(a,b){var c=this;return"data"===a?this._worker.on(a,function(a){b.call(c,a.data,a.meta)}):this._worker.on(a,function(){h.delay(b,arguments,c)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(a){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new n(this,{objectMode:"nodebuffer"!==this._outputType},a)}},b.exports=g},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(a,b,c){"use strict";if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer="undefined"!=typeof Buffer,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var d=new ArrayBuffer(0);try{c.blob=0===new Blob([d],{type:"application/zip"}).size}catch(e){try{var f=self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder,g=new f;g.append(d),c.blob=0===g.getBlob("application/zip").size}catch(e){c.blob=!1}}}try{c.nodestream=!!a("readable-stream").Readable}catch(e){c.nodestream=!1}},{"readable-stream":16}],31:[function(a,b,c){"use strict";function d(){i.call(this,"utf-8 decode"),this.leftOver=null}function e(){i.call(this,"utf-8 encode")}for(var f=a("./utils"),g=a("./support"),h=a("./nodejsUtils"),i=a("./stream/GenericWorker"),j=new Array(256),k=0;k<256;k++)j[k]=k>=252?6:k>=248?5:k>=240?4:k>=224?3:k>=192?2:1;j[254]=j[254]=1;var l=function(a){var b,c,d,e,f,h=a.length,i=0;for(e=0;e<h;e++)c=a.charCodeAt(e),55296===(64512&c)&&e+1<h&&(d=a.charCodeAt(e+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),e++)),i+=c<128?1:c<2048?2:c<65536?3:4;for(b=g.uint8array?new Uint8Array(i):new Array(i),f=0,e=0;f<i;e++)c=a.charCodeAt(e),55296===(64512&c)&&e+1<h&&(d=a.charCodeAt(e+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),e++)),c<128?b[f++]=c:c<2048?(b[f++]=192|c>>>6,b[f++]=128|63&c):c<65536?(b[f++]=224|c>>>12,b[f++]=128|c>>>6&63,b[f++]=128|63&c):(b[f++]=240|c>>>18,b[f++]=128|c>>>12&63,b[f++]=128|c>>>6&63,b[f++]=128|63&c);return b},m=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return c<0?b:0===c?b:c+j[a[c]]>b?c:b},n=function(a){var b,c,d,e,g=a.length,h=new Array(2*g);for(c=0,b=0;b<g;)if(d=a[b++],d<128)h[c++]=d;else if(e=j[d],e>4)h[c++]=65533,b+=e-1;else{for(d&=2===e?31:3===e?15:7;e>1&&b<g;)d=d<<6|63&a[b++],e--;e>1?h[c++]=65533:d<65536?h[c++]=d:(d-=65536,h[c++]=55296|d>>10&1023,h[c++]=56320|1023&d)}return h.length!==c&&(h.subarray?h=h.subarray(0,c):h.length=c),f.applyFromCharCode(h)};c.utf8encode=function(a){return g.nodebuffer?h.newBufferFrom(a,"utf-8"):l(a)},c.utf8decode=function(a){return g.nodebuffer?f.transformTo("nodebuffer",a).toString("utf-8"):(a=f.transformTo(g.uint8array?"uint8array":"array",a),n(a))},f.inherits(d,i),d.prototype.processChunk=function(a){var b=f.transformTo(g.uint8array?"uint8array":"array",a.data);if(this.leftOver&&this.leftOver.length){if(g.uint8array){var d=b;b=new Uint8Array(d.length+this.leftOver.length),b.set(this.leftOver,0),b.set(d,this.leftOver.length)}else b=this.leftOver.concat(b);this.leftOver=null}var e=m(b),h=b;e!==b.length&&(g.uint8array?(h=b.subarray(0,e),this.leftOver=b.subarray(e,b.length)):(h=b.slice(0,e),this.leftOver=b.slice(e,b.length))),this.push({data:c.utf8decode(h),meta:a.meta})},d.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:c.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},c.Utf8DecodeWorker=d,f.inherits(e,i),e.prototype.processChunk=function(a){this.push({data:c.utf8encode(a.data),meta:a.meta})},c.Utf8EncodeWorker=e},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(a,b,c){"use strict";function d(a){var b=null;return b=i.uint8array?new Uint8Array(a.length):new Array(a.length),f(a,b)}function e(a){return a}function f(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function g(a){var b=65536,d=c.getTypeOf(a),e=!0;if("uint8array"===d?e=n.applyCanBeUsed.uint8array:"nodebuffer"===d&&(e=n.applyCanBeUsed.nodebuffer),e)for(;b>1;)try{return n.stringifyByChunk(a,d,b)}catch(f){b=Math.floor(b/2)}return n.stringifyByChar(a)}function h(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];
return b}var i=a("./support"),j=a("./base64"),k=a("./nodejsUtils"),l=a("core-js/library/fn/set-immediate"),m=a("./external");c.newBlob=function(a,b){c.checkSupport("blob");try{return new Blob([a],{type:b})}catch(d){try{var e=self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder,f=new e;return f.append(a),f.getBlob(b)}catch(d){throw new Error("Bug : can't construct the Blob.")}}};var n={stringifyByChunk:function(a,b,c){var d=[],e=0,f=a.length;if(f<=c)return String.fromCharCode.apply(null,a);for(;e<f;)"array"===b||"nodebuffer"===b?d.push(String.fromCharCode.apply(null,a.slice(e,Math.min(e+c,f)))):d.push(String.fromCharCode.apply(null,a.subarray(e,Math.min(e+c,f)))),e+=c;return d.join("")},stringifyByChar:function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(a[c]);return b},applyCanBeUsed:{uint8array:function(){try{return i.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(a){return!1}}(),nodebuffer:function(){try{return i.nodebuffer&&1===String.fromCharCode.apply(null,k.allocBuffer(1)).length}catch(a){return!1}}()}};c.applyFromCharCode=g;var o={};o.string={string:e,array:function(a){return f(a,new Array(a.length))},arraybuffer:function(a){return o.string.uint8array(a).buffer},uint8array:function(a){return f(a,new Uint8Array(a.length))},nodebuffer:function(a){return f(a,k.allocBuffer(a.length))}},o.array={string:g,array:e,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return k.newBufferFrom(a)}},o.arraybuffer={string:function(a){return g(new Uint8Array(a))},array:function(a){return h(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:e,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return k.newBufferFrom(new Uint8Array(a))}},o.uint8array={string:g,array:function(a){return h(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:e,nodebuffer:function(a){return k.newBufferFrom(a)}},o.nodebuffer={string:g,array:function(a){return h(a,new Array(a.length))},arraybuffer:function(a){return o.nodebuffer.uint8array(a).buffer},uint8array:function(a){return h(a,new Uint8Array(a.length))},nodebuffer:e},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=o[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":i.nodebuffer&&k.isBuffer(a)?"nodebuffer":i.uint8array&&a instanceof Uint8Array?"uint8array":i.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=i[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this platform")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(b<16?"0":"")+b.toString(16).toUpperCase();return d},c.delay=function(a,b,c){l(function(){a.apply(c||null,b||[])})},c.inherits=function(a,b){var c=function(){};c.prototype=b.prototype,a.prototype=new c},c.extend=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},c.prepareContent=function(a,b,e,f,g){var h=m.Promise.resolve(b).then(function(a){var b=i.blob&&(a instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(a))!==-1);return b&&"undefined"!=typeof FileReader?new m.Promise(function(b,c){var d=new FileReader;d.onload=function(a){b(a.target.result)},d.onerror=function(a){c(a.target.error)},d.readAsArrayBuffer(a)}):a});return h.then(function(b){var h=c.getTypeOf(b);return h?("arraybuffer"===h?b=c.transformTo("uint8array",b):"string"===h&&(g?b=j.decode(b):e&&f!==!0&&(b=d(b))),b):m.Promise.reject(new Error("Can't read the data of '"+a+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"core-js/library/fn/set-immediate":36}],33:[function(a,b,c){"use strict";function d(a){this.files=[],this.loadOptions=a}var e=a("./reader/readerFor"),f=a("./utils"),g=a("./signature"),h=a("./zipEntry"),i=(a("./utf8"),a("./support"));d.prototype={checkSignature:function(a){if(!this.reader.readAndCheckSignature(a)){this.reader.index-=4;var b=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+f.pretty(b)+", expected "+f.pretty(a)+")")}},isSignature:function(a,b){var c=this.reader.index;this.reader.setIndex(a);var d=this.reader.readString(4),e=d===b;return this.reader.setIndex(c),e},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var a=this.reader.readData(this.zipCommentLength),b=i.uint8array?"uint8array":"array",c=f.transformTo(b,a);this.zipComment=this.loadOptions.decodeFileName(c)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;e<d;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readData(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(g.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8(),b.processAttributes()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(g.CENTRAL_FILE_HEADER);)a=new h({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(g.CENTRAL_DIRECTORY_END);if(a<0){var b=!this.isSignature(0,g.LOCAL_FILE_HEADER);throw b?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory")}this.reader.setIndex(a);var c=a;if(this.checkSignature(g.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===f.MAX_VALUE_16BITS||this.diskWithCentralDirStart===f.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===f.MAX_VALUE_16BITS||this.centralDirRecords===f.MAX_VALUE_16BITS||this.centralDirSize===f.MAX_VALUE_32BITS||this.centralDirOffset===f.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(g.ZIP64_CENTRAL_DIRECTORY_LOCATOR),a<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(a),this.checkSignature(g.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,g.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(g.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(g.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var d=this.centralDirOffset+this.centralDirSize;this.zip64&&(d+=20,d+=12+this.zip64EndOfCentralSize);var e=c-d;if(e>0)this.isSignature(c,g.CENTRAL_FILE_HEADER)||(this.reader.zero=e);else if(e<0)throw new Error("Corrupted zip: missing "+Math.abs(e)+" bytes.")},prepareReader:function(a){this.reader=e(a)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=d},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(a,b,c){"use strict";function d(a,b){this.options=a,this.loadOptions=b}var e=a("./reader/readerFor"),f=a("./utils"),g=a("./compressedObject"),h=a("./crc32"),i=a("./utf8"),j=a("./compressions"),k=a("./support"),l=0,m=3,n=function(a){for(var b in j)if(j.hasOwnProperty(b)&&j[b].magic===a)return j[b];return null};d.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readData(this.fileNameLength),a.skip(c),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(b=n(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+f.pretty(this.compressionMethod)+" unknown (inner file : "+f.transformTo("string",this.fileName)+")");this.decompressed=new g(this.compressedSize,this.uncompressedSize,this.crc32,b,a.readData(this.compressedSize))},readCentralPart:function(a){this.versionMadeBy=a.readInt(2),a.skip(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4);var b=a.readInt(2);if(this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");a.skip(b),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var a=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),a===l&&(this.dosPermissions=63&this.externalFileAttributes),a===m&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(a){if(this.extraFields[1]){var b=e(this.extraFields[1].value);this.uncompressedSize===f.MAX_VALUE_32BITS&&(this.uncompressedSize=b.readInt(8)),this.compressedSize===f.MAX_VALUE_32BITS&&(this.compressedSize=b.readInt(8)),this.localHeaderOffset===f.MAX_VALUE_32BITS&&(this.localHeaderOffset=b.readInt(8)),this.diskNumberStart===f.MAX_VALUE_32BITS&&(this.diskNumberStart=b.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});a.index<e;)b=a.readInt(2),c=a.readInt(2),d=a.readData(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){var a=k.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=i.utf8decode(this.fileName),this.fileCommentStr=i.utf8decode(this.fileComment);else{var b=this.findExtraFieldUnicodePath();if(null!==b)this.fileNameStr=b;else{var c=f.transformTo(a,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(c)}var d=this.findExtraFieldUnicodeComment();if(null!==d)this.fileCommentStr=d;else{var e=f.transformTo(a,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(e)}}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=e(a.value);return 1!==b.readInt(1)?null:h(this.fileName)!==b.readInt(4)?null:i.utf8decode(b.readData(a.length-5))}return null},findExtraFieldUnicodeComment:function(){var a=this.extraFields[25461];if(a){var b=e(a.value);return 1!==b.readInt(1)?null:h(this.fileComment)!==b.readInt(4)?null:i.utf8decode(b.readData(a.length-5))}return null}},b.exports=d},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(a,b,c){"use strict";var d=a("./stream/StreamHelper"),e=a("./stream/DataWorker"),f=a("./utf8"),g=a("./compressedObject"),h=a("./stream/GenericWorker"),i=function(a,b,c){this.name=a,this.dir=c.dir,this.date=c.date,this.comment=c.comment,this.unixPermissions=c.unixPermissions,this.dosPermissions=c.dosPermissions,this._data=b,this._dataBinary=c.binary,this.options={compression:c.compression,compressionOptions:c.compressionOptions}};i.prototype={internalStream:function(a){var b=null,c="string";try{if(!a)throw new Error("No output type specified.");c=a.toLowerCase();var e="string"===c||"text"===c;"binarystring"!==c&&"text"!==c||(c="string"),b=this._decompressWorker();var g=!this._dataBinary;g&&!e&&(b=b.pipe(new f.Utf8EncodeWorker)),!g&&e&&(b=b.pipe(new f.Utf8DecodeWorker))}catch(i){b=new h("error"),b.error(i)}return new d(b,c,"")},async:function(a,b){return this.internalStream(a).accumulate(b)},nodeStream:function(a,b){return this.internalStream(a||"nodebuffer").toNodejsStream(b)},_compressWorker:function(a,b){if(this._data instanceof g&&this._data.compression.magic===a.magic)return this._data.getCompressedWorker();var c=this._decompressWorker();return this._dataBinary||(c=c.pipe(new f.Utf8EncodeWorker)),g.createWorkerFrom(c,a,b)},_decompressWorker:function(){return this._data instanceof g?this._data.getContentWorker():this._data instanceof h?this._data:new e(this._data)}};for(var j=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],k=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},l=0;l<j.length;l++)i.prototype[j[l]]=k;b.exports=i},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(a,b,c){a("../modules/web.immediate"),b.exports=a("../modules/_core").setImmediate},{"../modules/_core":40,"../modules/web.immediate":56}],37:[function(a,b,c){b.exports=function(a){if("function"!=typeof a)throw TypeError(a+" is not a function!");return a}},{}],38:[function(a,b,c){var d=a("./_is-object");b.exports=function(a){if(!d(a))throw TypeError(a+" is not an object!");return a}},{"./_is-object":51}],39:[function(a,b,c){var d={}.toString;b.exports=function(a){return d.call(a).slice(8,-1)}},{}],40:[function(a,b,c){var d=b.exports={version:"2.3.0"};"number"==typeof __e&&(__e=d)},{}],41:[function(a,b,c){var d=a("./_a-function");b.exports=function(a,b,c){if(d(a),void 0===b)return a;switch(c){case 1:return function(c){return a.call(b,c)};case 2:return function(c,d){return a.call(b,c,d)};case 3:return function(c,d,e){return a.call(b,c,d,e)}}return function(){return a.apply(b,arguments)}}},{"./_a-function":37}],42:[function(a,b,c){b.exports=!a("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./_fails":45}],43:[function(a,b,c){var d=a("./_is-object"),e=a("./_global").document,f=d(e)&&d(e.createElement);b.exports=function(a){return f?e.createElement(a):{}}},{"./_global":46,"./_is-object":51}],44:[function(a,b,c){var d=a("./_global"),e=a("./_core"),f=a("./_ctx"),g=a("./_hide"),h="prototype",i=function(a,b,c){var j,k,l,m=a&i.F,n=a&i.G,o=a&i.S,p=a&i.P,q=a&i.B,r=a&i.W,s=n?e:e[b]||(e[b]={}),t=s[h],u=n?d:o?d[b]:(d[b]||{})[h];n&&(c=b);for(j in c)k=!m&&u&&void 0!==u[j],k&&j in s||(l=k?u[j]:c[j],s[j]=n&&"function"!=typeof u[j]?c[j]:q&&k?f(l,d):r&&u[j]==l?function(a){var b=function(b,c,d){if(this instanceof a){switch(arguments.length){case 0:return new a;case 1:return new a(b);case 2:return new a(b,c)}return new a(b,c,d)}return a.apply(this,arguments)};return b[h]=a[h],b}(l):p&&"function"==typeof l?f(Function.call,l):l,p&&((s.virtual||(s.virtual={}))[j]=l,a&i.R&&t&&!t[j]&&g(t,j,l)))};i.F=1,i.G=2,i.S=4,i.P=8,i.B=16,i.W=32,i.U=64,i.R=128,b.exports=i},{"./_core":40,"./_ctx":41,"./_global":46,"./_hide":47}],45:[function(a,b,c){b.exports=function(a){try{return!!a()}catch(b){return!0}}},{}],46:[function(a,b,c){var d=b.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=d)},{}],47:[function(a,b,c){var d=a("./_object-dp"),e=a("./_property-desc");b.exports=a("./_descriptors")?function(a,b,c){return d.f(a,b,e(1,c))}:function(a,b,c){return a[b]=c,a}},{"./_descriptors":42,"./_object-dp":52,"./_property-desc":53}],48:[function(a,b,c){b.exports=a("./_global").document&&document.documentElement},{"./_global":46}],49:[function(a,b,c){b.exports=!a("./_descriptors")&&!a("./_fails")(function(){return 7!=Object.defineProperty(a("./_dom-create")("div"),"a",{get:function(){return 7}}).a})},{"./_descriptors":42,"./_dom-create":43,"./_fails":45}],50:[function(a,b,c){b.exports=function(a,b,c){var d=void 0===c;switch(b.length){case 0:return d?a():a.call(c);case 1:return d?a(b[0]):a.call(c,b[0]);case 2:return d?a(b[0],b[1]):a.call(c,b[0],b[1]);case 3:return d?a(b[0],b[1],b[2]):a.call(c,b[0],b[1],b[2]);case 4:return d?a(b[0],b[1],b[2],b[3]):a.call(c,b[0],b[1],b[2],b[3])}return a.apply(c,b)}},{}],51:[function(a,b,c){b.exports=function(a){return"object"==typeof a?null!==a:"function"==typeof a}},{}],52:[function(a,b,c){var d=a("./_an-object"),e=a("./_ie8-dom-define"),f=a("./_to-primitive"),g=Object.defineProperty;c.f=a("./_descriptors")?Object.defineProperty:function(a,b,c){if(d(a),b=f(b,!0),d(c),e)try{return g(a,b,c)}catch(h){}if("get"in c||"set"in c)throw TypeError("Accessors not supported!");return"value"in c&&(a[b]=c.value),a}},{"./_an-object":38,"./_descriptors":42,"./_ie8-dom-define":49,"./_to-primitive":55}],53:[function(a,b,c){b.exports=function(a,b){return{enumerable:!(1&a),configurable:!(2&a),writable:!(4&a),value:b}}},{}],54:[function(a,b,c){var d,e,f,g=a("./_ctx"),h=a("./_invoke"),i=a("./_html"),j=a("./_dom-create"),k=a("./_global"),l=k.process,m=k.setImmediate,n=k.clearImmediate,o=k.MessageChannel,p=0,q={},r="onreadystatechange",s=function(){var a=+this;if(q.hasOwnProperty(a)){var b=q[a];delete q[a],b()}},t=function(a){s.call(a.data)};m&&n||(m=function(a){for(var b=[],c=1;arguments.length>c;)b.push(arguments[c++]);return q[++p]=function(){h("function"==typeof a?a:Function(a),b)},d(p),p},n=function(a){delete q[a]},"process"==a("./_cof")(l)?d=function(a){l.nextTick(g(s,a,1))}:o?(e=new o,f=e.port2,e.port1.onmessage=t,d=g(f.postMessage,f,1)):k.addEventListener&&"function"==typeof postMessage&&!k.importScripts?(d=function(a){k.postMessage(a+"","*")},k.addEventListener("message",t,!1)):d=r in j("script")?function(a){i.appendChild(j("script"))[r]=function(){i.removeChild(this),s.call(a)}}:function(a){setTimeout(g(s,a,1),0)}),b.exports={set:m,clear:n}},{"./_cof":39,"./_ctx":41,"./_dom-create":43,"./_global":46,"./_html":48,"./_invoke":50}],55:[function(a,b,c){var d=a("./_is-object");b.exports=function(a,b){if(!d(a))return a;var c,e;if(b&&"function"==typeof(c=a.toString)&&!d(e=c.call(a)))return e;if("function"==typeof(c=a.valueOf)&&!d(e=c.call(a)))return e;if(!b&&"function"==typeof(c=a.toString)&&!d(e=c.call(a)))return e;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":51}],56:[function(a,b,c){var d=a("./_export"),e=a("./_task");d(d.G+d.B,{setImmediate:e.set,clearImmediate:e.clear})},{"./_export":44,"./_task":54}],57:[function(a,b,c){(function(a){"use strict";function c(){k=!0;for(var a,b,c=l.length;c;){for(b=l,l=[],a=-1;++a<c;)b[a]();c=l.length}k=!1}function d(a){1!==l.push(a)||k||e()}var e,f=a.MutationObserver||a.WebKitMutationObserver;if(f){var g=0,h=new f(c),i=a.document.createTextNode("");h.observe(i,{characterData:!0}),e=function(){i.data=g=++g%2}}else if(a.setImmediate||"undefined"==typeof a.MessageChannel)e="document"in a&&"onreadystatechange"in a.document.createElement("script")?function(){var b=a.document.createElement("script");b.onreadystatechange=function(){c(),b.onreadystatechange=null,b.parentNode.removeChild(b),b=null},a.document.documentElement.appendChild(b)}:function(){setTimeout(c,0)};else{var j=new a.MessageChannel;j.port1.onmessage=c,e=function(){j.port2.postMessage(0)}}var k,l=[];b.exports=d}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],58:[function(a,b,c){"use strict";function d(){}function e(a){if("function"!=typeof a)throw new TypeError("resolver must be a function");this.state=s,this.queue=[],this.outcome=void 0,a!==d&&i(this,a)}function f(a,b,c){this.promise=a,"function"==typeof b&&(this.onFulfilled=b,this.callFulfilled=this.otherCallFulfilled),"function"==typeof c&&(this.onRejected=c,this.callRejected=this.otherCallRejected)}function g(a,b,c){o(function(){var d;try{d=b(c)}catch(e){return p.reject(a,e)}d===a?p.reject(a,new TypeError("Cannot resolve promise with itself")):p.resolve(a,d)})}function h(a){var b=a&&a.then;if(a&&("object"==typeof a||"function"==typeof a)&&"function"==typeof b)return function(){b.apply(a,arguments)}}function i(a,b){function c(b){f||(f=!0,p.reject(a,b))}function d(b){f||(f=!0,p.resolve(a,b))}function e(){b(d,c)}var f=!1,g=j(e);"error"===g.status&&c(g.value)}function j(a,b){var c={};try{c.value=a(b),c.status="success"}catch(d){c.status="error",c.value=d}return c}function k(a){return a instanceof this?a:p.resolve(new this(d),a)}function l(a){var b=new this(d);return p.reject(b,a)}function m(a){function b(a,b){function d(a){g[b]=a,++h!==e||f||(f=!0,p.resolve(j,g))}c.resolve(a).then(d,function(a){f||(f=!0,p.reject(j,a))})}var c=this;if("[object Array]"!==Object.prototype.toString.call(a))return this.reject(new TypeError("must be an array"));var e=a.length,f=!1;if(!e)return this.resolve([]);for(var g=new Array(e),h=0,i=-1,j=new this(d);++i<e;)b(a[i],i);return j}function n(a){function b(a){c.resolve(a).then(function(a){f||(f=!0,p.resolve(h,a))},function(a){f||(f=!0,p.reject(h,a))})}var c=this;if("[object Array]"!==Object.prototype.toString.call(a))return this.reject(new TypeError("must be an array"));var e=a.length,f=!1;if(!e)return this.resolve([]);for(var g=-1,h=new this(d);++g<e;)b(a[g]);return h}var o=a("immediate"),p={},q=["REJECTED"],r=["FULFILLED"],s=["PENDING"];b.exports=e,e.prototype["catch"]=function(a){return this.then(null,a)},e.prototype.then=function(a,b){if("function"!=typeof a&&this.state===r||"function"!=typeof b&&this.state===q)return this;var c=new this.constructor(d);if(this.state!==s){var e=this.state===r?a:b;g(c,e,this.outcome)}else this.queue.push(new f(c,a,b));return c},f.prototype.callFulfilled=function(a){p.resolve(this.promise,a)},f.prototype.otherCallFulfilled=function(a){g(this.promise,this.onFulfilled,a)},f.prototype.callRejected=function(a){p.reject(this.promise,a)},f.prototype.otherCallRejected=function(a){g(this.promise,this.onRejected,a)},p.resolve=function(a,b){var c=j(h,b);if("error"===c.status)return p.reject(a,c.value);var d=c.value;if(d)i(a,d);else{a.state=r,a.outcome=b;for(var e=-1,f=a.queue.length;++e<f;)a.queue[e].callFulfilled(b)}return a},p.reject=function(a,b){a.state=q,a.outcome=b;for(var c=-1,d=a.queue.length;++c<d;)a.queue[c].callRejected(b);return a},e.resolve=k,e.reject=l,e.all=m,e.race=n},{immediate:57}],59:[function(a,b,c){"use strict";var d=a("./lib/utils/common").assign,e=a("./lib/deflate"),f=a("./lib/inflate"),g=a("./lib/zlib/constants"),h={};d(h,e,f,g),b.exports=h},{"./lib/deflate":60,"./lib/inflate":61,"./lib/utils/common":62,"./lib/zlib/constants":65}],60:[function(a,b,c){"use strict";function d(a){if(!(this instanceof d))return new d(a);this.options=i.assign({level:s,method:u,chunkSize:16384,windowBits:15,memLevel:8,strategy:t,to:""},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new l,this.strm.avail_out=0;var c=h.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==p)throw new Error(k[c]);if(b.header&&h.deflateSetHeader(this.strm,b.header),b.dictionary){var e;if(e="string"==typeof b.dictionary?j.string2buf(b.dictionary):"[object ArrayBuffer]"===m.call(b.dictionary)?new Uint8Array(b.dictionary):b.dictionary,c=h.deflateSetDictionary(this.strm,e),c!==p)throw new Error(k[c]);this._dict_set=!0}}function e(a,b){var c=new d(b);if(c.push(a,!0),c.err)throw c.msg||k[c.err];return c.result}function f(a,b){return b=b||{},b.raw=!0,e(a,b)}function g(a,b){return b=b||{},b.gzip=!0,e(a,b)}var h=a("./zlib/deflate"),i=a("./utils/common"),j=a("./utils/strings"),k=a("./zlib/messages"),l=a("./zlib/zstream"),m=Object.prototype.toString,n=0,o=4,p=0,q=1,r=2,s=-1,t=0,u=8;d.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?o:n,"string"==typeof a?e.input=j.string2buf(a):"[object ArrayBuffer]"===m.call(a)?e.input=new Uint8Array(a):e.input=a,e.next_in=0,e.avail_in=e.input.length;do{if(0===e.avail_out&&(e.output=new i.Buf8(f),e.next_out=0,e.avail_out=f),c=h.deflate(e,d),c!==q&&c!==p)return this.onEnd(c),this.ended=!0,!1;0!==e.avail_out&&(0!==e.avail_in||d!==o&&d!==r)||("string"===this.options.to?this.onData(j.buf2binstring(i.shrinkBuf(e.output,e.next_out))):this.onData(i.shrinkBuf(e.output,e.next_out)))}while((e.avail_in>0||0===e.avail_out)&&c!==q);return d===o?(c=h.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===p):d!==r||(this.onEnd(p),e.avail_out=0,!0)},d.prototype.onData=function(a){this.chunks.push(a)},d.prototype.onEnd=function(a){a===p&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=d,c.deflate=e,c.deflateRaw=f,c.gzip=g},{"./utils/common":62,"./utils/strings":63,"./zlib/deflate":67,"./zlib/messages":72,"./zlib/zstream":74}],61:[function(a,b,c){"use strict";function d(a){if(!(this instanceof d))return new d(a);this.options=h.assign({chunkSize:16384,windowBits:0,to:""},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new l,this.strm.avail_out=0;var c=g.inflateInit2(this.strm,b.windowBits);if(c!==j.Z_OK)throw new Error(k[c]);this.header=new m,g.inflateGetHeader(this.strm,this.header)}function e(a,b){var c=new d(b);if(c.push(a,!0),c.err)throw c.msg||k[c.err];return c.result}function f(a,b){return b=b||{},b.raw=!0,e(a,b)}var g=a("./zlib/inflate"),h=a("./utils/common"),i=a("./utils/strings"),j=a("./zlib/constants"),k=a("./zlib/messages"),l=a("./zlib/zstream"),m=a("./zlib/gzheader"),n=Object.prototype.toString;d.prototype.push=function(a,b){var c,d,e,f,k,l,m=this.strm,o=this.options.chunkSize,p=this.options.dictionary,q=!1;if(this.ended)return!1;d=b===~~b?b:b===!0?j.Z_FINISH:j.Z_NO_FLUSH,"string"==typeof a?m.input=i.binstring2buf(a):"[object ArrayBuffer]"===n.call(a)?m.input=new Uint8Array(a):m.input=a,m.next_in=0,m.avail_in=m.input.length;do{if(0===m.avail_out&&(m.output=new h.Buf8(o),m.next_out=0,m.avail_out=o),c=g.inflate(m,j.Z_NO_FLUSH),c===j.Z_NEED_DICT&&p&&(l="string"==typeof p?i.string2buf(p):"[object ArrayBuffer]"===n.call(p)?new Uint8Array(p):p,c=g.inflateSetDictionary(this.strm,l)),c===j.Z_BUF_ERROR&&q===!0&&(c=j.Z_OK,q=!1),c!==j.Z_STREAM_END&&c!==j.Z_OK)return this.onEnd(c),this.ended=!0,!1;m.next_out&&(0!==m.avail_out&&c!==j.Z_STREAM_END&&(0!==m.avail_in||d!==j.Z_FINISH&&d!==j.Z_SYNC_FLUSH)||("string"===this.options.to?(e=i.utf8border(m.output,m.next_out),f=m.next_out-e,k=i.buf2string(m.output,e),m.next_out=f,m.avail_out=o-f,f&&h.arraySet(m.output,m.output,e,f,0),this.onData(k)):this.onData(h.shrinkBuf(m.output,m.next_out)))),0===m.avail_in&&0===m.avail_out&&(q=!0)}while((m.avail_in>0||0===m.avail_out)&&c!==j.Z_STREAM_END);return c===j.Z_STREAM_END&&(d=j.Z_FINISH),d===j.Z_FINISH?(c=g.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===j.Z_OK):d!==j.Z_SYNC_FLUSH||(this.onEnd(j.Z_OK),m.avail_out=0,!0)},d.prototype.onData=function(a){this.chunks.push(a)},d.prototype.onEnd=function(a){a===j.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=d,c.inflate=e,c.inflateRaw=f,c.ungzip=e},{"./utils/common":62,"./utils/strings":63,"./zlib/constants":65,"./zlib/gzheader":68,"./zlib/inflate":70,"./zlib/messages":72,"./zlib/zstream":74}],62:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray&&a.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;f<d;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;b<c;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;b<c;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;f<d;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],63:[function(a,b,c){"use strict";function d(a,b){if(b<65537&&(a.subarray&&g||!a.subarray&&f))return String.fromCharCode.apply(null,e.shrinkBuf(a,b));for(var c="",d=0;d<b;d++)c+=String.fromCharCode(a[d]);return c}var e=a("./common"),f=!0,g=!0;try{String.fromCharCode.apply(null,[0])}catch(h){f=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(h){g=!1}for(var i=new e.Buf8(256),j=0;j<256;j++)i[j]=j>=252?6:j>=248?5:j>=240?4:j>=224?3:j>=192?2:1;i[254]=i[254]=1,c.string2buf=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;f<h;f++)c=a.charCodeAt(f),55296===(64512&c)&&f+1<h&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=c<128?1:c<2048?2:c<65536?3:4;for(b=new e.Buf8(i),g=0,f=0;g<i;f++)c=a.charCodeAt(f),55296===(64512&c)&&f+1<h&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),c<128?b[g++]=c:c<2048?(b[g++]=192|c>>>6,b[g++]=128|63&c):c<65536?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},c.buf2binstring=function(a){return d(a,a.length)},c.binstring2buf=function(a){for(var b=new e.Buf8(a.length),c=0,d=b.length;c<d;c++)b[c]=a.charCodeAt(c);return b},c.buf2string=function(a,b){var c,e,f,g,h=b||a.length,j=new Array(2*h);for(e=0,c=0;c<h;)if(f=a[c++],f<128)j[e++]=f;else if(g=i[f],g>4)j[e++]=65533,c+=g-1;else{for(f&=2===g?31:3===g?15:7;g>1&&c<h;)f=f<<6|63&a[c++],g--;g>1?j[e++]=65533:f<65536?j[e++]=f:(f-=65536,j[e++]=55296|f>>10&1023,j[e++]=56320|1023&f)}return d(j,e)},c.utf8border=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return c<0?b:0===c?b:c+i[a[c]]>b?c:b}},{"./common":62}],64:[function(a,b,c){"use strict";function d(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0;
}b.exports=d},{}],65:[function(a,b,c){"use strict";b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],66:[function(a,b,c){"use strict";function d(){for(var a,b=[],c=0;c<256;c++){a=c;for(var d=0;d<8;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function e(a,b,c,d){var e=f,g=d+c;a^=-1;for(var h=d;h<g;h++)a=a>>>8^e[255&(a^b[h])];return a^-1}var f=d();b.exports=e},{}],67:[function(a,b,c){"use strict";function d(a,b){return a.msg=I[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b>=0;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(E.arraySet(a.output,b.pending_buf,b.pending_out,c,a.next_out),a.next_out+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){F._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,E.arraySet(b,a.input,a.next_in,e,c),1===a.state.wrap?a.adler=G(a.adler,b,e,c):2===a.state.wrap&&(a.adler=H(a.adler,b,e,c)),a.next_in+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-la?a.strstart-(a.w_size-la):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+ka,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&f<m);if(d=ka-(m-f),f=m-ka,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-la)){E.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=ja)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+ja-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<ja)););}while(a.lookahead<la&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===J)return ua;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return ua;if(a.strstart-a.block_start>=a.w_size-la&&(h(a,!1),0===a.strm.avail_out))return ua}return a.insert=0,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?ua:ua}function o(a,b){for(var c,d;;){if(a.lookahead<la){if(m(a),a.lookahead<la&&b===J)return ua;if(0===a.lookahead)break}if(c=0,a.lookahead>=ja&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+ja-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-la&&(a.match_length=l(a,c)),a.match_length>=ja)if(d=F._tr_tally(a,a.strstart-a.match_start,a.match_length-ja),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=ja){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+ja-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=F._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return ua}return a.insert=a.strstart<ja-1?a.strstart:ja-1,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?ua:va}function p(a,b){for(var c,d,e;;){if(a.lookahead<la){if(m(a),a.lookahead<la&&b===J)return ua;if(0===a.lookahead)break}if(c=0,a.lookahead>=ja&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+ja-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=ja-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-la&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===U||a.match_length===ja&&a.strstart-a.match_start>4096)&&(a.match_length=ja-1)),a.prev_length>=ja&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-ja,d=F._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-ja),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+ja-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=ja-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return ua}else if(a.match_available){if(d=F._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return ua}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=F._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<ja-1?a.strstart:ja-1,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?ua:va}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=ka){if(m(a),a.lookahead<=ka&&b===J)return ua;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=ja&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+ka;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&e<f);a.match_length=ka-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=ja?(c=F._tr_tally(a,1,a.match_length-ja),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=F._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return ua}return a.insert=0,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?ua:va}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===J)return ua;break}if(a.match_length=0,c=F._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return ua}return a.insert=0,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?ua:va}function s(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e}function t(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=D[a.level].max_lazy,a.good_match=D[a.level].good_length,a.nice_match=D[a.level].nice_length,a.max_chain_length=D[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=ja-1,a.match_available=0,a.ins_h=0}function u(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=$,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new E.Buf16(2*ha),this.dyn_dtree=new E.Buf16(2*(2*fa+1)),this.bl_tree=new E.Buf16(2*(2*ga+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new E.Buf16(ia+1),this.heap=new E.Buf16(2*ea+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new E.Buf16(2*ea+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function v(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=Z,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?na:sa,a.adler=2===b.wrap?0:1,b.last_flush=J,F._tr_init(b),O):d(a,Q)}function w(a){var b=v(a);return b===O&&t(a.state),b}function x(a,b){return a&&a.state?2!==a.state.wrap?Q:(a.state.gzhead=b,O):Q}function y(a,b,c,e,f,g){if(!a)return Q;var h=1;if(b===T&&(b=6),e<0?(h=0,e=-e):e>15&&(h=2,e-=16),f<1||f>_||c!==$||e<8||e>15||b<0||b>9||g<0||g>X)return d(a,Q);8===e&&(e=9);var i=new u;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+ja-1)/ja),i.window=new E.Buf8(2*i.w_size),i.head=new E.Buf16(i.hash_size),i.prev=new E.Buf16(i.w_size),i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new E.Buf8(i.pending_buf_size),i.d_buf=1*i.lit_bufsize,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,w(a)}function z(a,b){return y(a,b,$,aa,ba,Y)}function A(a,b){var c,h,k,l;if(!a||!a.state||b>N||b<0)return a?d(a,Q):Q;if(h=a.state,!a.output||!a.input&&0!==a.avail_in||h.status===ta&&b!==M)return d(a,0===a.avail_out?S:Q);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===na)if(2===h.wrap)a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead?(i(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),i(h,255&h.gzhead.time),i(h,h.gzhead.time>>8&255),i(h,h.gzhead.time>>16&255),i(h,h.gzhead.time>>24&255),i(h,9===h.level?2:h.strategy>=V||h.level<2?4:0),i(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(i(h,255&h.gzhead.extra.length),i(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(a.adler=H(a.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=oa):(i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=V||h.level<2?4:0),i(h,ya),h.status=sa);else{var m=$+(h.w_bits-8<<4)<<8,n=-1;n=h.strategy>=V||h.level<2?0:h.level<6?1:6===h.level?2:3,m|=n<<6,0!==h.strstart&&(m|=ma),m+=31-m%31,h.status=sa,j(h,m),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(h.status===oa)if(h.gzhead.extra){for(k=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending!==h.pending_buf_size));)i(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=pa)}else h.status=pa;if(h.status===pa)if(h.gzhead.name){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.gzindex=0,h.status=qa)}else h.status=qa;if(h.status===qa)if(h.gzhead.comment){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.status=ra)}else h.status=ra;if(h.status===ra&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&g(a),h.pending+2<=h.pending_buf_size&&(i(h,255&a.adler),i(h,a.adler>>8&255),a.adler=0,h.status=sa)):h.status=sa),0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,O}else if(0===a.avail_in&&e(b)<=e(c)&&b!==M)return d(a,S);if(h.status===ta&&0!==a.avail_in)return d(a,S);if(0!==a.avail_in||0!==h.lookahead||b!==J&&h.status!==ta){var o=h.strategy===V?r(h,b):h.strategy===W?q(h,b):D[h.level].func(h,b);if(o!==wa&&o!==xa||(h.status=ta),o===ua||o===wa)return 0===a.avail_out&&(h.last_flush=-1),O;if(o===va&&(b===K?F._tr_align(h):b!==N&&(F._tr_stored_block(h,0,0,!1),b===L&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,O}return b!==M?O:h.wrap<=0?P:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?O:P)}function B(a){var b;return a&&a.state?(b=a.state.status,b!==na&&b!==oa&&b!==pa&&b!==qa&&b!==ra&&b!==sa&&b!==ta?d(a,Q):(a.state=null,b===sa?d(a,R):O)):Q}function C(a,b){var c,d,e,g,h,i,j,k,l=b.length;if(!a||!a.state)return Q;if(c=a.state,g=c.wrap,2===g||1===g&&c.status!==na||c.lookahead)return Q;for(1===g&&(a.adler=G(a.adler,b,l,0)),c.wrap=0,l>=c.w_size&&(0===g&&(f(c.head),c.strstart=0,c.block_start=0,c.insert=0),k=new E.Buf8(c.w_size),E.arraySet(k,b,l-c.w_size,c.w_size,0),b=k,l=c.w_size),h=a.avail_in,i=a.next_in,j=a.input,a.avail_in=l,a.next_in=0,a.input=b,m(c);c.lookahead>=ja;){d=c.strstart,e=c.lookahead-(ja-1);do c.ins_h=(c.ins_h<<c.hash_shift^c.window[d+ja-1])&c.hash_mask,c.prev[d&c.w_mask]=c.head[c.ins_h],c.head[c.ins_h]=d,d++;while(--e);c.strstart=d,c.lookahead=ja-1,m(c)}return c.strstart+=c.lookahead,c.block_start=c.strstart,c.insert=c.lookahead,c.lookahead=0,c.match_length=c.prev_length=ja-1,c.match_available=0,a.next_in=i,a.input=j,a.avail_in=h,c.wrap=g,O}var D,E=a("../utils/common"),F=a("./trees"),G=a("./adler32"),H=a("./crc32"),I=a("./messages"),J=0,K=1,L=3,M=4,N=5,O=0,P=1,Q=-2,R=-3,S=-5,T=-1,U=1,V=2,W=3,X=4,Y=0,Z=2,$=8,_=9,aa=15,ba=8,ca=29,da=256,ea=da+1+ca,fa=30,ga=19,ha=2*ea+1,ia=15,ja=3,ka=258,la=ka+ja+1,ma=32,na=42,oa=69,pa=73,qa=91,ra=103,sa=113,ta=666,ua=1,va=2,wa=3,xa=4,ya=3;D=[new s(0,0,0,0,n),new s(4,4,8,4,o),new s(4,5,16,8,o),new s(4,6,32,32,o),new s(4,4,16,16,p),new s(8,16,32,32,p),new s(8,16,128,128,p),new s(8,32,128,256,p),new s(32,128,258,1024,p),new s(32,258,258,4096,p)],c.deflateInit=z,c.deflateInit2=y,c.deflateReset=w,c.deflateResetKeep=v,c.deflateSetHeader=x,c.deflate=A,c.deflateEnd=B,c.deflateSetDictionary=C,c.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":62,"./adler32":64,"./crc32":66,"./messages":72,"./trees":73}],68:[function(a,b,c){"use strict";function d(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}b.exports=d},{}],69:[function(a,b,c){"use strict";var d=30,e=12;b.exports=function(a,b){var c,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;c=a.state,f=a.next_in,B=a.input,g=f+(a.avail_in-5),h=a.next_out,C=a.output,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=c.dmax,l=c.wsize,m=c.whave,n=c.wnext,o=c.window,p=c.hold,q=c.bits,r=c.lencode,s=c.distcode,t=(1<<c.lenbits)-1,u=(1<<c.distbits)-1;a:do{q<15&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){c.mode=e;break a}a.msg="invalid literal/length code",c.mode=d;break a}x=65535&v,w&=15,w&&(q<w&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),q<15&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",c.mode=d;break a}if(y=65535&v,w&=15,q<w&&(p+=B[f++]<<q,q+=8,q<w&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",c.mode=d;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&c.sane){a.msg="invalid distance too far back",c.mode=d;break a}if(z=0,A=o,0===n){if(z+=l-w,w<x){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(n<w){if(z+=l+n-w,w-=n,w<x){x-=w;do C[h++]=o[z++];while(--w);if(z=0,n<x){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,w<x){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(f<g&&h<j);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in=f,a.next_out=h,a.avail_in=f<g?5+(g-f):5-(f-g),a.avail_out=h<j?257+(j-h):257-(h-j),c.hold=p,c.bits=q}},{}],70:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new s.Buf16(320),this.work=new s.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,a.msg="",b.wrap&&(a.adler=1&b.wrap),b.mode=L,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=b.lendyn=new s.Buf32(pa),b.distcode=b.distdyn=new s.Buf32(qa),b.sane=1,b.back=-1,D):G}function g(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,f(a)):G}function h(a,b){var c,d;return a&&a.state?(d=a.state,b<0?(c=0,b=-b):(c=(b>>4)+1,b<48&&(b&=15)),b&&(b<8||b>15)?G:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,g(a))):G}function i(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=h(a,b),c!==D&&(a.state=null),c):G}function j(a){return i(a,sa)}function k(a){if(ta){var b;for(q=new s.Buf32(512),r=new s.Buf32(32),b=0;b<144;)a.lens[b++]=8;for(;b<256;)a.lens[b++]=9;for(;b<280;)a.lens[b++]=7;for(;b<288;)a.lens[b++]=8;for(w(y,a.lens,0,288,q,0,a.work,{bits:9}),b=0;b<32;)a.lens[b++]=5;w(z,a.lens,0,32,r,0,a.work,{bits:5}),ta=!1}a.lencode=q,a.lenbits=9,a.distcode=r,a.distbits=5}function l(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new s.Buf8(f.wsize)),d>=f.wsize?(s.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),s.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(s.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function m(a,b){var c,e,f,g,h,i,j,m,n,o,p,q,r,pa,qa,ra,sa,ta,ua,va,wa,xa,ya,za,Aa=0,Ba=new s.Buf8(4),Ca=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!a||!a.state||!a.output||!a.input&&0!==a.avail_in)return G;c=a.state,c.mode===W&&(c.mode=X),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,o=i,p=j,xa=D;a:for(;;)switch(c.mode){case L:if(0===c.wrap){c.mode=X;break}for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(2&c.wrap&&35615===m){c.check=0,Ba[0]=255&m,Ba[1]=m>>>8&255,c.check=u(c.check,Ba,2,0),m=0,n=0,c.mode=M;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&m)<<8)+(m>>8))%31){a.msg="incorrect header check",c.mode=ma;break}if((15&m)!==K){a.msg="unknown compression method",c.mode=ma;break}if(m>>>=4,n-=4,wa=(15&m)+8,0===c.wbits)c.wbits=wa;else if(wa>c.wbits){a.msg="invalid window size",c.mode=ma;break}c.dmax=1<<wa,a.adler=c.check=1,c.mode=512&m?U:W,m=0,n=0;break;case M:for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.flags=m,(255&c.flags)!==K){a.msg="unknown compression method",c.mode=ma;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=ma;break}c.head&&(c.head.text=m>>8&1),512&c.flags&&(Ba[0]=255&m,Ba[1]=m>>>8&255,c.check=u(c.check,Ba,2,0)),m=0,n=0,c.mode=N;case N:for(;n<32;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.time=m),512&c.flags&&(Ba[0]=255&m,Ba[1]=m>>>8&255,Ba[2]=m>>>16&255,Ba[3]=m>>>24&255,c.check=u(c.check,Ba,4,0)),m=0,n=0,c.mode=O;case O:for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.xflags=255&m,c.head.os=m>>8),512&c.flags&&(Ba[0]=255&m,Ba[1]=m>>>8&255,c.check=u(c.check,Ba,2,0)),m=0,n=0,c.mode=P;case P:if(1024&c.flags){for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length=m,c.head&&(c.head.extra_len=m),512&c.flags&&(Ba[0]=255&m,Ba[1]=m>>>8&255,c.check=u(c.check,Ba,2,0)),m=0,n=0}else c.head&&(c.head.extra=null);c.mode=Q;case Q:if(1024&c.flags&&(q=c.length,q>i&&(q=i),q&&(c.head&&(wa=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),s.arraySet(c.head.extra,e,g,q,wa)),512&c.flags&&(c.check=u(c.check,e,q,g)),i-=q,g+=q,c.length-=q),c.length))break a;c.length=0,c.mode=R;case R:if(2048&c.flags){if(0===i)break a;q=0;do wa=e[g+q++],c.head&&wa&&c.length<65536&&(c.head.name+=String.fromCharCode(wa));while(wa&&q<i);if(512&c.flags&&(c.check=u(c.check,e,q,g)),i-=q,g+=q,wa)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=S;case S:if(4096&c.flags){if(0===i)break a;q=0;do wa=e[g+q++],c.head&&wa&&c.length<65536&&(c.head.comment+=String.fromCharCode(wa));while(wa&&q<i);if(512&c.flags&&(c.check=u(c.check,e,q,g)),i-=q,g+=q,wa)break a}else c.head&&(c.head.comment=null);c.mode=T;case T:if(512&c.flags){for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(65535&c.check)){a.msg="header crc mismatch",c.mode=ma;break}m=0,n=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),a.adler=c.check=0,c.mode=W;break;case U:for(;n<32;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}a.adler=c.check=d(m),m=0,n=0,c.mode=V;case V:if(0===c.havedict)return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,F;a.adler=c.check=1,c.mode=W;case W:if(b===B||b===C)break a;case X:if(c.last){m>>>=7&n,n-=7&n,c.mode=ja;break}for(;n<3;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}switch(c.last=1&m,m>>>=1,n-=1,3&m){case 0:c.mode=Y;break;case 1:if(k(c),c.mode=ca,b===C){m>>>=2,n-=2;break a}break;case 2:c.mode=_;break;case 3:a.msg="invalid block type",c.mode=ma}m>>>=2,n-=2;break;case Y:for(m>>>=7&n,n-=7&n;n<32;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if((65535&m)!==(m>>>16^65535)){a.msg="invalid stored block lengths",c.mode=ma;break}if(c.length=65535&m,m=0,n=0,c.mode=Z,b===C)break a;case Z:c.mode=$;case $:if(q=c.length){if(q>i&&(q=i),q>j&&(q=j),0===q)break a;s.arraySet(f,e,g,q,h),i-=q,g+=q,j-=q,h+=q,c.length-=q;break}c.mode=W;break;case _:for(;n<14;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.nlen=(31&m)+257,m>>>=5,n-=5,c.ndist=(31&m)+1,m>>>=5,n-=5,c.ncode=(15&m)+4,m>>>=4,n-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=ma;break}c.have=0,c.mode=aa;case aa:for(;c.have<c.ncode;){for(;n<3;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.lens[Ca[c.have++]]=7&m,m>>>=3,n-=3}for(;c.have<19;)c.lens[Ca[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,ya={bits:c.lenbits},xa=w(x,c.lens,0,19,c.lencode,0,c.work,ya),c.lenbits=ya.bits,xa){a.msg="invalid code lengths set",c.mode=ma;break}c.have=0,c.mode=ba;case ba:for(;c.have<c.nlen+c.ndist;){for(;Aa=c.lencode[m&(1<<c.lenbits)-1],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(sa<16)m>>>=qa,n-=qa,c.lens[c.have++]=sa;else{if(16===sa){for(za=qa+2;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m>>>=qa,n-=qa,0===c.have){a.msg="invalid bit length repeat",c.mode=ma;break}wa=c.lens[c.have-1],q=3+(3&m),m>>>=2,n-=2}else if(17===sa){for(za=qa+3;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qa,n-=qa,wa=0,q=3+(7&m),m>>>=3,n-=3}else{for(za=qa+7;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qa,n-=qa,wa=0,q=11+(127&m),m>>>=7,n-=7}if(c.have+q>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=ma;break}for(;q--;)c.lens[c.have++]=wa}}if(c.mode===ma)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=ma;break}if(c.lenbits=9,ya={bits:c.lenbits},xa=w(y,c.lens,0,c.nlen,c.lencode,0,c.work,ya),c.lenbits=ya.bits,xa){a.msg="invalid literal/lengths set",c.mode=ma;break}if(c.distbits=6,c.distcode=c.distdyn,ya={bits:c.distbits},xa=w(z,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,ya),c.distbits=ya.bits,xa){a.msg="invalid distances set",c.mode=ma;break}if(c.mode=ca,b===C)break a;case ca:c.mode=da;case da:if(i>=6&&j>=258){a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,v(a,p),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,c.mode===W&&(c.back=-1);break}for(c.back=0;Aa=c.lencode[m&(1<<c.lenbits)-1],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(ra&&0===(240&ra)){for(ta=qa,ua=ra,va=sa;Aa=c.lencode[va+((m&(1<<ta+ua)-1)>>ta)],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(ta+qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=ta,n-=ta,c.back+=ta}if(m>>>=qa,n-=qa,c.back+=qa,c.length=sa,0===ra){c.mode=ia;break}if(32&ra){c.back=-1,c.mode=W;break}if(64&ra){a.msg="invalid literal/length code",c.mode=ma;break}c.extra=15&ra,c.mode=ea;case ea:if(c.extra){for(za=c.extra;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=fa;case fa:for(;Aa=c.distcode[m&(1<<c.distbits)-1],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(0===(240&ra)){for(ta=qa,ua=ra,va=sa;Aa=c.distcode[va+((m&(1<<ta+ua)-1)>>ta)],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(ta+qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=ta,n-=ta,c.back+=ta}if(m>>>=qa,n-=qa,c.back+=qa,64&ra){a.msg="invalid distance code",c.mode=ma;break}c.offset=sa,c.extra=15&ra,c.mode=ga;case ga:if(c.extra){for(za=c.extra;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.offset+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=ma;break}c.mode=ha;case ha:if(0===j)break a;if(q=p-j,c.offset>q){if(q=c.offset-q,q>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=ma;break}q>c.wnext?(q-=c.wnext,r=c.wsize-q):r=c.wnext-q,q>c.length&&(q=c.length),pa=c.window}else pa=f,r=h-c.offset,q=c.length;q>j&&(q=j),j-=q,c.length-=q;do f[h++]=pa[r++];while(--q);0===c.length&&(c.mode=da);break;case ia:if(0===j)break a;f[h++]=c.length,j--,c.mode=da;break;case ja:if(c.wrap){for(;n<32;){if(0===i)break a;i--,m|=e[g++]<<n,n+=8}if(p-=j,a.total_out+=p,c.total+=p,p&&(a.adler=c.check=c.flags?u(c.check,f,p,h-p):t(c.check,f,p,h-p)),p=j,(c.flags?m:d(m))!==c.check){a.msg="incorrect data check",c.mode=ma;break}m=0,n=0}c.mode=ka;case ka:if(c.wrap&&c.flags){for(;n<32;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=ma;break}m=0,n=0}c.mode=la;case la:xa=E;break a;case ma:xa=H;break a;case na:return I;case oa:default:return G}return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,(c.wsize||p!==a.avail_out&&c.mode<ma&&(c.mode<ja||b!==A))&&l(a,a.output,a.next_out,p-a.avail_out)?(c.mode=na,I):(o-=a.avail_in,p-=a.avail_out,a.total_in+=o,a.total_out+=p,c.total+=p,c.wrap&&p&&(a.adler=c.check=c.flags?u(c.check,f,p,a.next_out-p):t(c.check,f,p,a.next_out-p)),a.data_type=c.bits+(c.last?64:0)+(c.mode===W?128:0)+(c.mode===ca||c.mode===Z?256:0),(0===o&&0===p||b===A)&&xa===D&&(xa=J),xa)}function n(a){if(!a||!a.state)return G;var b=a.state;return b.window&&(b.window=null),a.state=null,D}function o(a,b){var c;return a&&a.state?(c=a.state,0===(2&c.wrap)?G:(c.head=b,b.done=!1,D)):G}function p(a,b){var c,d,e,f=b.length;return a&&a.state?(c=a.state,0!==c.wrap&&c.mode!==V?G:c.mode===V&&(d=1,d=t(d,b,f,0),d!==c.check)?H:(e=l(a,b,f,f))?(c.mode=na,I):(c.havedict=1,D)):G}var q,r,s=a("../utils/common"),t=a("./adler32"),u=a("./crc32"),v=a("./inffast"),w=a("./inftrees"),x=0,y=1,z=2,A=4,B=5,C=6,D=0,E=1,F=2,G=-2,H=-3,I=-4,J=-5,K=8,L=1,M=2,N=3,O=4,P=5,Q=6,R=7,S=8,T=9,U=10,V=11,W=12,X=13,Y=14,Z=15,$=16,_=17,aa=18,ba=19,ca=20,da=21,ea=22,fa=23,ga=24,ha=25,ia=26,ja=27,ka=28,la=29,ma=30,na=31,oa=32,pa=852,qa=592,ra=15,sa=ra,ta=!0;c.inflateReset=g,c.inflateReset2=h,c.inflateResetKeep=f,c.inflateInit=j,c.inflateInit2=i,c.inflate=m,c.inflateEnd=n,c.inflateGetHeader=o,c.inflateSetDictionary=p,c.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":62,"./adler32":64,"./crc32":66,"./inffast":69,"./inftrees":71}],71:[function(a,b,c){"use strict";var d=a("../utils/common"),e=15,f=852,g=592,h=0,i=1,j=2,k=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],l=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],m=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],n=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];b.exports=function(a,b,c,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C=s.bits,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=null,O=0,P=new d.Buf16(e+1),Q=new d.Buf16(e+1),R=null,S=0;for(D=0;D<=e;D++)P[D]=0;for(E=0;E<o;E++)P[b[c+E]]++;for(H=C,G=e;G>=1&&0===P[G];G--);if(H>G&&(H=G),0===G)return p[q++]=20971520,p[q++]=20971520,s.bits=1,0;for(F=1;F<G&&0===P[F];F++);for(H<F&&(H=F),K=1,D=1;D<=e;D++)if(K<<=1,K-=P[D],K<0)return-1;if(K>0&&(a===h||1!==G))return-1;for(Q[1]=0,D=1;D<e;D++)Q[D+1]=Q[D]+P[D];for(E=0;E<o;E++)0!==b[c+E]&&(r[Q[b[c+E]]++]=E);if(a===h?(N=R=r,y=19):a===i?(N=k,O-=257,R=l,S-=257,y=256):(N=m,R=n,y=-1),M=0,E=0,D=F,x=q,I=H,J=0,v=-1,L=1<<H,w=L-1,a===i&&L>f||a===j&&L>g)return 1;for(;;){z=D-J,r[E]<y?(A=0,B=r[E]):r[E]>y?(A=R[S+r[E]],B=N[O+r[E]]):(A=96,B=0),t=1<<D-J,u=1<<I,F=u;do u-=t,p[x+(M>>J)+u]=z<<24|A<<16|B|0;while(0!==u);for(t=1<<D-1;M&t;)t>>=1;if(0!==t?(M&=t-1,M+=t):M=0,E++,0===--P[D]){if(D===G)break;D=b[c+r[E]]}if(D>H&&(M&w)!==v){for(0===J&&(J=H),x+=F,I=D-J,K=1<<I;I+J<G&&(K-=P[I+J],!(K<=0));)I++,K<<=1;if(L+=1<<I,a===i&&L>f||a===j&&L>g)return 1;v=M&w,p[v]=H<<24|I<<16|x-q|0}}return 0!==M&&(p[x+M]=D-J<<24|64<<16|0),s.bits=H,0}},{"../utils/common":62}],72:[function(a,b,c){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],73:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b>=0;)a[b]=0}function e(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length}function f(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b}function g(a){return a<256?ia[a]:ia[256+(a>>>7)]}function h(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function i(a,b,c){a.bi_valid>X-c?(a.bi_buf|=b<<a.bi_valid&65535,h(a,a.bi_buf),a.bi_buf=b>>X-a.bi_valid,a.bi_valid+=c-X):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function j(a,b,c){i(a,c[2*b],c[2*b+1])}function k(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function l(a){16===a.bi_valid?(h(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function m(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;f<=W;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,
c=a.heap_max+1;c<V;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function n(a,b,c){var d,e,f=new Array(W+1),g=0;for(d=1;d<=W;d++)f[d]=g=g+c[d-1]<<1;for(e=0;e<=b;e++){var h=a[2*e+1];0!==h&&(a[2*e]=k(f[h]++,h))}}function o(){var a,b,c,d,f,g=new Array(W+1);for(c=0,d=0;d<Q-1;d++)for(ka[d]=c,a=0;a<1<<ba[d];a++)ja[c++]=d;for(ja[c-1]=d,f=0,d=0;d<16;d++)for(la[d]=f,a=0;a<1<<ca[d];a++)ia[f++]=d;for(f>>=7;d<T;d++)for(la[d]=f<<7,a=0;a<1<<ca[d]-7;a++)ia[256+f++]=d;for(b=0;b<=W;b++)g[b]=0;for(a=0;a<=143;)ga[2*a+1]=8,a++,g[8]++;for(;a<=255;)ga[2*a+1]=9,a++,g[9]++;for(;a<=279;)ga[2*a+1]=7,a++,g[7]++;for(;a<=287;)ga[2*a+1]=8,a++,g[8]++;for(n(ga,S+1,g),a=0;a<T;a++)ha[2*a+1]=5,ha[2*a]=k(a,5);ma=new e(ga,ba,R+1,S,W),na=new e(ha,ca,0,T,W),oa=new e(new Array(0),da,0,U,Y)}function p(a){var b;for(b=0;b<S;b++)a.dyn_ltree[2*b]=0;for(b=0;b<T;b++)a.dyn_dtree[2*b]=0;for(b=0;b<U;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*Z]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function q(a){a.bi_valid>8?h(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function r(a,b,c,d){q(a),d&&(h(a,c),h(a,~c)),G.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function s(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function t(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&s(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!s(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function u(a,b,c){var d,e,f,h,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],e=a.pending_buf[a.l_buf+k],k++,0===d?j(a,e,b):(f=ja[e],j(a,f+R+1,b),h=ba[f],0!==h&&(e-=ka[f],i(a,e,h)),d--,f=g(d),j(a,f,c),h=ca[f],0!==h&&(d-=la[f],i(a,d,h)));while(k<a.last_lit);j(a,Z,b)}function v(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=V,c=0;c<i;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=j<2?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)t(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],t(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,t(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],m(a,b),n(f,j,a.bl_count)}function w(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;d<=c;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(h<j?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*$]++):h<=10?a.bl_tree[2*_]++:a.bl_tree[2*aa]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))}function x(a,b,c){var d,e,f=-1,g=b[1],h=0,k=7,l=4;for(0===g&&(k=138,l=3),d=0;d<=c;d++)if(e=g,g=b[2*(d+1)+1],!(++h<k&&e===g)){if(h<l){do j(a,e,a.bl_tree);while(0!==--h)}else 0!==e?(e!==f&&(j(a,e,a.bl_tree),h--),j(a,$,a.bl_tree),i(a,h-3,2)):h<=10?(j(a,_,a.bl_tree),i(a,h-3,3)):(j(a,aa,a.bl_tree),i(a,h-11,7));h=0,f=e,0===g?(k=138,l=3):e===g?(k=6,l=3):(k=7,l=4)}}function y(a){var b;for(w(a,a.dyn_ltree,a.l_desc.max_code),w(a,a.dyn_dtree,a.d_desc.max_code),v(a,a.bl_desc),b=U-1;b>=3&&0===a.bl_tree[2*ea[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function z(a,b,c,d){var e;for(i(a,b-257,5),i(a,c-1,5),i(a,d-4,4),e=0;e<d;e++)i(a,a.bl_tree[2*ea[e]+1],3);x(a,a.dyn_ltree,b-1),x(a,a.dyn_dtree,c-1)}function A(a){var b,c=4093624447;for(b=0;b<=31;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return I;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return J;for(b=32;b<R;b++)if(0!==a.dyn_ltree[2*b])return J;return I}function B(a){pa||(o(),pa=!0),a.l_desc=new f(a.dyn_ltree,ma),a.d_desc=new f(a.dyn_dtree,na),a.bl_desc=new f(a.bl_tree,oa),a.bi_buf=0,a.bi_valid=0,p(a)}function C(a,b,c,d){i(a,(L<<1)+(d?1:0),3),r(a,b,c,!0)}function D(a){i(a,M<<1,3),j(a,Z,ga),l(a)}function E(a,b,c,d){var e,f,g=0;a.level>0?(a.strm.data_type===K&&(a.strm.data_type=A(a)),v(a,a.l_desc),v(a,a.d_desc),g=y(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,f<=e&&(e=f)):e=f=c+5,c+4<=e&&b!==-1?C(a,b,c,d):a.strategy===H||f===e?(i(a,(M<<1)+(d?1:0),3),u(a,ga,ha)):(i(a,(N<<1)+(d?1:0),3),z(a,a.l_desc.max_code+1,a.d_desc.max_code+1,g+1),u(a,a.dyn_ltree,a.dyn_dtree)),p(a),d&&q(a)}function F(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(ja[c]+R+1)]++,a.dyn_dtree[2*g(b)]++),a.last_lit===a.lit_bufsize-1}var G=a("../utils/common"),H=4,I=0,J=1,K=2,L=0,M=1,N=2,O=3,P=258,Q=29,R=256,S=R+1+Q,T=30,U=19,V=2*S+1,W=15,X=16,Y=7,Z=256,$=16,_=17,aa=18,ba=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ca=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],da=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],ea=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],fa=512,ga=new Array(2*(S+2));d(ga);var ha=new Array(2*T);d(ha);var ia=new Array(fa);d(ia);var ja=new Array(P-O+1);d(ja);var ka=new Array(Q);d(ka);var la=new Array(T);d(la);var ma,na,oa,pa=!1;c._tr_init=B,c._tr_stored_block=C,c._tr_flush_block=E,c._tr_tally=F,c._tr_align=D},{"../utils/common":62}],74:[function(a,b,c){"use strict";function d(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=d},{}]},{},[10])(10)});
/*
FileSaver.js

The MIT License

Copyright (c) 2016 [Eli Grey][1].

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  [1]: http://eligrey.com
*/
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});

// WHAT: Concatenated JavaScript source files
// PROGRAM: Retro n-gon renderer
// VERSION: live (15 June 2019 21:22:26 UTC)
// AUTHOR: Tarpeeksi Hyvae Soft and others
// LINK: https://www.github.com/leikareipa/retro-ngon/
// FILES:
//	../js/retro-ngon/retro-ngon.js
//	../js/retro-ngon/trig.js
//	../js/retro-ngon/color.js
//	../js/retro-ngon/geometry.js
//	../js/retro-ngon/line-draw.js
//	../js/retro-ngon/matrix44.js
//	../js/retro-ngon/ngon-fill.js
//	../js/retro-ngon/render.js
//	../js/retro-ngon/transform.js
//	../js/retro-ngon/texture.js
//	../js/retro-ngon/screen.js
/////////////////////////////////////////////////

/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 *
 */

"use strict";

// Top-level namespace for the retro n-gon renderer.
const Rngon = {};

// Various small utility functions and the like.
{
    // Defined 'true' to allow for the conveniency of named in-place assertions,
    // e.g. Rngon.assert && (x === 1) || Rngon.throw("X wasn't 1.").
    // Note that setting this to 'false' won't disable assertions - for that,
    // you'll want to search/replace "Rngon.assert &&" with "Rngon.assert ||"
    // and keep this set to 'true'. The comparison against Rngon.assert may still
    // be done, though (I guess depending on the JS engine's ability to optimize).
    Object.defineProperty(Rngon, "assert", {value:true, writable:false});

    Rngon.lerp = (x, y, interval)=>(x + (interval * (y - x)));

    Rngon.throw = (errMessage = "")=>
    {
        alert("Retro n-gon error: " + errMessage);
        throw Error("Retro n-gon error: " + errMessage);
    }

    Rngon.log = (string = "Hello there.")=>
    {
        console.log("Retro n-gon: " + string);
    }
}
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 * 
 */

"use strict";

// Trigonometric lookup tables, and helper functions for accessing them.
Rngon.trig = (function()
{
    const publicInterface = Object.freeze(
    {
        // Returns approximations of sin() and cos() for degrees 0..359 given in
        // the range 0..65535. For instance, to get sin() for 144 deg, you'd call
        // sin(deg(144)), or alternatively sin(26214).
        // NOTE: Doesn't validate the input, so make sure it's in the correct range
        //       before calling these functions.
        sin: (x)=>sineLut[x>>6],
        cos: (x)=>sineLut[(x>>6)+256],

        // Transforms the given value 0..359 to the range 0..65535, which can, for
        // instance, be fed into the sin() and cos() helper functions, above.
        // Will wrap the input value to the correct range.
        // The magic number 182.04166666666666 is 65535/360.
        deg: (deg)=>(182.04166666666666 * (deg >= 0? (deg % 360) : (360 - (Math.abs(deg) % 360)))),
    });

    // Range: 0-1023 for sin() + 256 for approximating cos().
    const sineLut =
    [0.0000000,
    0.0061359, 0.0122715, 0.0184067, 0.0245412, 0.0306748, 0.0368072, 0.0429383, 0.0490677,
    0.0551952, 0.0613207, 0.0674439, 0.0735646, 0.0796824, 0.0857973, 0.0919090, 0.0980171,
    0.1041216, 0.1102222, 0.1163186, 0.1224107, 0.1284981, 0.1345807, 0.1406582, 0.1467305,
    0.1527972, 0.1588581, 0.1649131, 0.1709619, 0.1770042, 0.1830399, 0.1890687, 0.1950903,
    0.2011046, 0.2071114, 0.2131103, 0.2191012, 0.2250839, 0.2310581, 0.2370236, 0.2429802,
    0.2489276, 0.2548657, 0.2607941, 0.2667128, 0.2726214, 0.2785197, 0.2844075, 0.2902847,
    0.2961509, 0.3020059, 0.3078496, 0.3136817, 0.3195020, 0.3253103, 0.3311063, 0.3368899,
    0.3426607, 0.3484187, 0.3541635, 0.3598950, 0.3656130, 0.3713172, 0.3770074, 0.3826834,
    0.3883450, 0.3939920, 0.3996242, 0.4052413, 0.4108432, 0.4164296, 0.4220003, 0.4275551,
    0.4330938, 0.4386162, 0.4441221, 0.4496113, 0.4550836, 0.4605387, 0.4659765, 0.4713967,
    0.4767992, 0.4821838, 0.4875502, 0.4928982, 0.4982277, 0.5035384, 0.5088301, 0.5141027,
    0.5193560, 0.5245897, 0.5298036, 0.5349976, 0.5401715, 0.5453250, 0.5504580, 0.5555702,
    0.5606616, 0.5657318, 0.5707807, 0.5758082, 0.5808140, 0.5857979, 0.5907597, 0.5956993,
    0.6006165, 0.6055110, 0.6103828, 0.6152316, 0.6200572, 0.6248595, 0.6296382, 0.6343933,
    0.6391244, 0.6438315, 0.6485144, 0.6531728, 0.6578067, 0.6624158, 0.6669999, 0.6715590,
    0.6760927, 0.6806010, 0.6850837, 0.6895405, 0.6939715, 0.6983762, 0.7027547, 0.7071068,
    0.7114322, 0.7157308, 0.7200025, 0.7242471, 0.7284644, 0.7326543, 0.7368166, 0.7409511,
    0.7450578, 0.7491364, 0.7531868, 0.7572088, 0.7612024, 0.7651673, 0.7691033, 0.7730105,
    0.7768885, 0.7807372, 0.7845566, 0.7883464, 0.7921066, 0.7958369, 0.7995373, 0.8032075,
    0.8068476, 0.8104572, 0.8140363, 0.8175848, 0.8211025, 0.8245893, 0.8280450, 0.8314696,
    0.8348629, 0.8382247, 0.8415550, 0.8448536, 0.8481203, 0.8513552, 0.8545580, 0.8577286,
    0.8608669, 0.8639729, 0.8670462, 0.8700870, 0.8730950, 0.8760701, 0.8790122, 0.8819213,
    0.8847971, 0.8876396, 0.8904487, 0.8932243, 0.8959662, 0.8986745, 0.9013488, 0.9039893,
    0.9065957, 0.9091680, 0.9117060, 0.9142098, 0.9166791, 0.9191139, 0.9215140, 0.9238795,
    0.9262102, 0.9285061, 0.9307670, 0.9329928, 0.9351835, 0.9373390, 0.9394592, 0.9415441,
    0.9435935, 0.9456073, 0.9475856, 0.9495282, 0.9514350, 0.9533060, 0.9551412, 0.9569403,
    0.9587035, 0.9604305, 0.9621214, 0.9637761, 0.9653944, 0.9669765, 0.9685221, 0.9700313,
    0.9715039, 0.9729400, 0.9743394, 0.9757021, 0.9770281, 0.9783174, 0.9795698, 0.9807853,
    0.9819639, 0.9831055, 0.9842101, 0.9852776, 0.9863081, 0.9873014, 0.9882576, 0.9891765,
    0.9900582, 0.9909026, 0.9917098, 0.9924795, 0.9932119, 0.9939070, 0.9945646, 0.9951847,
    0.9957674, 0.9963126, 0.9968203, 0.9972905, 0.9977231, 0.9981181, 0.9984756, 0.9987955,
    0.9990777, 0.9993224, 0.9995294, 0.9996988, 0.9998306, 0.9999247, 0.9999812, 1.0000000,
    0.9999812, 0.9999247, 0.9998306, 0.9996988, 0.9995294, 0.9993224, 0.9990777, 0.9987955,
    0.9984756, 0.9981181, 0.9977231, 0.9972905, 0.9968203, 0.9963126, 0.9957674, 0.9951847,
    0.9945646, 0.9939070, 0.9932119, 0.9924795, 0.9917098, 0.9909026, 0.9900582, 0.9891765,
    0.9882576, 0.9873014, 0.9863081, 0.9852776, 0.9842101, 0.9831055, 0.9819639, 0.9807853,
    0.9795698, 0.9783174, 0.9770281, 0.9757021, 0.9743394, 0.9729400, 0.9715039, 0.9700313,
    0.9685221, 0.9669765, 0.9653944, 0.9637761, 0.9621214, 0.9604305, 0.9587035, 0.9569403,
    0.9551412, 0.9533060, 0.9514350, 0.9495282, 0.9475856, 0.9456073, 0.9435935, 0.9415441,
    0.9394592, 0.9373390, 0.9351835, 0.9329928, 0.9307670, 0.9285061, 0.9262102, 0.9238795,
    0.9215140, 0.9191139, 0.9166791, 0.9142098, 0.9117060, 0.9091680, 0.9065957, 0.9039893,
    0.9013488, 0.8986745, 0.8959662, 0.8932243, 0.8904487, 0.8876396, 0.8847971, 0.8819213,
    0.8790122, 0.8760701, 0.8730950, 0.8700870, 0.8670462, 0.8639729, 0.8608669, 0.8577286,
    0.8545580, 0.8513552, 0.8481203, 0.8448536, 0.8415550, 0.8382247, 0.8348629, 0.8314696,
    0.8280450, 0.8245893, 0.8211025, 0.8175848, 0.8140363, 0.8104572, 0.8068476, 0.8032075,
    0.7995373, 0.7958369, 0.7921066, 0.7883464, 0.7845566, 0.7807372, 0.7768885, 0.7730105,
    0.7691033, 0.7651673, 0.7612024, 0.7572088, 0.7531868, 0.7491364, 0.7450578, 0.7409511,
    0.7368166, 0.7326543, 0.7284644, 0.7242471, 0.7200025, 0.7157308, 0.7114322, 0.7071068,
    0.7027547, 0.6983762, 0.6939715, 0.6895405, 0.6850837, 0.6806010, 0.6760927, 0.6715590,
    0.6669999, 0.6624158, 0.6578067, 0.6531728, 0.6485144, 0.6438315, 0.6391244, 0.6343933,
    0.6296382, 0.6248595, 0.6200572, 0.6152316, 0.6103828, 0.6055110, 0.6006165, 0.5956993,
    0.5907597, 0.5857979, 0.5808140, 0.5758082, 0.5707807, 0.5657318, 0.5606616, 0.5555702,
    0.5504580, 0.5453250, 0.5401715, 0.5349976, 0.5298036, 0.5245897, 0.5193560, 0.5141027,
    0.5088301, 0.5035384, 0.4982277, 0.4928982, 0.4875502, 0.4821838, 0.4767992, 0.4713967,
    0.4659765, 0.4605387, 0.4550836, 0.4496113, 0.4441221, 0.4386162, 0.4330938, 0.4275551,
    0.4220003, 0.4164296, 0.4108432, 0.4052413, 0.3996242, 0.3939920, 0.3883450, 0.3826834,
    0.3770074, 0.3713172, 0.3656130, 0.3598950, 0.3541635, 0.3484187, 0.3426607, 0.3368899,
    0.3311063, 0.3253103, 0.3195020, 0.3136817, 0.3078496, 0.3020059, 0.2961509, 0.2902847,
    0.2844075, 0.2785197, 0.2726214, 0.2667128, 0.2607941, 0.2548657, 0.2489276, 0.2429802,
    0.2370236, 0.2310581, 0.2250839, 0.2191012, 0.2131103, 0.2071114, 0.2011046, 0.1950903,
    0.1890687, 0.1830399, 0.1770042, 0.1709619, 0.1649131, 0.1588581, 0.1527972, 0.1467305,
    0.1406582, 0.1345807, 0.1284981, 0.1224107, 0.1163186, 0.1102222, 0.1041216, 0.0980171,
    0.0919090, 0.0857973, 0.0796824, 0.0735646, 0.0674439, 0.0613207, 0.0551952, 0.0490677,
    0.0429383, 0.0368072, 0.0306748, 0.0245412, 0.0184067, 0.0122715, 0.0061359, 0.0000000,
    -0.0061359, -0.0122715, -0.0184067, -0.0245412, -0.0306748, -0.0368072, -0.0429383, -0.0490677,
    -0.0551952, -0.0613207, -0.0674439, -0.0735646, -0.0796824, -0.0857973, -0.0919090, -0.0980171,
    -0.1041216, -0.1102222, -0.1163186, -0.1224107, -0.1284981, -0.1345807, -0.1406582, -0.1467305,
    -0.1527972, -0.1588581, -0.1649131, -0.1709619, -0.1770042, -0.1830399, -0.1890687, -0.1950903,
    -0.2011046, -0.2071114, -0.2131103, -0.2191012, -0.2250839, -0.2310581, -0.2370236, -0.2429802,
    -0.2489276, -0.2548657, -0.2607941, -0.2667128, -0.2726214, -0.2785197, -0.2844075, -0.2902847,
    -0.2961509, -0.3020059, -0.3078496, -0.3136817, -0.3195020, -0.3253103, -0.3311063, -0.3368899,
    -0.3426607, -0.3484187, -0.3541635, -0.3598950, -0.3656130, -0.3713172, -0.3770074, -0.3826834,
    -0.3883450, -0.3939920, -0.3996242, -0.4052413, -0.4108432, -0.4164296, -0.4220003, -0.4275551,
    -0.4330938, -0.4386162, -0.4441221, -0.4496113, -0.4550836, -0.4605387, -0.4659765, -0.4713967,
    -0.4767992, -0.4821838, -0.4875502, -0.4928982, -0.4982277, -0.5035384, -0.5088301, -0.5141027,
    -0.5193560, -0.5245897, -0.5298036, -0.5349976, -0.5401715, -0.5453250, -0.5504580, -0.5555702,
    -0.5606616, -0.5657318, -0.5707807, -0.5758082, -0.5808140, -0.5857979, -0.5907597, -0.5956993,
    -0.6006165, -0.6055110, -0.6103828, -0.6152316, -0.6200572, -0.6248595, -0.6296382, -0.6343933,
    -0.6391244, -0.6438315, -0.6485144, -0.6531728, -0.6578067, -0.6624158, -0.6669999, -0.6715590,
    -0.6760927, -0.6806010, -0.6850837, -0.6895405, -0.6939715, -0.6983762, -0.7027547, -0.7071068,
    -0.7114322, -0.7157308, -0.7200025, -0.7242471, -0.7284644, -0.7326543, -0.7368166, -0.7409511,
    -0.7450578, -0.7491364, -0.7531868, -0.7572088, -0.7612024, -0.7651673, -0.7691033, -0.7730105,
    -0.7768885, -0.7807372, -0.7845566, -0.7883464, -0.7921066, -0.7958369, -0.7995373, -0.8032075,
    -0.8068476, -0.8104572, -0.8140363, -0.8175848, -0.8211025, -0.8245893, -0.8280450, -0.8314696,
    -0.8348629, -0.8382247, -0.8415550, -0.8448536, -0.8481203, -0.8513552, -0.8545580, -0.8577286,
    -0.8608669, -0.8639729, -0.8670462, -0.8700870, -0.8730950, -0.8760701, -0.8790122, -0.8819213,
    -0.8847971, -0.8876396, -0.8904487, -0.8932243, -0.8959662, -0.8986745, -0.9013488, -0.9039893,
    -0.9065957, -0.9091680, -0.9117060, -0.9142098, -0.9166791, -0.9191139, -0.9215140, -0.9238795,
    -0.9262102, -0.9285061, -0.9307670, -0.9329928, -0.9351835, -0.9373390, -0.9394592, -0.9415441,
    -0.9435935, -0.9456073, -0.9475856, -0.9495282, -0.9514350, -0.9533060, -0.9551412, -0.9569403,
    -0.9587035, -0.9604305, -0.9621214, -0.9637761, -0.9653944, -0.9669765, -0.9685221, -0.9700313,
    -0.9715039, -0.9729400, -0.9743394, -0.9757021, -0.9770281, -0.9783174, -0.9795698, -0.9807853,
    -0.9819639, -0.9831055, -0.9842101, -0.9852776, -0.9863081, -0.9873014, -0.9882576, -0.9891765,
    -0.9900582, -0.9909026, -0.9917098, -0.9924795, -0.9932119, -0.9939070, -0.9945646, -0.9951847,
    -0.9957674, -0.9963126, -0.9968203, -0.9972905, -0.9977231, -0.9981181, -0.9984756, -0.9987955,
    -0.9990777, -0.9993224, -0.9995294, -0.9996988, -0.9998306, -0.9999247, -0.9999812, -1.0000000,
    -0.9999812, -0.9999247, -0.9998306, -0.9996988, -0.9995294, -0.9993224, -0.9990777, -0.9987955,
    -0.9984756, -0.9981181, -0.9977231, -0.9972905, -0.9968203, -0.9963126, -0.9957674, -0.9951847,
    -0.9945646, -0.9939070, -0.9932119, -0.9924795, -0.9917098, -0.9909026, -0.9900582, -0.9891765,
    -0.9882576, -0.9873014, -0.9863081, -0.9852776, -0.9842101, -0.9831055, -0.9819639, -0.9807853,
    -0.9795698, -0.9783174, -0.9770281, -0.9757021, -0.9743394, -0.9729400, -0.9715039, -0.9700313,
    -0.9685221, -0.9669765, -0.9653944, -0.9637761, -0.9621214, -0.9604305, -0.9587035, -0.9569403,
    -0.9551412, -0.9533060, -0.9514350, -0.9495282, -0.9475856, -0.9456073, -0.9435935, -0.9415441,
    -0.9394592, -0.9373390, -0.9351835, -0.9329928, -0.9307670, -0.9285061, -0.9262102, -0.9238795,
    -0.9215140, -0.9191139, -0.9166791, -0.9142098, -0.9117060, -0.9091680, -0.9065957, -0.9039893,
    -0.9013488, -0.8986745, -0.8959662, -0.8932243, -0.8904487, -0.8876396, -0.8847971, -0.8819213,
    -0.8790122, -0.8760701, -0.8730950, -0.8700870, -0.8670462, -0.8639729, -0.8608669, -0.8577286,
    -0.8545580, -0.8513552, -0.8481203, -0.8448536, -0.8415550, -0.8382247, -0.8348629, -0.8314696,
    -0.8280450, -0.8245893, -0.8211025, -0.8175848, -0.8140363, -0.8104572, -0.8068476, -0.8032075,
    -0.7995373, -0.7958369, -0.7921066, -0.7883464, -0.7845566, -0.7807372, -0.7768885, -0.7730105,
    -0.7691033, -0.7651673, -0.7612024, -0.7572088, -0.7531868, -0.7491364, -0.7450578, -0.7409511,
    -0.7368166, -0.7326543, -0.7284644, -0.7242471, -0.7200025, -0.7157308, -0.7114322, -0.7071068,
    -0.7027547, -0.6983762, -0.6939715, -0.6895405, -0.6850837, -0.6806010, -0.6760927, -0.6715590,
    -0.6669999, -0.6624158, -0.6578067, -0.6531728, -0.6485144, -0.6438315, -0.6391244, -0.6343933,
    -0.6296382, -0.6248595, -0.6200572, -0.6152316, -0.6103828, -0.6055110, -0.6006165, -0.5956993,
    -0.5907597, -0.5857979, -0.5808140, -0.5758082, -0.5707807, -0.5657318, -0.5606616, -0.5555702,
    -0.5504580, -0.5453250, -0.5401715, -0.5349976, -0.5298036, -0.5245897, -0.5193560, -0.5141027,
    -0.5088301, -0.5035384, -0.4982277, -0.4928982, -0.4875502, -0.4821838, -0.4767992, -0.4713967,
    -0.4659765, -0.4605387, -0.4550836, -0.4496113, -0.4441221, -0.4386162, -0.4330938, -0.4275551,
    -0.4220003, -0.4164296, -0.4108432, -0.4052413, -0.3996242, -0.3939920, -0.3883450, -0.3826834,
    -0.3770074, -0.3713172, -0.3656130, -0.3598950, -0.3541635, -0.3484187, -0.3426607, -0.3368899,
    -0.3311063, -0.3253103, -0.3195020, -0.3136817, -0.3078496, -0.3020059, -0.2961509, -0.2902847,
    -0.2844075, -0.2785197, -0.2726214, -0.2667128, -0.2607941, -0.2548657, -0.2489276, -0.2429802,
    -0.2370236, -0.2310581, -0.2250839, -0.2191012, -0.2131103, -0.2071114, -0.2011046, -0.1950903,
    -0.1890687, -0.1830399, -0.1770042, -0.1709619, -0.1649131, -0.1588581, -0.1527972, -0.1467305,
    -0.1406582, -0.1345807, -0.1284981, -0.1224107, -0.1163186, -0.1102222, -0.1041216, -0.0980171,
    -0.0919090, -0.0857973, -0.0796824, -0.0735646, -0.0674439, -0.0613207, -0.0551952, -0.0490677,
    -0.0429383, -0.0368072, -0.0306748, -0.0245412, -0.0184067, -0.0122715, -0.0061359, -0.0000000,
    0.0061359, 0.0122715, 0.0184067, 0.0245412, 0.0306748, 0.0368072, 0.0429383, 0.0490677,
    0.0551952, 0.0613207, 0.0674439, 0.0735646, 0.0796824, 0.0857973, 0.0919090, 0.0980171,
    0.1041216, 0.1102222, 0.1163186, 0.1224107, 0.1284981, 0.1345807, 0.1406582, 0.1467305,
    0.1527972, 0.1588581, 0.1649131, 0.1709619, 0.1770042, 0.1830399, 0.1890687, 0.1950903,
    0.2011046, 0.2071114, 0.2131103, 0.2191012, 0.2250839, 0.2310581, 0.2370236, 0.2429802,
    0.2489276, 0.2548657, 0.2607941, 0.2667128, 0.2726214, 0.2785197, 0.2844075, 0.2902847,
    0.2961509, 0.3020059, 0.3078496, 0.3136817, 0.3195020, 0.3253103, 0.3311063, 0.3368899,
    0.3426607, 0.3484187, 0.3541635, 0.3598950, 0.3656130, 0.3713172, 0.3770074, 0.3826834,
    0.3883450, 0.3939920, 0.3996242, 0.4052413, 0.4108432, 0.4164296, 0.4220003, 0.4275551,
    0.4330938, 0.4386162, 0.4441221, 0.4496113, 0.4550836, 0.4605387, 0.4659765, 0.4713967,
    0.4767992, 0.4821838, 0.4875502, 0.4928982, 0.4982277, 0.5035384, 0.5088301, 0.5141027,
    0.5193560, 0.5245897, 0.5298036, 0.5349976, 0.5401715, 0.5453250, 0.5504580, 0.5555702,
    0.5606616, 0.5657318, 0.5707807, 0.5758082, 0.5808140, 0.5857979, 0.5907597, 0.5956993,
    0.6006165, 0.6055110, 0.6103828, 0.6152316, 0.6200572, 0.6248595, 0.6296382, 0.6343933,
    0.6391244, 0.6438315, 0.6485144, 0.6531728, 0.6578067, 0.6624158, 0.6669999, 0.6715590,
    0.6760927, 0.6806010, 0.6850837, 0.6895405, 0.6939715, 0.6983762, 0.7027547, 0.7071068,
    0.7114322, 0.7157308, 0.7200025, 0.7242471, 0.7284644, 0.7326543, 0.7368166, 0.7409511,
    0.7450578, 0.7491364, 0.7531868, 0.7572088, 0.7612024, 0.7651673, 0.7691033, 0.7730105,
    0.7768885, 0.7807372, 0.7845566, 0.7883464, 0.7921066, 0.7958369, 0.7995373, 0.8032075,
    0.8068476, 0.8104572, 0.8140363, 0.8175848, 0.8211025, 0.8245893, 0.8280450, 0.8314696,
    0.8348629, 0.8382247, 0.8415550, 0.8448536, 0.8481203, 0.8513552, 0.8545580, 0.8577286,
    0.8608669, 0.8639729, 0.8670462, 0.8700870, 0.8730950, 0.8760701, 0.8790122, 0.8819213,
    0.8847971, 0.8876396, 0.8904487, 0.8932243, 0.8959662, 0.8986745, 0.9013488, 0.9039893,
    0.9065957, 0.9091680, 0.9117060, 0.9142098, 0.9166791, 0.9191139, 0.9215140, 0.9238795,
    0.9262102, 0.9285061, 0.9307670, 0.9329928, 0.9351835, 0.9373390, 0.9394592, 0.9415441,
    0.9435935, 0.9456073, 0.9475856, 0.9495282, 0.9514350, 0.9533060, 0.9551412, 0.9569403,
    0.9587035, 0.9604305, 0.9621214, 0.9637761, 0.9653944, 0.9669765, 0.9685221, 0.9700313,
    0.9715039, 0.9729400, 0.9743394, 0.9757021, 0.9770281, 0.9783174, 0.9795698, 0.9807853,
    0.9819639, 0.9831055, 0.9842101, 0.9852776, 0.9863081, 0.9873014, 0.9882576, 0.9891765,
    0.9900582, 0.9909026, 0.9917098, 0.9924795, 0.9932119, 0.9939070, 0.9945646, 0.9951847,
    0.9957674, 0.9963126, 0.9968203, 0.9972905, 0.9977231, 0.9981181, 0.9984756, 0.9987955,
    0.9990777, 0.9993224, 0.9995294, 0.9996988, 0.9998306, 0.9999247, 0.9999812];

    return publicInterface;
})();
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 *
 */

"use strict";

// Red, green, blue, alpha; in the range 0..255.
// NOTE: Expects to remain immutable.
Rngon.color_rgba = function(red = 55, green = 55, blue = 55, alpha = 255)
{
    Rngon.assert && (((red   >= 0) && (red   <= 255)) &&
                     ((green >= 0) && (green <= 255)) &&
                     ((blue  >= 0) && (blue  <= 255)) &&
                     ((alpha >= 0) && (alpha <= 255)))
                 || Rngon.throw("The given color values are out of range.");

    // Alternate range, 0..1.
    const unitRange = Object.freeze({red:red/255, green:green/255, blue:blue/255, alpha:alpha/255});

    const publicInterface = Object.freeze(
    {
        red,
        green,
        blue,
        alpha,

        unitRange,

        // Returns the color as a "#rrggbbaa" string. You can mask out a particular color
        // channel by providing a bitmask where the corresponding bits are zero. For instance,
        // to mask out the alpha channel and return "#rrggbb", provide the mask 0x1110. When
        // masking out any channel but alpha, the corresponding channel(s) will be set to
        // "00"; e.g. [255,255,255,255](0x1010) -> "#ff00ff".
        as_hex: (channelMask = 0x1111)=>
        {
            const hex_value = (value)=>(((value < 10)? "0" : "") + value.toString(16));
            return ("#"
                    + ((channelMask & 0x1000)? hex_value(red)   : "00")
                    + ((channelMask & 0x0100)? hex_value(green) : "00")
                    + ((channelMask & 0x0010)? hex_value(blue)  : "00")
                    + ((channelMask & 0x0001)? hex_value(alpha) : ""));
        },
    });
    return publicInterface;
}
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 *
 * Functions to do with space; like vectors, vertices, etc.
 *
 */

"use strict";

// NOTE: Expects to remain immutable.
Rngon.vector3 = function(x = 0, y = 0, z = 0)
{
    Rngon.assert && (typeof x === "number" && typeof y === "number" && typeof z === "number")
                 || Rngon.throw("Expected numbers as parameters to the vector3 factory.");

    const publicInterface = Object.freeze(
    {
        x,
        y,
        z,

        cross: function(other = {})
        {
            return Rngon.vector3(((y * other.z) - (z * other.y)),
                                 ((z * other.x) - (x * other.z)),
                                 ((x * other.y) - (y * other.x)));
        },

        // Returns a normalized copy of the vector.
        normalized: function()
        {
            const sn = ((x * x) + (y * y) + (z * z));

            if (sn != 0 && sn != 1)
            {
                const inv = (1.0 / Math.sqrt(sn));
                return Rngon.vector3((x * inv), (y * inv), (z * inv));
            }
            else return Rngon.vector3(x, y, z);
        },
    });

    return publicInterface;
}
// Convenience aliases for vector3.
Rngon.translation_vector = Rngon.vector3;
Rngon.rotation_vector = (x, y, z)=>Rngon.vector3(Rngon.trig.deg(x), Rngon.trig.deg(y), Rngon.trig.deg(z));
Rngon.scaling_vector = Rngon.vector3;

// NOTE: Expects to remain immutable.
Rngon.vertex = function(x = 0, y = 0, z = 0, u = 0, v = 0, w = 1)
{
    Rngon.assert && (typeof x === "number" && typeof y === "number" && typeof z === "number" &&
                     typeof w === "number" && typeof u === "number" && typeof v === "number")
                 || Rngon.throw("Expected numbers as parameters to the vertex factory.");

    const publicInterface = Object.freeze(
    {
        x,
        y,
        z,
        w,
        u,
        v,

        // Returns a copy of the vertex transformed by the given matrix.
        transformed: function(m = [])
        {
            Rngon.assert && (m.length === 16)
                         || Rngon.throw("Expected a 4 x 4 matrix to transform the vertex by.");
            
            const x_ = ((m[0] * x) + (m[4] * y) + (m[ 8] * z) + (m[12] * w));
            const y_ = ((m[1] * x) + (m[5] * y) + (m[ 9] * z) + (m[13] * w));
            const z_ = ((m[2] * x) + (m[6] * y) + (m[10] * z) + (m[14] * w));
            const w_ = ((m[3] * x) + (m[7] * y) + (m[11] * z) + (m[15] * w));

            return Rngon.vertex(x_, y_, z_, u, v, w_);
        },

        // Returns a copy of the vertex with perspective division applied.
        perspective_divided: function()
        {
            return Rngon.vertex((x/w), (y/w), (z/w), u, v, w);
        }
    });

    return publicInterface;
}

// A single n-sided ngon.
// NOTE: Expects to remain immutable.
Rngon.ngon = function(vertices = [Rngon.vertex()], material = {})
{
    Rngon.assert && (vertices instanceof Array) || Rngon.throw("Expected an array of vertices to make an ngon.");
    Rngon.assert && (material instanceof Object) || Rngon.throw("Expected an object containing user-supplied options.");

    Rngon.assert && (typeof Rngon.ngon.defaultMaterial.color !== "undefined" &&
                     typeof Rngon.ngon.defaultMaterial.texture !== "undefined" &&
                     typeof Rngon.ngon.defaultMaterial.hasSolidFill !== "undefined" &&
                     typeof Rngon.ngon.defaultMaterial.hasWireframe !== "undefined" &&
                     typeof Rngon.ngon.defaultMaterial.wireframeColor !== "undefined")
                 || Rngon.throw("The default material object for ngon() is missing required properties.");

    // Combine default material options with the user-supplied ones.
    material = Object.freeze(
    {
        ...Rngon.ngon.defaultMaterial,
        ...material
    });

    vertices = Object.freeze(vertices);

    const publicInterface = Object.freeze(
    {
        vertices,
        material,

        perspective_divided: function()
        {
            // First clip the n-gon's vertices against the near plane, then apply perspective
            // division to them.
            return Rngon.ngon(vertices.filter(v=>(v.w >= 1)).map(v=>v.perspective_divided()), material);
        },

        transformed: function(matrix44)
        {
            return Rngon.ngon(vertices.map(vertex=>vertex.transformed(matrix44)), material);
        },
    });
    return publicInterface;
}
Rngon.ngon.defaultMaterial = 
{
    color: Rngon.color_rgba(255, 255, 255, 255),
    texture: null,
    textureMapping: "ortho",
    hasSolidFill: true,
    hasWireframe: false,
    wireframeColor: Rngon.color_rgba(0, 0, 0),
};

// A collection of ngons, with shared translation and rotation.
// NOTE: Expects to remain immutable.
Rngon.mesh = function(ngons = [Rngon.ngon()], transform = {})
{
    Rngon.assert && (ngons instanceof Array) || Rngon.throw("Expected a list of ngons for creating an ngon mesh.");
    Rngon.assert && (transform instanceof Object) || Rngon.throw("Expected an object with transformation properties.");

    Rngon.assert && (typeof Rngon.mesh.defaultTransform.rotation !== "undefined" &&
                     typeof Rngon.mesh.defaultTransform.translation !== "undefined" &&
                     typeof Rngon.mesh.defaultTransform.scaling !== "undefined")
                 || Rngon.throw("The default transforms object for mesh() is missing required properties.");

    // Combine default transformations with the user-supplied ones.
    transform = Object.freeze(
    {
        ...Rngon.mesh.defaultTransform,
        ...transform
    });

    // A matrix by which the ngons of this mesh should be transformed to get the ngongs into
    // the mesh's object space.
    const objectSpaceMatrix = (()=>
    {
        const translationMatrix = Rngon.matrix44.translate(transform.translation.x,
                                                           transform.translation.y,
                                                           transform.translation.z);
        const rotationMatrix = Rngon.matrix44.rotate(transform.rotation.x,
                                                     transform.rotation.y,
                                                     transform.rotation.z);
        const scalingMatrix = Rngon.matrix44.scale(transform.scaling.x,
                                                   transform.scaling.y,
                                                   transform.scaling.z);

        return Rngon.matrix44.matrices_multiplied(Rngon.matrix44.matrices_multiplied(translationMatrix, rotationMatrix), scalingMatrix);
    })();

    ngons = Object.freeze(ngons);
    
    const publicInterface = Object.freeze(
    {
        ngons,
        rotation: transform.rotation,
        translation: transform.translation,
        scale: transform.scaling,
        objectSpaceMatrix,
    });
    return publicInterface;
}
Rngon.mesh.defaultTransform = 
{
    translation: Rngon.translation_vector(0, 0, 0),
    rotation: Rngon.rotation_vector(0, 0, 0),
    scaling: Rngon.scaling_vector(1, 1, 1)
};
"use strict";

// Provides functions for drawing lines.
Rngon.line_draw = (()=>
{
    return Object.freeze(
    {
        // Draws a line between the two given vertices into the given array of pixels. It's
        // expected that the pixel array packs the pixels as consecutive RGBA values, each
        // in the range 0..255.
        into_pixel_buffer: function(vert1 = Rngon.vertex(),
                                    vert2 = Rngon.vertex(),
                                    pixelBuffer = [],
                                    bufferWidth = 0,
                                    bufferHeight = 0,
                                    lineColor = Rngon.color_rgba(127, 127, 127, 255))
        {
            function put_pixel(x = 0, y = 0)
            {
                if (x < 0 || x >= bufferWidth ||
                   (y < 0 || y >= bufferHeight)) return;

                const idx = ((x + y * bufferWidth) * 4);
                pixelBuffer[idx + 0] = lineColor.red;
                pixelBuffer[idx + 1] = lineColor.green;
                pixelBuffer[idx + 2] = lineColor.blue;
                pixelBuffer[idx + 3] = lineColor.alpha;
            }

            let x0 = Math.floor(vert1.x);
            let y0 = Math.floor(vert1.y);
            const x1 = Math.floor(vert2.x);
            const y1 = Math.floor(vert2.y);

            Rngon.assert && (!isNaN(x0) && !isNaN(x1) && !isNaN(y0) && !isNaN(y1))
                         || Rngon.throw("Invalid vertex coordinates for line-drawing.");

            // Bresenham line algo. Adapted from https://stackoverflow.com/a/4672319.
            {
                let dx = Math.abs(x1 - x0);
                let dy = Math.abs(y1 - y0);
                const sx = ((x0 < x1)? 1 : -1);
                const sy = ((y0 < y1)? 1 : -1); 
                let err = (((dx > dy)? dx : -dy) / 2);
                
                while (1)
                {
                    put_pixel(x0, y0);

                    if ((x0 === x1) && (y0 === y1)) break;

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
        },
        
        // 'Draws' a line between the two given vertices into the given array, such that
        // e.g. the coordinates 5,8 would be represented as array[8].x === 5. The yOffset
        // parameter lets you specify a value that'll be subtracted from all y coordinates
        // (i.e. from indices when writing into the array). Will interpolate the vertices'
        // u,v coordinates, as well, and place them into array[].u and array[].v.
        into_array: function(vert1 = Rngon.vertex(),
                             vert2 = Rngon.vertex(),
                             array = [],
                             yOffset = 0)
        {
            yOffset = Math.floor(yOffset);

            let x0 = Math.floor(vert1.x);
            let y0 = Math.floor(vert1.y);
            const x1 = Math.floor(vert2.x);
            const y1 = Math.floor(vert2.y);

            Rngon.assert && (!isNaN(x0) && !isNaN(x1) && !isNaN(y0) && !isNaN(y1))
                         || Rngon.throw("Invalid vertex coordinates for line-drawing.");

            const lineLength = distanceBetween(x0, y0, x1, y1);

            // If true, we won't touch non-null elements in the array. Useful in preventing certain
            // edge rendering errors.
            const noOverwrite = (y1 <= y0);

            // Bresenham line algo. Adapted from https://stackoverflow.com/a/4672319.
            {
                let dx = Math.abs(x1 - x0);
                let dy = Math.abs(y1 - y0);
                const sx = ((x0 < x1)? 1 : -1);
                const sy = ((y0 < y1)? 1 : -1); 
                let err = (((dx > dy)? dx : -dy) / 2);
                
                while (1)
                {
                    // Mark the pixel into the array.
                    {
                        // Interpolate the u,v coordinates.
                        const l = (distanceBetween(x1, y1, x0, y0) / (lineLength||1));
                        const u = Rngon.lerp(vert2.u, vert1.u, l);
                        const v = Rngon.lerp(vert2.v, vert1.v, l);

                        const pixel = {x:x0, u, v:(1-v)};

                        if (noOverwrite)
                        {
                            if (array[y0 - yOffset] == null) array[y0 - yOffset] = pixel;
                        }
                        else array[y0 - yOffset] = pixel;
                    }
                    
                    if ((x0 === x1) && (y0 === y1)) break;

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

            function distanceBetween(x1, y1, x2, y2)
            {
                return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
            }
        },
    });
})();
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 *
 * 4-by-4 matrix manipulation.
 * 
 * Adapted and modified from code written originally by Benny Bobaganoosh for his 3d software
 * renderer (https://github.com/BennyQBD/3DSoftwareRenderer). Full attribution:
 * {
 *     Copyright (c) 2014, Benny Bobaganoosh
 *     All rights reserved.
 *
 *     Redistribution and use in source and binary forms, with or without
 *     modification, are permitted provided that the following conditions are met:
 *
 *     1. Redistributions of source code must retain the above copyright notice, this
 *         list of conditions and the following disclaimer.
 *     2. Redistributions in binary form must reproduce the above copyright notice,
 *         this list of conditions and the following disclaimer in the documentation
 *         and/or other materials provided with the distribution.
 *
 *     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *     ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *     WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *     DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 *     ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *     (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *     LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *     ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * }
 *
 */

"use strict";

// Provides manipulation of 4-by-4 matrices.
Rngon.matrix44 = (()=>
{
    return Object.freeze(
    {
        scale: function(x = 0, y = 0, z = 0)
        {
            return Object.freeze([x, 0, 0, 0,
                                  0, y, 0, 0,
                                  0, 0, z, 0,
                                  0, 0, 0, 1]);
        },

        translate: function(x = 0, y = 0, z = 0)
        {
            return Object.freeze([1, 0, 0, 0,
                                  0, 1, 0, 0,
                                  0, 0, 1, 0,
                                  x, y, z, 1]);
        },

        rotate: function(x = 0, y = 0, z = 0)
        {
            const cos = Rngon.trig.cos;
            const sin = Rngon.trig.sin;

            const mx = [1,       0,       0,       0,
                        0,       cos(x),  -sin(x), 0,
                        0,       sin(x),  cos(x),  0,
                        0,       0,       0,       1];

            const my = [cos(y),  0,       sin(y),  0,
                        0,       1,       0,       0,
                        -sin(y), 0,       cos(y),  0,
                        0,       0,       0,       1];

            const mz = [cos(z),  -sin(z), 0,       0,
                        sin(z),  cos(z),  0,       0,
                        0,       0,       1,       0,
                        0,       0,       0,       1];

            const temp = Rngon.matrix44.matrices_multiplied(my, mz);
            const mResult = Rngon.matrix44.matrices_multiplied(mx, temp);

            Rngon.assert && (mResult.length === 16) || Rngon.throw("Expected a 4 x 4 matrix.");
            return Object.freeze(mResult);
        },

        perspective: function(fov = 0, aspectRatio = 0, zNear = 0, zFar = 0)
        {
            const fovHalf = Math.tan(fov / 2);
            const zRange = (zNear - zFar);

            return Object.freeze([(1 / (fovHalf * aspectRatio)), 0,             0,                             0,
                                   0,                            (1 / fovHalf), 0,                             0,
                                   0,                            0,             ((-zNear - zFar) / zRange),    1,
                                   0,                            0,             (2 * zFar * (zNear / zRange)), 0]);
        },

        ortho: function(width = 0, height = 0)
        {
            return Object.freeze([(width/2),     0,              0, 0,
                                  0,             -(height/2),    0, 0,
                                  0,             0,              1, 0,
                                  (width/2)-0.5, (height/2)-0.5, 0, 1]);
        },
        
        matrices_multiplied: function(m1 = [], m2 = [])
        {
            Rngon.assert && ((m1.length === 16) && (m2.length === 16))
                         || Rngon.throw("Expected 4 x 4 matrices.");

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

            Rngon.assert && (mResult.length === 16) || Rngon.throw("Expected a 4 x 4 matrix.");
            return Object.freeze(mResult);
        },
    });
})();
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 * 
 */

"use strict";

// Rasterizes the given ngons into the given RGBA pixel buffer of the given width and height.
Rngon.ngon_filler = function(ngons = [], pixelBuffer, renderWidth, renderHeight)
{
    Rngon.assert && (ngons instanceof Array) || Rngon.throw("Expected an array of ngons to be rasterized.");
    Rngon.assert && ((renderWidth > 0) && (renderHeight > 0))
                 || Rngon.throw("The transform surface can't have zero width or height.");

    ngons.forEach((ngon)=>
    {
        // Deal with n-gons that have fewer than 3 vertices.
        switch (ngon.vertices.length)
        {
            case 0: return;

            // A single point.
            case 1:
            {
                const idx = ((Math.floor(ngon.vertices[0].x) + Math.floor(ngon.vertices[0].y) * renderWidth) * 4);
                pixelBuffer[idx + 0] = ngon.material.color.red;
                pixelBuffer[idx + 1] = ngon.material.color.green;
                pixelBuffer[idx + 2] = ngon.material.color.blue;
                pixelBuffer[idx + 3] = ngon.material.color.alpha;

                // Move on to the next iteration in the forEach() chain.
                return;
            }

            // A line segment.
            case 2:
            {
                Rngon.line_draw.into_pixel_buffer(ngon.vertices[0], ngon.vertices[1],
                                                  pixelBuffer, renderWidth, renderHeight,
                                                  ngon.material.color)
                return;
            }

            // If the ngon has more than 2 vertices, fall through to the code below the switch block.
            default: break;
        }

        // Find which of the ngon's vertices form the ngon's left side and which the right.
        // With that information, we can then fill in the horizontal pixel spans between them.
        // The vertices will be arranged such that the first entry in the 'left' list will be the
        // ngon's top-most (lowest y) vertex, and entries after that successively higher in y.
        // For the 'right' list, the first entry will be the ngon's bottom-most vertex, and
        // entries following successively lower in y. In other words, by tracing the vertices
        // first through 'left' and then 'right', you end up with an anti-clockwise loop around
        // the ngon.
        const verts = ngon.vertices.slice();
        const leftVerts = [];
        const rightVerts = [];
        {
            // Sort the vertices by height (i.e. by increasing y).
            verts.sort((vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y < vertB.y)? -1 : 1)));
            const topVert = verts[0];
            const bottomVert = verts[verts.length-1];

            // The left side will always start with the top-most vertex, and the right side with
            // the bottom-most vertex.
            leftVerts.push(topVert);
            rightVerts.push(bottomVert);

            // Trace a line along x,y between the top-most vertex and the bottom-most vertex; and for
            // the two intervening vertices, find whether they're to the left or right of that line on
            // x. Being on the left side of that line means the vertex is on the ngon's left side,
            // and same for the right side.
            for (let i = 1; i < (verts.length - 1); i++)
            {
                const lr = Rngon.lerp(topVert.x, bottomVert.x, ((verts[i].y - topVert.y) / (bottomVert.y - topVert.y)));
                ((verts[i].x >= lr)? rightVerts : leftVerts).push(verts[i]);
            }

            // Sort the two sides' vertices so that we can trace them anti-clockwise starting from the top,
            // going down to the bottom vertex on the left side, and then back up to the top vertex along
            // the right side.
            leftVerts.sort((a, b)=>((a.y === b.y)? 0 : ((a.y < b.y)? -1 : 1)));
            rightVerts.sort((a, b)=>((a.y === b.y)? 0 : ((a.y > b.y)? -1 : 1)));

            Rngon.assert && ((leftVerts.length !== 0) && (rightVerts.length !== 0))
                         || Rngon.throw("Expected each side list to have at least one vertex.");
            Rngon.assert && ((leftVerts.length + rightVerts.length) === verts.length)
                         || Rngon.throw("Vertices appear to have gone missing.");

            Rngon.if && ((leftVerts.length === 0) || (rightVerts.length === 0)) && Rngon.bail("Expected each side list to have at least one vertex.")
        }

        // Create an array for each edge, where the index represents the y coordinate and the
        // value is the x coordinates at that y (e.g. the coordinates 5,8 would be represented
        // as array[8] === 5).
        /// CLEANUP: The code for this is a bit unsightly.
        const leftEdge = [];
        const rightEdge = [];
        {
            // Left edge.
            let prevVert = leftVerts[0];
            for (let l = 1; l < leftVerts.length; l++)
            {
                Rngon.line_draw.into_array(prevVert, leftVerts[l], leftEdge, verts[0].y);
                prevVert = leftVerts[l];
            }
            Rngon.line_draw.into_array(prevVert, rightVerts[0], leftEdge, verts[0].y);
            
            // Right edge.
            prevVert = rightVerts[0];
            for (let r = 1; r < rightVerts.length; r++)
            {
                Rngon.line_draw.into_array(prevVert, rightVerts[r], rightEdge, verts[0].y);
                prevVert = rightVerts[r];
            }
            Rngon.line_draw.into_array(prevVert, leftVerts[0], rightEdge, verts[0].y);
        }

        // Draw the ngon.
        {
            // Solid/textured fill.
            if (ngon.material.hasSolidFill)
            {
                const polyYOffset = Math.floor(verts[0].y);
                const polyHeight = leftEdge.length;

                for (let y = 0; y < polyHeight; y++)
                {
                    const rowWidth = (rightEdge[y].x - leftEdge[y].x);
                    if (rowWidth <= 0) continue;

                    for (let x = 0; x <= rowWidth; (x++, leftEdge[y].x++))
                    {
                        if (leftEdge[y].x >= 0 && leftEdge[y].x < renderWidth)
                        {
                            const px = leftEdge[y].x;
                            const py = (y + polyYOffset);

                            if (py >= 0 && py < renderHeight)
                            {
                                const idx = ((px + py * renderWidth) * 4);
                                
                                // Solid fill.
                                if (ngon.material.texture == null)
                                {
                                    pixelBuffer[idx + 0] = ngon.material.color.red;
                                    pixelBuffer[idx + 1] = ngon.material.color.green;
                                    pixelBuffer[idx + 2] = ngon.material.color.blue;
                                    pixelBuffer[idx + 3] = ngon.material.color.alpha;
                                }
                                // Textured fill.
                                else
                                {
                                    let u = 0, v = 0;
                                    switch (ngon.material.textureMapping)
                                    {
                                        case "affine":
                                        {
                                            u = (Rngon.lerp(leftEdge[y].u, rightEdge[y].u, x/rowWidth) * (ngon.material.texture.width-0.001));
                                            v = (Rngon.lerp(leftEdge[y].v, rightEdge[y].v, x/rowWidth) * (ngon.material.texture.height-0.001));

                                            // Wrap with repetition.
                                            /// FIXME: Doesn't wrap correctly.
                                            u %= ngon.material.texture.width;
                                            v %= ngon.material.texture.height;

                                            break;
                                        }
                                        case "ortho":
                                        {
                                            u = x * ((ngon.material.texture.width - 0.001) / rowWidth);
                                            v = y * ((ngon.material.texture.height - 0.001) / ((polyHeight-1)||1));

                                            break;
                                        }
                                        default: Rngon.throw("Unknown texture-mapping mode."); break;
                                    }

                                    const texelColorChannels = ngon.material.texture.rgba_channels_at(u, v);

                                    if (texelColorChannels[3] === 255)
                                    {
                                        pixelBuffer[idx + 0] = (texelColorChannels[0] * ngon.material.color.unitRange.red);
                                        pixelBuffer[idx + 1] = (texelColorChannels[1] * ngon.material.color.unitRange.green);
                                        pixelBuffer[idx + 2] = (texelColorChannels[2] * ngon.material.color.unitRange.blue);
                                        pixelBuffer[idx + 3] = (texelColorChannels[3] * ngon.material.color.unitRange.alpha);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Draw a wireframe around any ngons that wish for one.
            if (ngon.material.hasWireframe)
            {
                const wireColor = Rngon.color_rgba(0, 0, 0, 255);
                const putline = (vert1, vert2)=>
                {
                    Rngon.line_draw.into_pixel_buffer(vert1, vert2,
                                                      pixelBuffer, renderWidth, renderHeight,
                                                      ngon.material.wireframeColor)
                };

                // Left edge.
                let prevVert = leftVerts[0];
                for (let l = 1; l < leftVerts.length; l++)
                {
                    putline(prevVert, leftVerts[l]);
                    prevVert = leftVerts[l];
                }
                putline(prevVert, rightVerts[0]);

                // Right edge.
                prevVert = rightVerts[0];
                for (let r = 1; r < rightVerts.length; r++)
                {
                    putline(prevVert, rightVerts[r]);
                    prevVert = rightVerts[r];
                }
                putline(prevVert, leftVerts[0]);
            }
        }
    });
}
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 * 
 */

"use strict";

// Will create a HTML5 canvas element inside the given container, and render into it
// the given ngon meshes.
Rngon.render = function(canvasElementId,
                        meshes = [Rngon.mesh()],
                        options = {})
{
    // Initialize the object containing the data we'll return from this function.
    const callMetadata =
    {
        renderWidth: 0,
        renderHeight: 0,
        performance:
        {
            // How long we took to perform certain actions. All values are in milliseconds.
            timingMs:
            {
                // How long we took to initialize the renderer.
                initialization: performance.now(),

                // How long we took to transform all the supplied n-gons into screen space.
                transformation: 0,

                // How long we took to rasterize the supplied n-gons onto the target canvas.
                rasterization: 0,

                // How much time this function took, in total.
                total: performance.now(),
            }
        }
    }

    // Confirm that the default render options are valid.
    Rngon.assert && (typeof Rngon.render.defaultOptions.cameraPosition !== "undefined" &&
                     typeof Rngon.render.defaultOptions.cameraDirection !== "undefined" &&
                     typeof Rngon.render.defaultOptions.scale !== "undefined" &&
                     typeof Rngon.render.defaultOptions.depthSort !== "undefined" &&
                     typeof Rngon.render.defaultOptions.hibernateWhenNotOnScren !== "undefined" &&
                     typeof Rngon.render.defaultOptions.fov !== "undefined")
                 || Rngon.throw("The default options object for render() is missing required properties.");

    // Combine the default render options with the user-supplied ones.
    options = Object.freeze(
    {
        ...Rngon.render.defaultOptions,
        ...options
    });

    const renderSurface = Rngon.screen(canvasElementId, Rngon.ngon_filler, Rngon.ngon_transformer, options.scale, options.fov);

    callMetadata.renderWidth = renderSurface.width;
    callMetadata.renderHeight = renderSurface.height;

    callMetadata.performance.timingMs.initialization = (performance.now() - callMetadata.performance.timingMs.initialization);

    // Render a single frame onto the render surface.
    if ((!options.hibernateWhenNotOnScreen || is_surface_in_view()))
    {
        renderSurface.wipe_clean();

        // Transform.
        callMetadata.performance.timingMs.transformation = performance.now();
        const transformedNgons = [];
        {
            const cameraMatrix = Rngon.matrix44.matrices_multiplied(Rngon.matrix44.rotate(options.cameraDirection.x,
                                                                                          options.cameraDirection.y,
                                                                                          options.cameraDirection.z),
                                                                    Rngon.matrix44.translate(options.cameraPosition.x,
                                                                                             options.cameraPosition.y,
                                                                                             options.cameraPosition.z));

            meshes.forEach((mesh)=>
            {
                transformedNgons.push(...renderSurface.transformed_ngons(mesh.ngons, mesh.objectSpaceMatrix, cameraMatrix));
            });

            // Apply depth sorting to the transformed ngons.
            switch (options.depthSort)
            {
                case "none": break;

                // Painter's algorithm, i.e. sort by depth.
                case "painter":
                {
                    transformedNgons.sort((ngonA, ngonB)=>
                    {
                        let a = 0;
                        let b = 0;
                        ngonA.vertices.forEach(v=>{a += v.z});
                        ngonB.vertices.forEach(v=>{b += v.z});
        
                        // Ngons aren't guaranteed to have the same number of vertices each,
                        // so factor out the vertex count.
                        a /= ngonA.vertices.length;
                        b /= ngonB.vertices.length;
                        
                        return ((a === b)? 0 : ((a < b)? 1 : -1));
                    });

                    break;
                }
                
                default: Rngon.throw("Unknown depth sort option."); break;
            }
        }
        callMetadata.performance.timingMs.transformation = (performance.now() - callMetadata.performance.timingMs.transformation)

        // Rasterize.
        callMetadata.performance.timingMs.rasterization = performance.now();
        renderSurface.draw_ngons(transformedNgons);
        callMetadata.performance.timingMs.rasterization = (performance.now() - callMetadata.performance.timingMs.rasterization);

        callMetadata.performance.timingMs.total = (performance.now() - callMetadata.performance.timingMs.total);
        return callMetadata;
    }

    // Returns true if any horizontal part of the render surface DOM container is within the page's
    // visible region (accounting for the user having possibly scrolled the page up/down to cause
    // the container to have moved out of view).
    function is_surface_in_view()
    {
        const viewHeight = window.innerHeight;
        const containerRect = document.getElementById(canvasElementId).getBoundingClientRect();
        Rngon.assert && (containerRect != null) || Rngon.throw("Couldn't find the canvas container element.");

        return Boolean((containerRect.top > -containerRect.height) &&
                       (containerRect.top < viewHeight));
    }
};
Rngon.render.defaultOptions = 
{
    cameraPosition: Rngon.vector3(0, 0, 0),
    cameraDirection: Rngon.vector3(0, 0, 0),
    scale: 1,
    depthSort: "painter",
    fov: 43,
    hibernateWhenNotOnScren: true,
};
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 *
 */

"use strict";

// Returns a copy of the given list of ngons such that each ngon in the copy
// has been transformed into screen-space.
Rngon.ngon_transformer = function(ngons = [], screenSpaceMatrix = [])
{
    return ngons.map(ngon=>ngon.transformed(screenSpaceMatrix).perspective_divided());
}
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 * 
 */

"use strict";

// A 32-bit texture.
Rngon.texture_rgba = function(data = {width: 0, height: 0, pixels: []})
{
    // The maximum dimensions of a texture.
    const maxWidth = 32768;
    const maxHeight = 32768;

    const numColorChannels = 4;

    Rngon.assert && (Number.isInteger(data.width) && Number.isInteger(data.height))
                 || Rngon.throw("Expected texture width and height to be integer values.");
    Rngon.assert && (data.width > 0 && data.height > 0)
                 || Rngon.throw("Expected texture width and height to be greater than zero.");
    Rngon.assert && (data.width <= maxWidth && data.height <= maxHeight)
                 || Rngon.throw("Expected texture width/height to be no more than " + maxWidth + "/" + maxHeight + ".");

    // If necessary, decode the pixel data into raw RGBA/8888.
    if (typeof data.encoding !== "undefined" && data.encoding !== "none")
    {
        // In Base64-encoded data, each pixel's RGBA is expected to be given as a 16-bit
        // value, where each of the RGB channels takes up 5 bits and the alpha channel
        // 1 bit.
        if (data.encoding === "base64")
        {
            Rngon.assert && (data.channels === "rgba:5+5+5+1")
                         || Rngon.throw("Expected Base64-encoded data to be in RGBA 5551 format.");

            data.pixels = (()=>
            {
                const rgba = [];
                const decoded = atob(data.pixels);

                // We should have an array where each pixel is a 2-byte value.
                Rngon.assert && (decoded.length === (data.width * data.height * 2))
                             || Rngon.throw("Unexpected data length for a Base64-encoded texture.");

                for (let i = 0; i < (data.width * data.height * 2); i += 2)
                {
                    const p = (decoded.charCodeAt(i) | (decoded.charCodeAt(i+1)<<8));

                    rgba.push((p         & 0x1f) * 8);  // Red.
                    rgba.push(((p >> 5)  & 0x1f) * 8);  // Green.
                    rgba.push(((p >> 10) & 0x1f) * 8);  // Blue.
                    rgba.push(((p >> 15) & 1) * 255);   // Alpha.
                }

                return rgba;
            })();
        }
        else if (data.encoding !== "none")
        {
            Rngon.throw("Unknown texture data encoding '" + data.encoding + "'.");
        }
    }

    Rngon.assert && (data.pixels.length === (data.width * data.height * numColorChannels))
                 || Rngon.throw("The texture's pixel array size doesn't match its width and height.");
        
    const publicInterface = Object.freeze(
    {
        width: data.width,
        height: data.height,
        
        // Returns an unfrozen 4-element array containing copies of the texture's RGBA values
        // at the given x,y texel coordinates.
        rgba_channels_at: function(x, y)
        {
            x = Math.floor(x);
            y = Math.floor(y);

            const idx = ((x + y * data.width) * numColorChannels);
            Rngon.assert && ((idx + numColorChannels) <= data.pixels.length)
                         || Rngon.throw("Attempting to access a texture pixel out of bounds (at "+x+","+y+").");

            // Note: For performance reasons, the array isn't returned frozen. You can try freezing it
            // and running a perf test with textured rendering to see the effect.
            return [data.pixels[idx + 0],
                    data.pixels[idx + 1],
                    data.pixels[idx + 2],
                    data.pixels[idx + 3]];
        }
    });
    return publicInterface;
}

// Returns a Promise of a texture whose data is loaded from the given file. The actual
// texture is returned once the data has been loaded.
// Note: Only supports JSON files at the moment, expecting them to contain a valid
// object to be passed as-is into texture_rgba().
Rngon.texture_rgba.create_with_data_from_file = function(filename)
{
    return new Promise((resolve, reject)=>
    {
        fetch(filename)
        .then((response)=>response.json())
        .then((data)=>
        {
            resolve(Rngon.texture_rgba(data));
        })
        .catch((error)=>{Rngon.throw("Failed to create a texture with data from file '" + filename + "'. Error: '" + error + "'.")});
    });
}
/*
 * Tarpeeksi Hyvae Soft 2019 /
 * Retro n-gon renderer
 * 
 * A surface for rendering onto. Maps onto a HTML5 canvas.
 *
 */

"use strict";

Rngon.screen = function(canvasElementId = "",              // The DOM id of the canvas element.
                        ngon_fill_f = function(){},        // A function that rasterizes the given ngons onto the canvas.
                        ngon_transform_f = function(){},   // A function that transforms the given ngons into screen-space for the canvas.
                        scaleFactor = 1,
                        fov = 43)
{
    Rngon.assert && (typeof scaleFactor === "number") || Rngon.throw("Expected the scale factor to be a numeric value.");
    Rngon.assert && (typeof ngon_fill_f === "function" && typeof ngon_transform_f === "function")
                 || Rngon.throw("Expected ngon-manipulation functions to be provided.");

    const canvasElement = document.getElementById(canvasElementId);
    Rngon.assert && (canvasElement !== null) || Rngon.throw("Can't find the given canvas element.");

    // The pixel dimensions of the render surface.
    const screenWidth = Math.floor(parseInt(window.getComputedStyle(canvasElement).getPropertyValue("width")) * scaleFactor);
    const screenHeight = Math.floor(parseInt(window.getComputedStyle(canvasElement).getPropertyValue("height")) * scaleFactor);
    Rngon.assert && (!isNaN(screenWidth) && !isNaN(screenHeight)) || Rngon.throw("Failed to extract the canvas size.");
    canvasElement.setAttribute("width", screenWidth);
    canvasElement.setAttribute("height", screenHeight);

    const perspectiveMatrix = Rngon.matrix44.perspective((fov * Math.PI/180), (screenWidth / screenHeight), 1, 1000);
    const screenMatrix = Rngon.matrix44.ortho(screenWidth, screenHeight);

    function exposed_render_context()
    {
        return canvasElement.getContext("2d");
    }

    const publicInterface = Object.freeze(
    {
        width: screenWidth,
        height: screenHeight,

        wipe_clean: function()
        {
            const renderContext = exposed_render_context();
            renderContext.fillStyle = "transparent";
            renderContext.fillRect(0, 0, screenWidth, screenHeight);
        },

        // Returns a copy of the ngons transformed into screen-space for this render surface.
        // Takes as input the ngons to be transformed, an object matrix which contains the object's
        // transforms, and a camera matrix, which contains the camera's translation and rotation.
        transformed_ngons: function(ngons = [], objectMatrix = [], cameraMatrix = [])
        {
            const objectSpaceMatrix = Rngon.matrix44.matrices_multiplied(cameraMatrix, objectMatrix);
            const clipSpaceMatrix = Rngon.matrix44.matrices_multiplied(perspectiveMatrix, objectSpaceMatrix);
            const screenSpaceMatrix = Rngon.matrix44.matrices_multiplied(screenMatrix, clipSpaceMatrix);

            return ngon_transform_f(ngons, screenSpaceMatrix);
        },

        // Draw the given ngons onto this render surface.
        draw_ngons: function(ngons = [])
        {
            const renderContext = exposed_render_context();
            const pixelBuffer = renderContext.getImageData(0, 0, screenWidth, screenHeight);

            ngon_fill_f(ngons, pixelBuffer.data, screenWidth, screenHeight);

            renderContext.putImageData(pixelBuffer, 0, 0);
        },
    });
    return publicInterface;
}
/*
 * Most recent known filename: js/rallysported.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

// Top-level namespace for RallySportED.
const Rsed = {};

// Various small utility functions and the like.
{
    // Defined 'true' to allow for the conveniency of named in-place assertions,
    // e.g. Rsed.assert && (x === 1) ||Rsed.throw("X wasn't 1.").
    // Note that setting this to 'false' won't disable assertions - for that,
    // you'll want to search/replace "Rsed.assert &&" with "Rsed.assert ||"
    // and keep this set to 'true'. The comparison against Rsed.assert may still
    // be done, though (I guess depending on the JS engine's ability to optimize).
    Object.defineProperty(Rsed, "assert", {value:true, writable:false});
    
    Rsed.throw = (errMessage = "")=>
    {
        Rsed.core.panic(errMessage);

        alert("RallySportED error: " + errMessage);
        throw new Error("RallySportED error: " + errMessage);
    }

    Rsed.alert = (message = "")=>
    {
        alert("RallySportED: " + message);
    }

    Rsed.log = (message = "")=>
    {
        console.log("RallySportED: " + message);
    }

    // Linear interpolation.
    Rsed.lerp = (x = 0, y = 0, interval = 0)=>(x + (interval * (y - x)));

    Rsed.clamp = (value = 0, min = 0, max = 1)=>Math.min(Math.max(value, min), max);
}
/*
 * Most recent known filename: js/project/manifesto.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

// Applies the given project's manifesto to the project's data.
// The manifesto is a set of commands that control certain parameters in RallySportED projects;
// like the positioning of certain track-side objects.
Rsed.apply_manifesto = function(targetProject)
{
    Rsed.assert && (!targetProject.isPlaceholder)
                || Rsed.throw("Can't apply manifestos to placeholder projects.");

    const commands = targetProject.manifesto.split("\n").filter(line=>line.trim().length);

    Rsed.assert && (commands.length >= 2)
                || Rsed.throw("Invalid number of lines in the manifesto.");

    Rsed.assert && (commands[0].startsWith("0 "))
                || Rsed.throw("Expected the manifesto to begin with the command 0, but it doesn't.");

    Rsed.assert && (commands[commands.length-1].startsWith("99"))
                || Rsed.throw("Expected the manifesto to end with the command 99, but it doesn't.");

    commands.forEach(command=>
    {
        apply_command(command);
    });

    return;

    function apply_command(commandLine)
    {
        const params = commandLine.split(" ");
        const command = Number(params.shift());

        eval("apply_" + command)(params);

        // Command: REQUIRE. Specifies which of the eight tracks in Rally-Sport's demo the project
        // is forked from.
        function apply_0(args = [])
        {
            Rsed.assert && (args.length === 3)
                        || Rsed.throw("Invalid number of arguments to manifesto command 0. Expected 4 but received " + args.length + ".");

            const trackId = Math.floor(Number(args[0]) - 1);
            const palatId = Math.floor(Number(args[1]));
            const minRSEDLoaderVersion = Number(args[2]);

            targetProject.set_track_id(trackId);
        }

        // Command: ROAD. Sets up the game's driving physics for various kinds of road surfaces.
        function apply_1(args = [])
        {
            Rsed.assert && (args.length === 1)
                        || Rsed.throw("Invalid number of arguments to manifesto command 1. Expected 1 but received " + args.length + ".");
        }

        // Command: NUM_OBJS. Sets the number of props (in addition to the starting line) on the track.
        function apply_2(args = [])
        {
            Rsed.assert && (args.length === 1)
                        || Rsed.throw("Invalid number of arguments to manifesto command 2. Expected 1 but received " + args.length + ".");

            const numObjs = Math.floor(Number(args[0]));

            targetProject.props.set_count(targetProject.track_id(), numObjs);
        }

        // Command: ADD_OBJ. Adds a new prop to the track.
        function apply_3(args = [])
        {
            Rsed.assert && (args.length === 5)
                        || Rsed.throw("Invalid number of arguments to manifesto command 3. Expected 5 but received " + args.length + ".");

            const propId = Math.floor(Number(args[0]) - 1);
            const posX = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
            const posZ = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

            targetProject.props.add_location(targetProject.track_id(),
                                             propId,
                                             {
                                                 x: posX,
                                                 z: posZ,
                                             });
        }

        // Command: CHANGE_OBJ_TYPE. Changes the type of the given prop.
        function apply_4(args = [])
        {
            Rsed.assert && (args.length === 2)
                        || Rsed.throw("Invalid number of arguments to manifesto command 4. Expected 2 but received " + args.length + ".");

            const targetPropIdx = Math.floor(Number(args[0]) - 1);
            const newPropId = Math.floor(Number(args[1]) - 1);

            targetProject.props.change_prop_type(targetProject.track_id(), targetPropIdx, newPropId);
        }

        // Command: MOVE_OBJ. Moves the position of the given prop.
        function apply_5(args = [])
        {
            Rsed.assert && (args.length === 5)
                        || Rsed.throw("Invalid number of arguments to manifesto command 5. Expected 5 but received " + args.length + ".");

            const targetPropIdx = Math.floor(Number(args[0]) - 1);
            const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
            const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));

            targetProject.props.set_prop_location(targetProject.track_id(), targetPropIdx, {x, z});
        }

        // Command: MOVE_STARTING_POS. Moves the starting line. Note that this doesn't move the
        // starting line prop, but the starting position of the player's car. So we can ignore
        // it in the editor.
        function apply_6(args = [])
        {
            Rsed.assert && (args.length === 4)
                        || Rsed.throw("Invalid number of arguments to manifesto command 6. Expected 4 but received " + args.length + ".");
        }

        // Command: CHANGE_PALETTE_ENTRY. Changes the given palette index to the given r,g,b values.
        function apply_10(args = [])
        {
            Rsed.assert && (args.length === 4)
                        || Rsed.throw("Invalid number of arguments to manifesto command 10. Expected 4 but received " + args.length + ".");

            const targetPaletteIdx = Math.floor(Number(args[0]));
            const r = Math.floor(Number(args[1] * 4));
            const g = Math.floor(Number(args[2] * 4));
            const b = Math.floor(Number(args[3] * 4));
            
            Rsed.palette.set_color(targetPaletteIdx, {r, g, b});
        }

        // Command: STOP. Stops parsing the manifesto file.
        function apply_99(args = [])
        {
            Rsed.assert && (args.length === 0)
                        || Rsed.throw("Invalid number of arguments to manifesto command 99. Expected no arguments but received " + args.length + ".");
        }
    }
};
/*
 * Most recent known filename: js/project/project.js
 *
 * 2018-2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// A RallySportED project is a collection of assets for a particular Rally-Sport track that
// the user can modify using RallySportED. Namely, the project consists of two files: the
// .DTA file (also called the "container"), and the .$FT file (also called the "manifesto").
// The .DTA file is a binary file containing the track's individual assets; like heightmap,
// tilemap, textures, etc. The .$FT file consists of an ASCII string providing commands
// to RallySportED on how to modify certain hard-coded track parameters in Rally-Sport for
// that particular track (e.g. the positioning of certain track-side objects, etc.).
Rsed.project = async function(projectArgs = {})
{
    // Which of the eight tracks in Rally-Sport's demo version this project is for.
    let trackId = null;

    // Load the project's data. After this, projectData.container is expected to hold the
    // contents of the .DTA file as a Base64-encoded string; and projectData.manifesto the
    // contents of the .$FT file as a plain string.
    const projectData = await fetch_project_data();

    Rsed.assert && ((typeof projectData.container !== "undefined") &&
                    (typeof projectData.manifesto !== "undefined") &&
                    (typeof projectData.meta !== "undefined") &&
                    (typeof projectData.meta.baseName !== "undefined") &&
                    (typeof projectData.meta.displayName !== "undefined"))
                || Rsed.throw("Missing required project data.");

    Rsed.assert && is_valid_project_base_name()
                || Rsed.throw("Invalid project base name \"" + projectData.meta.baseName + "\".");

    Rsed.assert && ((projectData.meta.width > 0) &&
                    (projectData.meta.height > 0) &&
                    (projectData.meta.width === projectData.meta.height))
                || Rsed.throw("Invalid track dimensions for a project.");

    // Provides the (Base64-decoded) data of the container file; and metadata about the file,
    // like the sizes and byte offsets of the individual asset data segments inside the file.
    // Note: The variable names here reflect the names of Rally-Sport's data files. For more
    // information, check out RallySportED's documentation on Rally-Sport's data formats at
    // https://github.com/leikareipa/rallysported/tree/master/docs.
    //
    // In brief,
    //
    //     maasto: track heightmap
    //     varimaa: track tilemap
    //     palat: track tile textures
    //     anims: animation frame textures
    //     text: track prop textures
    //
    const projectDataContainer = Object.freeze(
    {
        dataBuffer: (()=>
        {
            const containerDecoded = atob(projectData.container);
            const buffer = new ArrayBuffer(containerDecoded.length);
            const view = new Uint8Array(buffer);
    
            for (let i = 0; i < containerDecoded.length; i++)
            {
                view[i] = containerDecoded.charCodeAt(i);
            };
    
            return buffer;
        })(),

        byteSize: function()
        {
            const maasto = (new DataView(this.dataBuffer, 0, 4)).getUint32(0, true);
            const varimaa = (new DataView(this.dataBuffer, (maasto + 4), 4)).getUint32(0, true);
            const palat = (new DataView(this.dataBuffer, (maasto + varimaa + 8), 4)).getUint32(0, true);
            const anims = (new DataView(this.dataBuffer, (maasto + varimaa + palat + 12), 4)).getUint32(0, true);
            const text = (new DataView(this.dataBuffer, (maasto + varimaa + palat + anims + 16), 4)).getUint32(0, true);
            
            return Object.freeze({maasto, varimaa, palat, anims, text});
        },

        byteOffset: function()
        {
            const byteSize = this.byteSize();

            // The variable names here reflect the names of Rally-Sport's data files.
            const maasto = 4;
            const varimaa = (byteSize.maasto + 8);
            const palat = (byteSize.maasto + byteSize.varimaa + 12);
            const anims = (byteSize.maasto + byteSize.varimaa + byteSize.palat + 16);
            const text = (byteSize.maasto + byteSize.varimaa + byteSize.palat + byteSize.anims + 20);

            return Object.freeze({maasto, varimaa, palat, anims, text});
        },
    });

    // Pass relevant segments of the container's data into objects responsible for managing
    // the corresponding individual assets. Note that the data are passed by reference, so
    // modifications made by the objects to the data will be reflected in the container.
    const maasto = Rsed.track.maasto(projectData.meta.width, projectData.meta.height,
                                     new Uint8Array(projectDataContainer.dataBuffer,
                                                    projectDataContainer.byteOffset().maasto,
                                                    projectDataContainer.byteSize().maasto));

    const varimaa = Rsed.track.varimaa(projectData.meta.width, projectData.meta.height,
                                       new Uint8Array(projectDataContainer.dataBuffer,
                                                      projectDataContainer.byteOffset().varimaa,
                                                      projectDataContainer.byteSize().varimaa));

    const palat = Rsed.track.palat(Rsed.constants.palaWidth, Rsed.constants.palaHeight,
                                   new Uint8Array(projectDataContainer.dataBuffer,
                                                  projectDataContainer.byteOffset().palat,
                                                  projectDataContainer.byteSize().palat));

    const props = await Rsed.track.props(new Uint8Array(projectDataContainer.dataBuffer,
                                                        projectDataContainer.byteOffset().text,
                                                        projectDataContainer.byteSize().text));

    const manifesto = projectData.manifesto;

    const publicInterface = Object.freeze(
    {
        name: projectData.meta.displayName,
        maasto,
        varimaa,
        palat,
        props,
        manifesto,

        track_id: ()=>
        {
            Rsed.assert && (trackId !== null)
                        || Rsed.throw("Attempting to access a project's track id before it has been set.");

            return trackId;
        },

        set_track_id: (id)=>
        {
            Rsed.assert && ((id >= 0) &&
                            (id <= 7))
                        || Rsed.throw("Track id out of bounds.");

            trackId = id;
        },

        // Bundles the project's data files into a .zip, and has the browser initiate a 'download' of it.
        save_to_disk: ()=>
        {
            const filename = projectData.meta.baseName.toUpperCase();

            Rsed.log("Saving project \"" + projectData.meta.displayName + "\" into " +
                      filename + ".ZIP.");

            const zip = new JSZip();

            zip.file(filename + "/" + filename + ".DTA", projectDataContainer.dataBuffer);
            zip.file(filename + "/" + filename + ".$FT", updated_manifesto_string());
            zip.file(filename + "/" + "HITABLE.TXT", Rsed.project.hitable);

            zip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:2}})
            .then((blob)=>saveAs(blob, (filename + ".ZIP")))
            .catch((error)=>Rsed.throw("Error while saving: " + error + "."));
        }
    });

    Rsed.log("\"" + projectData.meta.displayName + "\" is a valid RallySportED project. " +
              "Its base name is \"" + projectData.meta.baseName + "\".");
    
    return publicInterface;

    // Returns an updated version of the project's manifesto string, reflecting the project's
    // current status - e.g. positions of track props, which may have been moved by the user
    // since the project was loaded in. The original manifesto string is not changed.
    function updated_manifesto_string()
    {
        const manifesto = projectData.manifesto.split("\n").filter(line=>line.trim().length);
        let updatedManifesto = "";

        // Any manifesto commands we won't update will be copied verbatim into the updated
        // version.
        for (let i = 0; i < (manifesto.length - 1); i++)
        {
            const command = manifesto[i].split(" ").shift();

            switch (command)
            {
                // These are the commands we want to update, so we don't copy them.
                case 2:
                case 4:
                case 5: break;

                // These are the commands we won't update, so we just copy then.
                default: updatedManifesto += (manifesto[i] + "\n");
            }
        }

        // Update the various commands according to the current values of their related data.
        {
            const trackProps = props.locations_of_props_on_track(trackId);

            // Command #2 for the number of props.
            {
                updatedManifesto += ("2 " + trackProps.length + "\n");
            }
            
            // Command #5 to set props' locations on the track (except for the finish line, which
            // we assume is the first prop on the list).
            {
                for (let i = 1; i < trackProps.length; i++)
                {
                    const globalX = Math.floor((trackProps[i].x / Rsed.constants.groundTileSize) / 2);
                    const globalZ = Math.floor((trackProps[i].z / Rsed.constants.groundTileSize) / 2);

                    const localX = Math.floor((((trackProps[i].x / Rsed.constants.groundTileSize) / 2) - globalX) * 256);
                    const localZ = Math.floor((((trackProps[i].z / Rsed.constants.groundTileSize) / 2) - globalZ) * 256);

                    updatedManifesto += ("5 " + (i + 1) + " " + globalX + " " + globalZ + " " + localX + " " + localZ + "\n");
                }
            }

            // Command #4 to set props' types.
            {
                for (let i = 1; i < trackProps.length; i++)
                {
                    updatedManifesto += ("4 " + (i + 1) + " " + (trackProps[i].propId + 1) + "\n");
                }
            }
        }

        updatedManifesto += "99\n";

        return updatedManifesto;
    }

    // Returns true if the project's base name is valid; false otherwise. The base name is the name
    // with which the project's files will be saved to disk; e.g. if the base name is "test", the
    // project's files will be "test.dta" and "test.$ft". Note that the base name is separate from
    // the project's display name, which is the name shown to the user in RallySportED's UI. The
    // display name may be different from the base name, and has no restrictions on its composition
    // like the base name does.
    function is_valid_project_base_name()
    {
        // The base filename must be between 1 and 8 characters long, and the string must consist
        // of ASCII A-Z characters only.
        return ((typeof projectData.meta !== "undefined") &&
                (typeof projectData.meta.baseName !== "undefined") &&
                (projectData.meta.baseName.length >= 1) &&
                (projectData.meta.baseName.length <= 8) &&
                /^[a-z]+$/.test(projectData.meta.baseName));
    }

    // Returns the data (container file, manifesto file, and certain metadata) of the
    // given project as an object formatted like so:
    //
    //    {
    //        container: "the contents of the project's binary container file as a Base64-encoded string",
    //        manifesto: "the contents of the prjoect's textual manifesto file as a string",
    //        meta: 
    //        {
    //            // Metadata about the project; like its name, and the dimensions of its track.
    //        }
    //    }
    //
    async function fetch_project_data()
    {
        Rsed.assert && ((typeof projectArgs.dataLocality !== "undefined") &&
                        (typeof projectArgs.dataIdentifier !== "undefined"))
                    || Rsed.throw("Missing required parameters for loading a project.");

        const projectData = (projectArgs.dataLocality === "server")? await fetch_project_data_from_server() :
                            (projectArgs.dataLocality === "client")? await fetch_project_data_from_local_zip_file() :
                            Rsed.throw("Unknown locality for project data.");

        return projectData;

        async function fetch_project_data_from_local_zip_file()
        {
            Rsed.assert && (typeof projectArgs.dataIdentifier !== "undefined")
                        || Rsed.throw("Missing required parameters for loading a project from a zip file.");

            const zip = await (new JSZip()).loadAsync(projectArgs.dataIdentifier);

            // The zip file is expected to contain a project's .DTA and .$FT (manifesto) files.
            let manifestoFile = null;
            let dtaFile = null;

            let projectDirName = "undefined";

            // Parse the zip file's contents to extract the project's data. The data are expected as
            // .DTA and .$FT files inside a folder named according to the name of the project (the
            // folder name must be ASCII A-Z only and with a maximum of eight characters, to maintain
            // compatibility with the DOS version of RallySportED).
            {
                const files = [];
                const dirs = [];

                // Compile a list of files and directories in side the zip file.
                zip.forEach((path, entry)=>
                {
                    if (entry.dir)
                    {
                        dirs.push(entry);
                    }
                    else files.push(entry);
                });

                Rsed.assert && (dirs.length === 1)
                            || Rsed.throw("A project zip file must contain exactly one directory, under which the project's " +
                                            ".DTA and .$FT files are found.");

                projectDirName = dirs[0].name.slice(0, -1).toLowerCase();

                // Find the project's $FT and DTA files inside the zip file.
                {
                    files.forEach(file=>
                    {
                        if (manifestoFile && dtaFile)
                        {
                            return;
                        }

                        const fileSuffix = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
                        const fileBasePath = file.name.slice(0, file.name.lastIndexOf(".")).toLowerCase();
                        const fileBaseName = fileBasePath.slice(fileBasePath.lastIndexOf("/") + 1);

                        // Each resource file is expected to hold the same name as the project itself.
                        if (fileBaseName !== projectDirName)
                        {
                            return;
                        }

                        switch (fileSuffix)
                        {
                            case "$ft": manifestoFile = file; break;
                            case "dta": dtaFile = file; break;
                            default: break;
                        }
                    });

                    Rsed.assert && (manifestoFile && dtaFile)
                                || Rsed.throw("The given project zip file was missing the required .DTA and/or .$FT files.")
                }
            }
            
            // Create an object containing the project's data.
            const projectData = {};
            {
                projectData.manifesto = await manifestoFile.async("string");
                projectData.container = await dtaFile.async("arraybuffer");

                // Derive the track's dimensions from the size of the heightmap. (All tracks are assumed
                // square).
                const trackSideLen = Math.sqrt(new Uint32Array(projectData.container, 0, 1)[0] / 2);

                // All tracks in the demo version of Rally-Sport are expected to have either 64 or 128
                // tiles per side.
                Rsed.assert && ([64, 128].includes(trackSideLen))
                            || Rsed.throw("Invalid track dimensions in project file.");

                projectData.meta =
                {
                    displayName: projectDirName,
                    baseName: projectDirName,
                    width: trackSideLen,
                    height: trackSideLen,
                };

                // Encode the .DTA data as Base64.
                const view = new Uint8Array(projectData.container);
                const string = view.reduce((data, byte)=>(data + String.fromCharCode(byte)), "");
                projectData.container = btoa(string);
            }

            return projectData;
        }

        async function fetch_project_data_from_server()
        {
            Rsed.assert && (typeof projectArgs.dataIdentifier !== "undefined")
                        || Rsed.throw("Missing required parameters for loading a project.");

            return fetch("server/get-project-data.php?projectId=" + projectArgs.dataIdentifier)
                   .then(response=>
                   {
                       if (!response.ok)
                       {
                           throw "A GET request to the server failed.";
                       }
    
                       return response.json();
                   })
                   .then(ticket=>
                   {
                       if (!ticket.valid || (typeof ticket.data === "undefined"))
                       {
                           throw ("The server sent a GET ticket marked invalid. It said: " + ticket.message);
                       }
    
                       return JSON.parse(ticket.data);
                   })
                   .catch(error=>{ Rsed.throw(error); });
        }
    }
}

// An empty project that lets the renderer etc. spin.
Rsed.project.placeholder =
{
    isPlaceholder: true,
    name: "",
    manifesto: "",
    set_track_id: ()=>{Rsed.throw("Can't set the track id of a null project.");},
    varimaa:
    {
        width: 0,
        height: 0,
        tile_at:()=>0,
        set_tile_value_at:()=>{},
    },
    maasto:
    {
        width: 0,
        height: 0,
        tile_at: ()=>0,
        set_tile_value_at: ()=>{},
    },
    palat:
    {
        texture:()=>{},
    },
    props:
    {
        name: ()=>("undefined"),
        mesh: ()=>{},
        texture: ()=>{},
    },
};

// The contents of Rally-Sport's default HITABLE.TXT file. We'll dump it into a file together
// with the rest of the project's data when the project is saved to disk.
Rsed.project.hitable = [0x41,0x2d,0x4a,0x75,0x6e,0x69,0x6f,0x72,0x69,0x00,0x20,0x20,
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
 * Most recent known filename: js/constants.js
 *
 * Tarpeeksi Hyvae Soft 2019 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.constants = Object.freeze(
{
    // The resolution of a PALA texture.
    palaWidth: 16,
    palaHeight: 16,

    // For rendering; the side length, in world units, of a single ground tile.
    groundTileSize: 128,

    // The margins, in number of tiles, on the sides of the track past which the user is
    // not allowed to move props (so that they don't accidentally get moved out of reach,
    // etc.).
    propTileMargin: 2,

    // The maximum number of props on a track.
    maxPropCount: 14,

    // How many hard-coded palettes there are in Rally-Sport's demo version.
    numPalettes: 4,

    // How many colors there are in one of Rally-Sport's hard-coded palettes.
    paletteSize: 32,
});
/*
 * Most recent known filename: js/misc/shared-mode.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 * Implements client-side communication with RallySportED-js's shared-mode server.
 * 
 * The central function is server_io(), which orchestrates the communication.
 * But before communication can take place, register_as_participant() should be
 * called to establish ourselves as a participant on the server.
 *
 */

"use strict";

Rsed.shared_mode_n = (function()
{
    // A string that uniquely identifies us as a participant in the shared editing. We'll
    // need to provide this id any time we GET or POST data to the server.
    let participantId = null;

    // The number of milliseconds to wait between polling the server with/for data.
    const serverPollingInterval = 6000;

    // POSTs our most recent edits to the server for other participants to see. Will throw
    // on errors.
    function send_local_caches_to_server(localCaches = {})
    {
        localCaches =
        {
            ...{
                maasto:[],
                varimaa:[]
            },
            ...localCaches
        }

        function cacheToDataArray(cache)
        {
            return ((dataArray = [])=>{ cache.forEach((v, idx)=>{ if (v != null) dataArray.push(idx, v); }); return dataArray; })();
        };
        
        const postData =
        {
            participantId,
            maasto: cacheToDataArray(localCaches["maasto"]),
            varimaa: cacheToDataArray(localCaches["varimaa"]),
        };

        return fetch(("server/shared-editing/post.php?projectName=" + Rsed.core.current_project().name +
                                                    "&participantId=" + participantId),
                {
                    method: "POST",
                    cache: "no-store",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postData)
                })
                .then(response=>
                {
                    if (!response.ok)
                    {
                        throw "A POST request to the server failed.";
                    }
    
                    return response.json();
                })
                .then(ticket=>
                {
                    if (!ticket.valid ||
                        (typeof ticket.data === "undefined"))
                    {
                        throw ("The server sent a POST ticket marked invalid. It said: " + ticket.message);
                    }

                    return ticket.data;
                })
                .catch(error=>{ Rsed.throw(error); });
    }

    // Takes in an object holding edit data we've received from the server made by other
    // participants, and applies those data to our local data (like our MAASTO heightmap
    // and VARIMAA tilemap).
    function apply_server_data_to_local_data(serverData)
    {
        if (!serverData) return;

        const resources =
        {
            "maasto": Rsed.core.current_project().maasto.set_tile_value_at,
            "varimaa": Rsed.core.current_project().varimaa.set_tile_value_at,
        };

        for (const [resourceName, dataCallback] of Object.entries(resources))
        {
            if (Array.isArray(serverData[resourceName]))
            {
                for (let i = 0; i < serverData[resourceName].length; i += 2)
                {
                    dataCallback(...idx_to_xy(serverData[resourceName][i]), serverData[resourceName][i+1]);
                }
            }
        }

        // Converts a 1d array index into a 2d x,y coordinate pair.
        function idx_to_xy(idx)
        {
            return [(idx % Rsed.core.current_project().maasto.width),
                    Math.floor(idx / Rsed.core.current_project().maasto.width)];
        }
    }

    // Sends the server a POST request containing the local edits we've made since the last
    // time we contacted the server in this manner. Will receive back from the server any
    // edits made by the other participants in the shared editing.
    async function server_io(participantId = "")
    {
        if (!publicInterface.enabled()) return;

        if (Rsed.ui_input_n.are_editing_keys_pressed())
        {
            setTimeout(poll_server, 500);
            return;
        }

        const newServerData = await send_local_caches_to_server({
            maasto: Rsed.ui_brush_n.flush_brush_cache("maasto"),
            varimaa: Rsed.ui_brush_n.flush_brush_cache("varimaa")
        });

        apply_server_data_to_local_data(newServerData);

        // Loop.
        setTimeout(poll_server, serverPollingInterval);

        function poll_server() { server_io(participantId); };
    }

    const publicInterface = {};
    {
        // Returns null if shared mode is disabled; our participant id otherwise (which will be a
        // truthy value).
        publicInterface.enabled = function() { return participantId; };

        // Start two-way communication with the shared-mode server.
        publicInterface.start_polling_server = function()
        {
            Rsed.assert && (publicInterface.enabled())
                        || Rsed.throw("Was asked to start polling the shared-mode server before having registered as a participant in it.");

            server_io(participantId);

            return;
        }

        // Asks the server to register us as a participant in the shared editing. Being a participant
        // means we can have our edits broadcast to the server and to receive edits from the server made
        // by other participants. If an error occurs while registering, the client side will be terminated.
        publicInterface.register_as_participant_in_project = function(projectName = "")
        {
            // If we were already registered as a participant, unregister that previous registration, first.
            if (publicInterface.enabled()) publicInterface.unregister_current_registration();

            return fetch(("server/shared-editing/register.php?projectName=" + projectName), {cache: "no-store"})
                    .then(response=>
                    {
                        if (!response.ok)
                        {
                            throw "A POST request to the server failed.";
                        }

                        return response.json();
                    })
                    .then(ticket=>
                    {
                        if (!ticket.valid || (typeof ticket.participantId === "undefined"))
                        {
                            throw "Failed to register as a new participant in the shared editing.";
                        }

                        participantId = ticket.participantId;
                    })
                    .catch(error=>{ Rsed.throw("Error while registering as a participant in shared editing: " + error); });
        };

        // Tell the server that we no longer want to participate in the shared editing. Our edits
        // will no longer be broadcast to the server, and we don't receive other participants'
        // edits from the server.
        publicInterface.unregister_current_registration = function()
        {
            participantId = null;

            /// TODO. Maybe flush the latest local changes to the server, etc.
        }
    };
    return publicInterface;
})();
/*
 * Most recent known filename: js/misc/world-builder.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

// Provides functions returning renderable 3d meshes of various world items - like the track and
// its props - accounting for user-specified arguments such as camera position.
Rsed.worldBuilder = function()
{
    const publicInterface =
    {
        // Returns a renderable 3d mesh of the current project's track from the given viewing position
        // (in tile units). The mesh will be assigned such world coordinates that it'll be located
        // roughly in the middle of the canvas when rendered.
        track_mesh: function(viewPos = {x:0,y:0,z:0})
        {
            // The polygons that make up the track mesh.
            const trackPolygons = [];

            const isTopdownView = (Rsed.ui_view_n.current_view() === "3d-topdown");

            // We'll shift the track mesh by these values (world units) to center the mesh on screen.
            const centerView = {x: (isTopdownView? -1152 : -1088),
                                y: (isTopdownView? -1800 : -680),
                                z: (isTopdownView? 700 : 2612)};

            // Add the ground tiles.
            for (let z = 0; z < Rsed.camera_n.view_height(); z++)
            {
                for (let x = 0; x < Rsed.camera_n.view_width(); x++)
                {
                    // Coordinates of the current ground tile.
                    const tileX = (x + viewPos.x);
                    const tileZ = (z + viewPos.z);

                    // Coordinates in world units of the ground tile's top left vertex.
                    const vertX = ((x * Rsed.constants.groundTileSize) + centerView.x);
                    const vertZ = (centerView.z - (z * Rsed.constants.groundTileSize));

                    const tilePalaIdx = (()=>
                    {
                        let idx = Rsed.core.current_project().varimaa.tile_at(tileX, (tileZ - 1));

                        // If the mouse cursor is hovering over this tile, mark it with the brush's PALA.
                        if ((tileX === Rsed.ui_input_n.mouse_tile_hover_x()) &&
                            ((tileZ - 1) === Rsed.ui_input_n.mouse_tile_hover_y()))
                        {
                            idx = Rsed.ui_brush_n.brush_pala_idx();
                        }

                        return idx;
                    })();

                    // Construct the ground quad polygon.
                    {
                        // The heights of the ground quad's corner points.
                        const height1 = centerView.y + Rsed.core.current_project().maasto.tile_at( tileX,       tileZ);
                        const height2 = centerView.y + Rsed.core.current_project().maasto.tile_at((tileX + 1),  tileZ);
                        const height3 = centerView.y + Rsed.core.current_project().maasto.tile_at((tileX + 1), (tileZ - 1));
                        const height4 = centerView.y + Rsed.core.current_project().maasto.tile_at( tileX,      (tileZ - 1));

                        const groundQuad = Rngon.ngon([Rngon.vertex( vertX, height1, vertZ, 0, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), height2, vertZ, 1, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), height3, (vertZ + Rsed.constants.groundTileSize), 1, 1),
                                                       Rngon.vertex( vertX, height4, (vertZ + Rsed.constants.groundTileSize), 0, 1)],
                                                    {
                                                        color: Rngon.color_rgba(255, 255, 255),
                                                        texture: Rsed.core.current_project().palat.texture[tilePalaIdx],
                                                        textureMapping: "ortho",
                                                        hasSolidFill: true,
                                                        hasWireframe: Rsed.ui_view_n.show3dWireframe,
                                                    });
                        
                        // We'll encode this ground quad's tile coordinates into a 32-bit id value, which during
                        // rasterization we'll write into the mouse-picking buffer, so we can later determine which
                        // quad the mouse cursor is hovering over.
                      // groundQuad.mousePickId = Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ground,
                      //                                                                   {tileX, tileZ: (tileZ - 1)});

                        trackPolygons.push(groundQuad);
                    }

                    // If this tile has a billboard, add that too.
                    if (tilePalaIdx > 239 && tilePalaIdx < 248)
                    {
                        const baseHeight = centerView.y + Rsed.core.current_project().maasto.tile_at(tileX, (tileZ - 1));

                        const texture = (()=>
                        {
                            switch (tilePalaIdx)
                            {
                                // Spectators.
                                case 240:
                                case 241:
                                case 242: return Rsed.core.current_project().palat.generate_texture(spectator_texture_at(tileX, (tileZ - 1)), {alpha:true});
                                break;
            
                                // Shrubs.
                                case 243: return Rsed.core.current_project().palat.generate_texture(208, {alpha:true});
                                case 244: return Rsed.core.current_project().palat.generate_texture(209, {alpha:true});
                                case 245: return Rsed.core.current_project().palat.generate_texture(210, {alpha:true});
            
                                // Small poles.
                                case 246:
                                case 247: return Rsed.core.current_project().palat.generate_texture(211, {alpha:true});
                                case 250: return Rsed.core.current_project().palat.generate_texture(212, {alpha:true});
            
                                default: Rsed.throw("Unrecognized billboard texture."); return null;
                            }
                        })();

                        const billboardQuad = Rngon.ngon([Rngon.vertex( vertX, baseHeight, vertZ, 0, 0),
                                                          Rngon.vertex((vertX + Rsed.constants.groundTileSize), baseHeight, vertZ, 1, 0),
                                                          Rngon.vertex((vertX + Rsed.constants.groundTileSize), baseHeight+Rsed.constants.groundTileSize, vertZ, 1, 1),
                                                          Rngon.vertex( vertX, baseHeight+Rsed.constants.groundTileSize, vertZ, 0, 1)],
                                                          {
                                                              color: Rngon.color_rgba(255, 255, 255),
                                                              texture: texture,
                                                              textureMapping: "ortho",
                                                              hasSolidFill: true,
                                                              hasWireframe: false,
                                                          });

                        trackPolygons.push(billboardQuad);
                    }
                    // If the tile has a bridge, add that.
                    else if (tilePalaIdx === 248 || tilePalaIdx === 249)
                    {
                        const bridgeQuad = Rngon.ngon([Rngon.vertex( vertX,  centerView.y, vertZ, 0, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), centerView.y, vertZ, 1, 0),
                                                       Rngon.vertex((vertX + Rsed.constants.groundTileSize), centerView.y, (vertZ+Rsed.constants.groundTileSize), 1, 1),
                                                       Rngon.vertex( vertX, centerView.y, (vertZ+Rsed.constants.groundTileSize), 0, 1)],
                                                       {
                                                           color: Rngon.color_rgba(255, 255, 255),
                                                           texture: Rsed.core.current_project().palat.generate_texture(177, {alpha:true}),
                                                           textureMapping: "ortho",
                                                           hasSolidFill: true,
                                                           hasWireframe: false,
                                                       });

                        trackPolygons.push(bridgeQuad);
                    }
                }
            }

            // Add any track prop meshes that should be visible on the currently-drawn track.
            const propLocations = Rsed.core.current_project().props.locations_of_props_on_track(Rsed.core.current_project().track_id());
            propLocations.forEach((pos, idx)=>
            {
                if ((pos.x >= (Rsed.camera_n.pos_x() * Rsed.constants.groundTileSize)) &&
                    (pos.x <= ((Rsed.camera_n.pos_x() + Rsed.camera_n.view_width()) * Rsed.constants.groundTileSize)) &&
                    (pos.z >= (Rsed.camera_n.pos_z() * Rsed.constants.groundTileSize)) &&
                    (pos.z <= ((Rsed.camera_n.pos_z() + Rsed.camera_n.view_height()) * Rsed.constants.groundTileSize)))
                {
                    const x = (pos.x + centerView.x - (viewPos.x * Rsed.constants.groundTileSize));
                    const z = (centerView.z - pos.z + (viewPos.z * Rsed.constants.groundTileSize));
                    const groundHeight = centerView.y + Rsed.core.current_project().maasto.tile_at((pos.x / Rsed.constants.groundTileSize), (pos.z / Rsed.constants.groundTileSize));
                    const y = (groundHeight + pos.y);

                    trackPolygons.push(...this.prop_mesh(pos.propId, idx, {x, y, z}, {wireframe: Rsed.ui_view_n.show3dWireframe}));
                }
            });

            return Rngon.mesh(trackPolygons);
        },

        // Returns a renderable 3d mesh of the given prop at the given position (in world units).
        prop_mesh: (propId = 0, idxOnTrack = 0, pos = {x:0,y:0,z:0}, args = {})=>
        {
            args =
            {
                ...
                {
                    // Whether the renderer should draw a wireframe around this mesh.
                    wireframe: false,
                },
                ...args
            };

            const srcMesh = Rsed.core.current_project().props.mesh[propId];
            const dstMesh = [];

            srcMesh.ngons.forEach(ngon=>
            {
                const propNgon = Rngon.ngon(ngon.vertices.map(v=>Rngon.vertex((v.x + pos.x), (v.y + pos.y), (v.z + pos.z))),
                                            {
                                                color: (ngon.fill.type === "texture"? Rsed.palette.color(0) : Rsed.palette.color(ngon.fill.idx)),
                                                texture: (ngon.fill.type === "texture"? Rsed.core.current_project().props.texture[ngon.fill.idx] : null),
                                                textureMapping: "ortho",
                                                hasSolidFill: true,
                                                hasWireframe: args.wireframe,
                                            });

               // newPoly.mousePickId = Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.prop,
              //                                                                {
               //                                                                   propIdx: propId,
                //                                                                  propTrackId: idxOnTrack
                //                                                              });

                dstMesh.push(propNgon);
            });

            return dstMesh;
        },
    };

    return publicInterface;

    // The game by default has four different 'skins' for spectators, and it decides which skin a
    // spectator will be given based on the spectator's x,y coordinates on the track. This will
    // return the correct skin for the given coordinates.
    function spectator_texture_at(tileX = 0, tileY = 0)
    {
        const firstSpectatorTexIdx = 236; // Index of the first PALA representing a (standing) spectator. Assumes consecutive arrangement.
        const numSkins = 4;
        const sameRows = ((Rsed.core.current_project().maasto.width === 128)? 16 : 32); // The game will repeat the same pattern of variants on the x axis this many times.

        const yOffs = (Math.floor(tileY / sameRows)) % numSkins;
        const texOffs = ((tileX + (numSkins - 1)) + (yOffs * (numSkins - 1))) % numSkins;

        const palaId = (firstSpectatorTexIdx + texOffs);

        return palaId;
    }
};
/*
 * Most recent known filename: js/render/camera.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.camera_n = (function()
{
    // The camera's position, in tile units.
    const position = {x:0, y:0, z:0};

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
                if (position.x > (Rsed.core.current_project().maasto.width - this.view_width())) position.x = (Rsed.core.current_project().maasto.width - this.view_width());
                if (position.z > (Rsed.core.current_project().maasto.width - this.view_height()+1)) position.z = (Rsed.core.current_project().maasto.width - this.view_height()+1);
            }
        }

        publicInterface.rotate_camera = function(rotX, rotY, rotZ)
        {
            Rsed.throw("This function has not yet been prepared for use.");
        }

        publicInterface.pos_x = function() { return position.x; }
        publicInterface.pos_y = function() { return position.y; }
        publicInterface.pos_z = function() { return position.z; }

        publicInterface.movement_speed = function() { return moveSpeed; }

        // How many tiles horizontally and vertically should be visible on screen with this camera.
        publicInterface.view_width = function() { return 17; }
        publicInterface.view_height = function() { return 17; }
    }

    publicInterface.reset_camera_position();

    return publicInterface;
})();/*
 * Most recent known filename: js/texture.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.texture = function(args = {})
{
    args =
    {
        ...
        {
            // Pixel RGB values, each element being {r,g,b} (value range 0-255).
            pixels: [],

            // Each pixel's corresponding palette index.
            indices: [], 

            // The texture's dimensions.
            width: 0,
            height: 0,

            // Whether pixels with palette index 0 should be see-through. This is a hint to
            // the renderer, which may or may not comply.
            alpha: false,

            // Whether to flip (mirror) the texture's pixels.
            flipped: "no", // | "vertical"
        },
        ...args
    };

    Rsed.assert && ((args.width > 0) &&
                    (args.height > 0) &&
                    (args.pixels.length) &&
                    (args.indices.length))
                || Rsed.throw("Expected non-empty texture data.");

    Rsed.assert && ((args.indices.length === (args.width * args.height)) &&
                    (args.pixels.length === (args.width * args.height)) &&
                    (args.indices.length === args.pixels.length))
                || Rsed.throw("Mismatch between size of texture data and its resolution.");

    switch (args.flipped)
    {
        case "no": break;
        case "vertical":
        {
            for (let y = 0; y < args.height/2; y++)
            {
                // Swap horizontal rows vertically.
                for (let x = 0; x < args.width; x++)
                {
                    const idxTop = (x + y * args.width);
                    const idxBottom = (x + (args.height - y - 1) * args.width);

                    [args.pixels[idxTop], args.pixels[idxBottom]] = [args.pixels[idxBottom], args.pixels[idxTop]];
                    [args.indices[idxTop], args.indices[idxBottom]] = [args.indices[idxBottom], args.indices[idxTop]];
                }
            }

            break;
        }
        default: Rsed.throw("Unknown texture-flipping mode."); break;
    }

    // Note: The elements of the 'pixels' array are returned by reference (they're objects of the
    // form {r,g,b}). This is done to allow textures to be pre-generated and still have their colors
    // reflect any changes to the global palette without requiring a re-generation.
    const publicInterface = Object.freeze(
    {
        width: args.width,
        height: args.height,
        alpha: args.alpha,
        flipped: args.flipped,
        pixels: Object.freeze(Array.from(args.pixels)),
        indices: Object.freeze(Array.from(args.indices)),

        // Returns an unfrozen 4-element array containing copies of the texture's RGBA values at the
        // given x,y texel coordinates. Implemented to interface with the retro n-gon renderer.
        rgba_channels_at: function(x, y)
        {
            x = Math.floor(x);
            y = Math.floor(y);

            const idx = (x + y * this.width);

            Rsed.assert && (idx <= args.pixels.length)
                        || Rsed.throw("Attempting to access a texture pixel out of bounds (at "+x+","+y+").");

            return [this.pixels[idx].red,
                    this.pixels[idx].green,
                    this.pixels[idx].blue,
                    ((this.alpha && (this.indices[idx] === 0))? 0 : 255)];
        }
    });

    return publicInterface;
}
/*
 * Most recent known filename: js/visual/palette.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.palette = (function()
{
    // The four hard-coded palettes in Rally-Sport's demo. These should not be changed
    // during run-time.
    const rallySportPalettes = [
        // Palette #1.
        [{red:0, green:0, blue:0},
        {red:8, green:64, blue:16},
        {red:16, green:96, blue:36},
        {red:24, green:128, blue:48},
        {red:252, green:0, blue:0},
        {red:252, green:252, blue:252},
        {red:192, green:192, blue:192},
        {red:128, green:128, blue:128},
        {red:64, green:64, blue:64},
        {red:0, green:0, blue:252},
        {red:72, green:128, blue:252},
        {red:208, green:100, blue:252},
        {red:208, green:72, blue:44},
        {red:252, green:112, blue:76},
        {red:16, green:96, blue:32},
        {red:32, green:192, blue:64},
        {red:228, green:56, blue:244},
        {red:132, green:36, blue:172},
        {red:68, green:92, blue:252},
        {red:252, green:252, blue:48},
        {red:32, green:32, blue:32},
        {red:152, green:48, blue:24},
        {red:80, green:24, blue:12},
        {red:124, green:124, blue:24},
        {red:128, green:0, blue:0},
        {red:12, green:20, blue:132},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:136, green:28, blue:128},
        {red:16, green:252, blue:8}],

        // Palette #2.
        [{red:0, green:0, blue:0},
        {red:80, green:88, blue:104},
        {red:96, green:104, blue:120},
        {red:112, green:128, blue:144},
        {red:252, green:0, blue:0},
        {red:252, green:252, blue:252},
        {red:192, green:192, blue:192},
        {red:128, green:128, blue:128},
        {red:64, green:64, blue:64},
        {red:0, green:0, blue:252},
        {red:72, green:128, blue:252},
        {red:208, green:100, blue:252},
        {red:208, green:72, blue:44},
        {red:252, green:112, blue:76},
        {red:8, green:136, blue:16},
        {red:32, green:192, blue:64},
        {red:228, green:56, blue:244},
        {red:132, green:36, blue:172},
        {red:68, green:92, blue:252},
        {red:252, green:252, blue:48},
        {red:32, green:32, blue:32},
        {red:152, green:48, blue:24},
        {red:80, green:24, blue:12},
        {red:124, green:124, blue:24},
        {red:128, green:0, blue:0},
        {red:12, green:20, blue:132},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:136, green:28, blue:128},
        {red:16, green:252, blue:8}],

        // Palette #3.
        [{red:0, green:0, blue:0},
        {red:72, green:20, blue:12},
        {red:144, green:44, blue:20},
        {red:168, green:56, blue:28},
        {red:252, green:0, blue:0},
        {red:252, green:252, blue:252},
        {red:192, green:192, blue:192},
        {red:128, green:128, blue:128},
        {red:64, green:64, blue:64},
        {red:0, green:0, blue:252},
        {red:72, green:128, blue:252},
        {red:208, green:100, blue:252},
        {red:208, green:72, blue:44},
        {red:252, green:112, blue:76},
        {red:16, green:96, blue:32},
        {red:32, green:192, blue:64},
        {red:228, green:56, blue:244},
        {red:132, green:36, blue:172},
        {red:68, green:92, blue:252},
        {red:252, green:252, blue:48},
        {red:32, green:32, blue:32},
        {red:152, green:48, blue:24},
        {red:80, green:24, blue:12},
        {red:124, green:124, blue:24},
        {red:128, green:0, blue:0},
        {red:12, green:20, blue:132},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:136, green:28, blue:128},
        {red:16, green:252, blue:8}],

        // Palette #4.
        [{red:0, green:0, blue:0},
        {red:28, green:52, blue:8},
        {red:64, green:64, blue:16},
        {red:80, green:84, blue:28},
        {red:252, green:0, blue:0},
        {red:252, green:252, blue:252},
        {red:192, green:192, blue:192},
        {red:128, green:128, blue:128},
        {red:64, green:64, blue:64},
        {red:0, green:0, blue:252},
        {red:72, green:128, blue:252},
        {red:208, green:100, blue:252},
        {red:208, green:72, blue:44},
        {red:252, green:112, blue:76},
        {red:32, green:64, blue:32},
        {red:64, green:128, blue:64},
        {red:228, green:56, blue:244},
        {red:132, green:36, blue:172},
        {red:68, green:92, blue:252},
        {red:252, green:252, blue:48},
        {red:32, green:32, blue:32},
        {red:152, green:48, blue:24},
        {red:80, green:24, blue:12},
        {red:124, green:124, blue:24},
        {red:128, green:0, blue:0},
        {red:12, green:20, blue:132},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:252, green:252, blue:252},
        {red:136, green:28, blue:128},
        {red:16, green:252, blue:8}]
    ];

    // The palette we'll operate on; which is to say, when the user requests us to return a
    // color for a particular palette index, or to change the color at a particular index,
    // this is the palette we'll use. Generally, this palette will contain a modifiable
    // copy of one of Rally-Sport's hard-coded palettes.
    const activePalette = (new Array(256)).fill().map(e=>({red:127,green:127,blue:127,alpha:255,unitRange:{red:1, green:1, blue:1, alpha:1}}));

    const publicInterface =
    {
        // Return the color at the given index in the palette. Optionally, the index may be
        // a string identifying one of the pre-set UI colors (which are otherwise the same as
        // regular colors, but guaranteed to remain constant even when the palette is otherwise
        // altered during operation). The color is returned as an object containing the color's
        // r, g, and b (for red, green, blue) properties. Aside from the UI colors, the object
        // will be returned by reference to an index in the palette, so any changes to the
        // palette afterwards will be reflected in colors returned previously.
        color: (colorIdx = 0)=>
        {
            // Named UI colors.
            switch (colorIdx)
            {
                case "background":  return {red:16,  green:16,  blue:16};
                case "black":       return {red:0,   green:0,   blue:0};
                case "gray":
                case "grey":        return {red:127, green:127, blue:127};
                case "lightgray":
                case "lightgrey":   return {red:192, green:192, blue:192};
                case "dimgray":
                case "dimgrey":     return {red:64,  green:64,  blue:64};
                case "white":       return {red:255, green:255, blue:255};
                case "blue":        return {red:0,   green:0,   blue:255};
                case "darkorchid":  return {red:153, green:50,  blue:204};
                case "paleorchid":  return {red:158, green:123, blue:176};
                case "yellow":      return {red:255, green:255, blue:0};
                case "red":         return {red:255, green:0,   blue:0};
                case "green":       return {red:0,   green:255, blue:0};
                case "gold":        return {red:179, green:112, blue:25};
                default: break;
            }

            return activePalette[colorIdx];
        },

        // Assign one of the four Rally-Sport palettes as the current active one.
        set_palette: (paletteIdx)=>
        {
            Rsed.assert && ((paletteIdx >= 0) &&
                            (paletteIdx < rallySportPalettes.length))
                        || Rsed.throw("Trying to access a palette index out of bounds.");

            rallySportPalettes[paletteIdx].forEach((color, idx)=>
            {
                activePalette[idx].red = color.red;
                activePalette[idx].green = color.green;
                activePalette[idx].blue = color.blue;
            });
        },

        // Change the color at the given palette index in the current active palette.
        set_color: (paletteIdx = 0, newColor = {red:0,green:0,blue:0})=>
        {
            Rsed.assert && ((paletteIdx >= 0) &&
                            (paletteIdx < rallySportPalettes.length))
                        || Rsed.throw("Trying to access a palette index out of bounds.");

            newcolor =
            {
                ...
                {
                    red: activePalette[paletteIdx].red,
                    green: activePalette[paletteIdx].green,
                    blue: activePalette[paletteIdx].blue,
                },
                ...newColor,
            }

            activePalette[paletteIdx].red = newColor.red;
            activePalette[paletteIdx].green = newColor.green;
            activePalette[paletteIdx].blue = newColor.blue;
        },
    };

    return publicInterface;
})();
/*
 * Most recent known filename: js/track/varimaa.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

// Provides information about and the means to modify a track's tilemap (which Rally-Sport
// calls "VARIMAA"). For more information about the track tilemap format used in Rally-Sport,
// check out https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.track.varimaa = function(varimaaWidth = 0, varimaaHeight = 0, data = Uint8Array)
{
    Rsed.assert && (varimaaWidth === varimaaHeight)
                || Rsed.throw("Expected VARIMAA width and height to be equal.");

    Rsed.assert && ((varimaaWidth > 0) &&
                    (varimaaHeight > 0))
                || Rsed.throw("Expected VARIMAA width and height to be positive and non-zero.");

    Rsed.assert && (data.byteLength === (varimaaWidth * varimaaHeight))
                || Rsed.throw("Mismatched VARIMAA data length relative to its dimensions.");

    const publicInterface = 
    {
        width: varimaaWidth,
        height: varimaaHeight,

        // Returns the PALA index of the tile at the given track tile coordinates.
        tile_at: (x = 0, y = 0)=>
        {
            x = Math.floor(x);
            y = Math.floor(y);

            const idx = (x + y * varimaaWidth);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return 0;
            }

            return data[idx];
        },

        // Alter the PALA index at the given tile.
        set_tile_value_at: (x = 0, y = 0, newPalaIdx = 0)=>
        {
            x = Math.floor(x);
            y = Math.floor(y);

            const idx = (x + y * varimaaWidth);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return;
            }

            data[idx] = newPalaIdx;
        },
    };
    
    return publicInterface;
};
/*
 * Most recent known filename: js/track/maasto.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

// Provides information about and the means to modify a track's heightmap (which are called
// "MAASTO" in Rally-Sport). For more information about the heightmap format used in Rally-
// Sport, check out https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.track.maasto = function(maastoWidth = 0, maastoHeight = 0, data = Uint8Array)
{
    Rsed.assert && (maastoWidth === maastoHeight)
                || Rsed.throw("Expected MAASTO width and height to be equal.");

    Rsed.assert && ((maastoWidth > 0) &&
                    (maastoHeight > 0))
                || Rsed.throw("Expected MAASTO width and height to be positive and non-zero.");

    Rsed.assert && (data.byteLength === (maastoWidth * maastoHeight * 2))
                || Rsed.throw("Mismatched MAASTO data length relative to its dimensions.");

    const maxHeightmapValue = 255;
    const minHeightmapValue = -510;

    const publicInterface =
    {
        width: maastoWidth,
        height: maastoHeight,

        // Returns the MAASTO height of the tile at the given track tile coordinates.
        tile_at: (x = 0, y = 0)=>
        {
            x = Math.floor(x);
            y = Math.floor(y);

            // MAASTO data is two bytes per tile.
            const idx = ((x + y * maastoWidth) * 2);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return 0;
            }

            return two_byte_height_as_integer(data[idx], data[idx+1]);
        },

        // Alter the MAASTO heightmap at the given tile.
        set_tile_value_at: (x = 0, y = 0, newHeight = 0)=>
        {
            newHeight = Math.max(minHeightmapValue, Math.min(maxHeightmapValue, newHeight));

            x = Math.floor(x);
            y = Math.floor(y);

            // Note: MAASTO data is two bytes per tile, so we multiply the idx by two.
            const idx = ((x + y * maastoWidth) * 2);

            if ((idx < 0) || (idx >= data.byteLength))
            {
                return;
            }

            [data[idx], data[idx+1]] = [...integer_height_as_two_bytes(newHeight)];
        },

        // Reset all height values in the heightmap to the specified height.
        bulldoze: function(height)
        {
            for (let y = 0; y < maastoHeight; y++)
            {
                for (let x = 0; x < maastoWidth; x++)
                {
                    this.set_tile_value_at(x, y, height);
                }
            }
        }
    };
    
    return publicInterface;

    // Converts Rally-Sport's two-byte heightmap value into RallySportED's integer format.
    // (For more information about Rally-Sport's heightmaps, see the data format documentation
    // at github.com/leikareipa/rallysported/tree/master/docs.)
    function two_byte_height_as_integer(byte1, byte2)
    {
        // Special case: more than -255 below ground level.
        if (byte2 == 1)
        {
            return (-256 - byte1);
        }
        // Above ground when b2 == 255, otherwise below ground.
        else
        {
            return (byte2 - byte1);
        }
    }

    // Converts RallySportED's heightmap value into Rally-Sport's two-byte height format.
    // (For more information about Rally-Sport's heightmaps, see the data format documentation
    // at github.com/leikareipa/rallysported/tree/master/docs.)
    function integer_height_as_two_bytes(height)
    {
        let byte1 = 0;
        let byte2 = 0;

        if (height > 0)
        {
            byte2 = 255;
            byte1 = (255 - height);
        }
        else if (height <= 0)
        {
            if (height < -255)
            {
                byte2 = 1;
                byte1 = (Math.abs(height) - 256);
            }
            else
            {
                byte2 = 0;
                byte1 = Math.abs(height);
            }
        }

        return [byte1, byte2];
    }
};
/*
 * Most recent known filename: js/track/palat.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

// Provides information about and the means to modify a track's textures (which are called
// "PALA" in Rally-Sport). For more information about the track texture format used in Rally-
// Sport, check out https://github.com/leikareipa/rallysported/tree/master/docs.
//
// The palaWidth and palaHeight parameters give the dimensions of a single PALA texture; which
// would typically be 16 x 16. The data array contains the pixels of all of the track's PALA
// textures (normally, about 256 of them), arranged so that the first (width * height) bytes
// are the pixels of the first texture, the next (width * height) bytes those of the second
// texture, etc. Each byte in the array gives the corresponding pixel's RGB color as a palette
// index.
Rsed.track.palat = function(palaWidth = 0, palaHeight = 0, data = Uint8Array)
{
    Rsed.assert && (palaWidth === palaHeight)
                || Rsed.throw("Expected PALA width and height to be equal.");

    Rsed.assert && ((palaWidth > 0) &&
                    (palaHeight > 0))
                || Rsed.throw("Expected PALA width and height to be positive and non-zero.");

    const pixels = Array.from(data, (colorIdx)=>Rsed.palette.color(colorIdx));

    const palaSize = (palaWidth * palaHeight);

    // Pre-compute the individual PALA textures.
    const prebakedPalaTextures = new Array(256).fill().map((pala, idx)=>
    {
        return generate_texture(idx,
                                {
                                    alpha: false,
                                    flipped: "vertical",
                                });
    });

    const publicInterface = Object.freeze(
    {
        width: palaWidth,
        height: palaHeight,
        texture: Object.freeze(prebakedPalaTextures),

        // Generates a texture of the given PALA using the given arguments. You'd call this
        // function if the pre-baked version of the texture wasn't generated with suitable
        // arguments for you purposes - for instance, if it was generated with vertical flip,
        // but you want it without the flip.
        generate_texture: (palaId = 0, args = {})=>
        {
            // If the arguments provided don't actually necessitate a re-generating of the
            // texture (some arguments are just hints about how the texture should be rendered
            // and don't affect the texture data, per se), we can return the pre-generated
            // texture along with the new arguments.
            if ((typeof args.flipped === "undefined") ||
                (args.flipped === "vertical")) // Assume the pre-baked textures are generated with vertical flip.
            {
                return {...prebakedPalaTextures[palaId], ...args};
            }

            // Otherwise, re-generate the whole texture.
            return generate_texture(palaId, args);
        },
    });

    // Returns the given PALA's pixel data as a texture, whose arguments are set as given.
    function generate_texture(palaId = 0, args = {})
    {
        args =
        {
            // NOTE: If you change these default values, you may need to reflect the changes in
            // publicInterface.generate_texture(), as well; which, for instance, expects that
            // textures are generated with vertical flip, by default.
            ...
            {
                alpha: true,
                flipped: "vertical",
            },
            ...args,
        }
        
        const dataIdx = (palaId * palaSize);

        // For attempts to access the PALA data out of bounds, return a dummy texture.
        if ((dataIdx < 0) ||
            ((dataIdx + palaSize) >= pixels.length) ||
            ((dataIdx + palaSize) >= data.byteLength))
        {
            return Rsed.texture(
            {
                ...args,
                width: 1,
                height: 1,
                pixels: [Rsed.palette.color("black")],
                indices: [0],
            });
        }

        return Rsed.texture(
        {
            ...args,
            width: palaWidth,
            height: palaHeight,
            pixels: pixels.slice(dataIdx, (dataIdx + palaSize)),
            indices: data.slice(dataIdx, (dataIdx + palaSize)),
        });
    }
    
    return publicInterface;
};
/*
 * Most recent known filename: js/track/props.js
 *
 * 2019 Tarpeeksi Hyvae Soft /
 * RallySportED-js
 *
 */

"use strict";

Rsed.track = Rsed.track || {};

// Provides information about and the means to modify a track's props (track-side 3d objects,
// like trees and the finish line). For more information about track props, check out the
// documentation at https://github.com/leikareipa/rallysported/tree/master/docs; and the
// prop metadata JSON file, distributable/assets/metadata/props.json.
//
// The textureAtlas parameter provides as an array the pixels of the prop texture atlas, with
// each byte in it giving the corresponding pixel's RGB color as a palette index.
Rsed.track.props = async function(textureAtlas = Uint8Array)
{
    const data = await fetch_prop_metadata_from_server();

    Rsed.assert && ((typeof data.propMeshes !== "undefined") &&
                    (typeof data.propLocations !== "undefined") &&
                    (typeof data.propNames !== "undefined"))
                || Rsed.throw("Missing properties in prop metadata.");

    // Filter out comments and other auxiliary info from the JSON data; and sort by the relevant
    // index, so we can access the xth element with [x].
    const propNames = data.propNames.filter(m=>(typeof m.propId !== "undefined"))
                                    .sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)));

    const propMeshes = data.propMeshes.filter(m=>(typeof m.propId !== "undefined"))
                                      .sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)));

    const trackPropLocations = data.propLocations.filter(m=>(typeof m.trackId !== "undefined"))
                                                 .sort((a, b)=>((a.trackId === b.trackId)? 0 : ((a.trackId > b.trackId)? 1 : -1)));

    const textureRects = data.propTextureRects.filter(m=>(typeof m.textureId !== "undefined"))
                                              .sort((a, b)=>((a.textureId === b.textureId)? 0 : ((a.textureId > b.textureId)? 1 : -1)));

    // Pre-compute the individual prop textures.
    const prebakedPropTextures = (new Array(textureRects.length)).fill().map((tex, idx)=>
    {
        const width = textureRects[idx].rect.width;
        const height = textureRects[idx].rect.height;
        const pixels = [];
        const indices = [];

        // Copy the texture's pixel region from the texture atlas.
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                const textureAtlasWidth = 128;
                const dataIdx = ((textureRects[idx].rect.topLeft.x + x) + (textureRects[idx].rect.topLeft.y + y) * textureAtlasWidth);

                indices.push(textureAtlas[dataIdx]);
                pixels.push(Rsed.palette.color(textureAtlas[dataIdx]));
            }
        }

        return Rsed.texture(
        {
            width,
            height,
            pixels: pixels,
            indices: indices,
            flipped: "vertical",
            alpha: true,
        });
    });

    // Pre-compute prop meshes. Each mesh will be an object with the following form:
    //
    //     {
    //         ngons:
    //         [
    //             {
    //                 fill:
    //                 {
    //                     type: "color" | "texture",
    //                     idx: ...
    //                 }
    //                 vertices:
    //                 [
    //                     {x: ..., y: ..., z: ...},
    //                     {x: ..., y: ..., z: ...},
    //                     {x: ..., y: ..., z: ...},
    //                     ...
    //                 ]
    //             },
    //             {
    //                 fill: {type: ..., idx: ...}
    //                 vertices: [{...}]
    //             },
    //             ...
    //         ]
    //     }
    //
    // That is, each mesh consists of one or more n-gons, which themselves consist of
    // a fill property, which describes whether the n-gon should be filled with a solid
    // color or a texture (the fill.idx property defines either the color's palette index
    // or the texture's index, depending on the fill type); and a list of the n vertices
    // that define the n-gon.
    //
    const prebakedPropMeshes = (new Array(propMeshes.length)).fill().map((mesh, idx)=>
    {
        return {
            ngons: propMeshes[idx].ngons.map(ngon=>
            {
                const meshNgon =
                {
                    fill: Object.freeze(
                    {
                        type: ngon.fill.type.slice(),
                        idx: ngon.fill.idx
                    }),
                    vertices: ngon.vertices.map(vert=>(Object.freeze(
                    {
                        x: vert.x,
                        y: -vert.y,
                        z: -vert.z
                    }))),
                };

                Object.freeze(meshNgon.vertices);

                return meshNgon;
            }),
        };
    });

    const publicInterface =
    {
        mesh: Object.freeze(prebakedPropMeshes),

        texture: Object.freeze(prebakedPropTextures),

        name: (propId = 0)=>
        {
            Rsed.assert && ((propId >= 0) &&
                            (propId < propMeshes.length))
                        || Rsed.throw("Querying a prop mesh out of bounds (" + propId + ").");

            return propNames[propId].name;
        },

        names: ()=>
        {
            return propNames.map(nameObj=>nameObj.name);
        },

        // Returns the id of a prop with the supplied name. Throws if no such prop was found.
        id_for_name: (propName = "")=>
        {
            const idx = propNames.map(nameObj=>nameObj.name).indexOf(propName);

            Rsed.assert && (idx !== -1)
                        || Rsed.throw("Failed to find a prop called " + propName + ".");

            return propNames[idx].propId;
        },

        // Moves the propIdx'th prop on the given track by the given delta.
        move: (trackId = 0, propIdx = 0, delta = {x:0,y:0,z:0})=>
        {
            // For now, shared mode doesn't support moving props.
            if (Rsed.shared_mode_n.enabled()) return;

            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            const currentLocation = trackPropLocations[trackId].locations[propIdx];

            delta =
            {
                ...{x:0,y:0,z:0},
                ...delta,
            };

            currentLocation.x = clamped_to_prop_margins(currentLocation.x + delta.x);
            currentLocation.y = (currentLocation.y + delta.y);
            currentLocation.z = clamped_to_prop_margins(currentLocation.z + delta.z);
        },

        remove: (trackId = 0, propIdx = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            /// TODO: Finish lines should not be user-removable; so we do a little string comparison
            /// kludge to ensure that doesn't happen. A more elegant implementation would ideally
            /// be substituted.
            if (propNames[trackPropLocations[trackId].locations[propIdx].propId].name.startsWith("finish"))
            {
                return;
            }

            trackPropLocations[trackId].locations.splice(propIdx, 1);
        },

        // Assigns a new location to the propIdx'th prop on the given track.
        set_prop_location: (trackId = 0, propIdx = 0, location = {x:0,y:0,z:0})=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            location =
            {
                ...
                {
                    x: trackPropLocations[trackId].locations[propIdx].x,
                    y: trackPropLocations[trackId].locations[propIdx].y,
                    z: trackPropLocations[trackId].locations[propIdx].z,
                },
                ...location,
            }

            trackPropLocations[trackId].locations[propIdx].x = location.x;
            trackPropLocations[trackId].locations[propIdx].y = location.y;
            trackPropLocations[trackId].locations[propIdx].z = location.z;
        },

        // Set the number of props on the given track. Props whose index value is higher than this
        // count will be deleted.
        set_count: (trackId = 0, newPropCount = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((newPropCount > 1) &&
                            (newPropCount <= trackPropLocations[trackId].locations.length))
                    || Rsed.throw("Trying to set a new prop count out of bounds.");

            trackPropLocations[trackId].locations.splice(newPropCount);
        },

        change_prop_type: (trackId = 0, propIdx = 0, newPropId = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((propIdx >= 0) &&
                            (propIdx < trackPropLocations[trackId].locations.length))
                        || Rsed.throw("Querying a prop location out of bounds.");

            trackPropLocations[trackId].locations[propIdx].propId = newPropId;
        },

        add_location: (trackId = 0, newPropId = 0, location = {x:0,y:0,z:0})=>
        {
            if (trackPropLocations[trackId].locations.length >= Rsed.constants.maxPropCount)
            {
                Rsed.alert("Can't add more props. This track already has " + trackPropLocations[trackId].locations.length +
                           " of them, which is the maximum. You can remove some to make room for new ones.");
                return;
            }

            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            Rsed.assert && ((newPropId >= 0) &&
                            (newPropId < propNames.length))
                        || Rsed.throw("Querying a prop id out of bounds.");

            location =
            {
                ...
                {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                ...location,
            }

            trackPropLocations[trackId].locations.push(
            {
                propId: newPropId,
                x: clamped_to_prop_margins(location.x),
                y: location.y,
                z: clamped_to_prop_margins(location.z),
            });
        },

        // Returns by value the locations of all the props on the given track.
        locations_of_props_on_track: (trackId = 0)=>
        {
            Rsed.assert && ((trackId >= 0) &&
                            (trackId <= 7))
                        || Rsed.throw("Querying a track out of bounds.");

            return Object.freeze(trackPropLocations[trackId].locations.map(loc=>(
            {
                propId: loc.propId,
                x: loc.x,
                y: loc.y,
                z: loc.z
            })));
        },
    };

    return publicInterface;

    // Clamp the given value (expected to be track tile units) so that it doesn't exceed the
    // track prop margins. (E.g. if the track is 128 tiles wide and the margin is 2 tiles, a
    // value of 132 would be clamped to 126; and a value of -5 to 2.)
    function clamped_to_prop_margins(value)
    {
        const min = (Rsed.constants.propTileMargin * Rsed.constants.groundTileSize);
        const max = ((Rsed.core.current_project().maasto.width - Rsed.constants.propTileMargin) * Rsed.constants.groundTileSize);

        return Rsed.clamp(value, min, max);
    }

    async function fetch_prop_metadata_from_server()
    {
        return fetch("server/get-prop-metadata.php")
               .then(response=>
               {
                   if (!response.ok)
                   {
                       throw "A GET request to the server failed.";
                   }

                   return response.json();
               })
               .then(ticket=>
               {
                   if (!ticket.valid || (typeof ticket.data === "undefined"))
                   {
                       throw ("The server sent a GET ticket marked invalid. It said: " + ticket.message);
                   }

                   return JSON.parse(ticket.data);
               })
               .catch(error=>{ Rsed.throw(error); });
    }
}
/*
 * Most recent known filename: js/ui/font.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 * The UI font.
 * 
 */

"use strict";

Rsed.ui_font_n = (function()
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
    const A = "dimgray";
    const _ = "background";

    const charset = 
           [_,_,_,_,_,_,_,_, // Space
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,X,_,_,_,_, // #
            X,X,X,X,X,_,_,_,
            _,X,_,X,_,_,_,_,
            X,X,X,X,X,_,_,_,
            _,X,_,X,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,Z,Z,Z,_,_,_,	// $
            _,_,Z,_,_,Z,_,_,
            _,_,Z,_,_,_,Z,_,
            _,_,Z,_,_,Z,_,_,
            _,_,Z,Z,Z,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,	// %
            _,A,A,_,A,A,_,_,
            _,A,A,_,A,A,A,A,
            _,_,_,_,_,_,A,A,
            _,A,A,_,A,A,_,_,
            _,_,_,_,_,_,A,A,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,	// &
            _,W,W,L,W,W,_,_,
            _,W,W,L,W,W,W,W,
            _,L,L,L,L,L,W,W,
            _,W,W,L,W,W,L,L,
            _,_,_,_,_,_,W,W,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,    // *
            _,X,_,X,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,X,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,	//
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,	// @
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,	// G
            X,_,_,_,_,_,_,_,
            X,_,X,X,_,_,_,_,
            X,_,_,X,_,_,_,_,
            _,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_, // M
            X,X,X,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            ,_,_,_,_,_,_,_, // N
            X,_,X,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_, // Q
            X,_,_,X,_,_,_,_,
            X,_,_,X,_,_,_,_,
            X,_,X,X,_,_,_,_,
            _,X,X,X,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_, // W
            X,_,_,X,_,_,_,_,
            X,X,X,X,_,_,_,_,
            X,X,X,X,_,_,_,_,
            _,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            X,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            X,_,_,_,_,_,_,_,
            X,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            X,X,_,_,_,_,_,_,
            _,_,X,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,R,R,R,R,_,_,_, // ^.
            _,_,_,R,R,_,_,_,
            _,_,R,_,R,_,_,_,
            _,R,_,_,R,_,_,_,
            R,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,

            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,X,X,_,_,_,_,_,
            _,_,_,_,_,_,_,_,
            _,_,_,_,_,_,_,_,];

    const publicInterface = {};
    {
        // Returns a copy of the pixels in the charset of the given charactrr.
        publicInterface.character = function(ch = 'A')
        {
            let idx = ch.charCodeAt(0);

            Rsed.assert && ((idx >= firstChar.charCodeAt(0)) &&
                            (idx <= lastChar.charCodeAt(0))
                        || Rsed.throw("Was asked for a font character that isn't in the charset."));

            // Convert to 0-indexed, where 0 is the first character.
            idx -= firstChar.charCodeAt(0);

            // Convert to a starting index of this character in the charset.
            idx = (idx * charWidth * charHeight);

            const character = charset.slice(idx, (idx + (charWidth * charHeight)));

            Rsed.assert && (character.length === (charWidth * charHeight))
                        || Rsed.throw("Failed to return the given character.");

            return character;
        }

        publicInterface.font_width = function() { return charWidth; }
        publicInterface.font_height = function() { return charHeight; }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/view.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

Rsed.ui_view_n = (function()
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
            Rsed.assert && (availableViews.includes(view))
                        || Rsed.throw("Can't find the given view to set.");
                        
            currentView = view;

            Rsed.ui_input_n.reset_mouse_hover_info();
        }

        publicInterface.toggle_view = function(firstView = "", secondView = "")
        {
            this.set_view(((currentView === firstView)? secondView : firstView))
        }

        publicInterface.current_view = function()
        {
            Rsed.assert && (availableViews.includes(currentView))
                        || Rsed.throw("Holding an invalid view.");

            return currentView.slice(0);
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/brush.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 * 
 */

"use strict";

Rsed.ui_brush_n = (function()
{
    // How large of a radius the brush paints with. A value of 0 means one tile.
    let brushSize = 0;

    // Which PALA texture the brush paints with, currently.
    let brushPalaIdx = 3;

    // When shared editing is enabled, we'll accumulate all brush strokes into caches,
    // which we'll then upload to the server the next time we poll it; after which
    // the caches are emptied and filled up again as we make new edits.
    const brushCache = Object.freeze(
    {
        maasto:[],
        varimaa:[]
    });

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
                if (tileZ < 0 || tileZ >= Rsed.core.current_project().maasto.width) continue;

                for (let bx = -brushSize; bx <= brushSize; bx++)
                {
                    const tileX = (x + bx);
                    if (tileX < 0 || tileX >= Rsed.core.current_project().maasto.width) continue;

                    switch (brushAction)
                    {
                        case this.brushAction.changeHeight:
                        {
                            if (this.brushSmoothens)
                            {
                                if (tileX < 1 || tileX >=  (Rsed.core.current_project().maasto.width - 1)) continue;
                                if (tileZ < 1 || tileZ >= (Rsed.core.current_project().maasto.width - 1)) continue;
    
                                let avgHeight = 0;
                                avgHeight += Rsed.core.current_project().maasto.tile_at(tileX+1, tileZ);
                                avgHeight += Rsed.core.current_project().maasto.tile_at(tileX-1, tileZ);
                                avgHeight += Rsed.core.current_project().maasto.tile_at(tileX, tileZ+1);
                                avgHeight += Rsed.core.current_project().maasto.tile_at(tileX, tileZ-1);
                                avgHeight += Rsed.core.current_project().maasto.tile_at(tileX+1, tileZ+1);
                                avgHeight += Rsed.core.current_project().maasto.tile_at(tileX+1, tileZ-1);
                                avgHeight += Rsed.core.current_project().maasto.tile_at(tileX-1, tileZ+1);
                                avgHeight += Rsed.core.current_project().maasto.tile_at(tileX-1, tileZ-1);
                                avgHeight /= 8;
                                    
                                Rsed.core.current_project().maasto.set_tile_value_at(tileX, tileZ, Math.floor(((avgHeight + Rsed.core.current_project().maasto.tile_at(tileX, tileZ) * 7) / 8)));
                            }
                            else
                            {
                                Rsed.core.current_project().maasto.set_tile_value_at(tileX, tileZ, (Rsed.core.current_project().maasto.tile_at(tileX, tileZ) + value));
                            }

                            if (Rsed.shared_mode_n.enabled())
                            {
                                brushCache.maasto[tileX + tileZ * Rsed.core.current_project().maasto.width] = Rsed.core.current_project().maasto.tile_at(tileX, tileZ);
                            }

                            break;
                        }
                        case this.brushAction.changePala:
                        {
                            Rsed.core.current_project().varimaa.set_tile_value_at(tileX, tileZ, value);

                            if (Rsed.shared_mode_n.enabled())
                            {
                                brushCache.varimaa[tileX + tileZ * Rsed.core.current_project().maasto.width] = Rsed.core.current_project().varimaa.tile_at(tileX, tileZ);
                            }

                            break;
                        }
                        default: Rsed.throw("Unknown brush action.");
                    }
                }
            }
        }

        publicInterface.set_brush_size = function(newSize = 0)
        {
            Rsed.assert && (newSize >= 0)
                        || Rsed.throw("Attempted to set an invalid brush size.");

            brushSize = newSize;
        }

        publicInterface.brush_size = function()
        {
            return brushSize;
        }

        publicInterface.set_brush_pala_idx = function(newPalaIdx = 0)
        {
            Rsed.assert && (newPalaIdx >= 0)
                        || Rsed.throw("Attempted to set an invalid brush PALA index.");

            brushPalaIdx = newPalaIdx;
        }
        
        publicInterface.brush_pala_idx = function()
        {
            return brushPalaIdx;
        }

        // Empties out the given brush cache; returning a copy of the contents of the
        // cache prior to its emptying.
        publicInterface.flush_brush_cache = function(which = "")
        {
            return ((cache)=>
            {
                brushCache[which].length = 0;
                return cache;
            })(brushCache[which].slice());
        }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/ui/draw.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 * Renders the RallySportED UI.
 * 
 */

"use strict";

Rsed.ui_draw_n = (function()
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
    let palatPaneWidth = ((numPalatPaneCols * (Rsed.constants.palaWidth / 2)) + 1);
    let palatPaneHeight = ((numPalatPaneRows * (Rsed.constants.palaHeight / 2)) + 1);
    
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

        Rsed.assert && ((mousePick instanceof Array) ||
                        (mousePick === null))
                    || Rsed.throw("Expected a valid mouse-picking buffer.");

        Rsed.assert && (pixelSurface != null)
                    || Rsed.throw("Expected a valid pixel surface.");

        Rsed.assert && ((pixels[0] != null) &&
                        (pixels.length > 0))
                    || Rsed.throw("Expected a valid array of pixels.");

        Rsed.assert && ((width > 0) &&
                        (height > 0))
                    || Rsed.throw("Expected a valid image resolution.");

        Rsed.assert && ((x >= 0) ||
                        (x < pixelSurface.width) ||
                        (y >= 0) ||
                        (y < pixelSurface.height))
                    || Rsed.throw("Invalid screen coordinates for drawing the image.");

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

                const color = ((typeof pixel === "object")? pixel : Rsed.palette.color(pixel));
                put_pixel((x + cx), (y + cy), color.red, color.green, color.blue);

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

        Rsed.assert && (pixelSurface != null)
                    || Rsed.throw("Expected a valid pixel surface.");

        Rsed.assert && (string.length != null)
                    || Rsed.throw("Expected a non-empty string");

        // Convert from percentages into absolute screen coordinates.
        if (x < 0) x = Math.floor(-x * pixelSurface.width);
        if (y < 0) y = Math.floor(-y * pixelSurface.height);

        // Draw the string, one character at a time.
        for (let i = 0; i < string.length; i++)
        {
            const character = Rsed.ui_font_n.character(string[i]);
            const width = Rsed.ui_font_n.font_width();
            const height = Rsed.ui_font_n.font_height();
            
            draw_image(character, null, width, height, x, y, false);
            
            x += ((Rsed.ui_font_n.font_width() / 2) + 0.3);
        }
    }

    // Draws the mouse cursor, and any indicators attached to it.
    function draw_mouse_cursor()
    {
        if (Rsed.ui_input_n.mouse_hover_type() === Rsed.ui_input_n.mousePickingType.ui &&
            Rsed.ui_input_n.mouse_hover_args().elementId === Rsed.ui_input_n.uiElement.palat_pane)
        {
            draw_string("PALA:" + Rsed.ui_input_n.mouse_hover_args().x, Rsed.ui_input_n.mouse_pos_x() + 10, Rsed.ui_input_n.mouse_pos_y() + 17);
        }
        else if (Rsed.ui_brush_n.brushSmoothens)
        {
            draw_string("SMOOTHING", Rsed.ui_input_n.mouse_pos_x() + 10, Rsed.ui_input_n.mouse_pos_y() + 17);
        }
    }

    function draw_watermark()
    {
        draw_string("RALLY", -.012, 3);
        draw_string("SPORT", -.012, 3 + Rsed.ui_font_n.font_height()-1);
        draw_string("ED%", -.012, 3 + ((Rsed.ui_font_n.font_height()-1) * 2));
    }

    function draw_footer_info()
    {
        const x = Rsed.ui_input_n.mouse_tile_hover_x();
        const y = Rsed.ui_input_n.mouse_tile_hover_y();

        let str = "HEIGHT:+000 PALA:000 X,Y:000,000";
        switch (Rsed.ui_input_n.mouse_hover_type())
        {
            case Rsed.ui_input_n.mousePickingType.ground:
            {
                const xStr = String(x).padStart(3, "0");
                const yStr = String(y).padStart(3, "0");
                const heightStr = (Rsed.core.current_project().maasto.tile_at(x, y) < 0? "-" : "+") +
                                  String(Math.abs(Rsed.core.current_project().maasto.tile_at(x, y))).padStart(3, "0");
                const palaStr = String(Rsed.core.current_project().varimaa.tile_at(x, y)).padStart(3, "0");

                str = "HEIGHT:" + heightStr + " PALA:" + palaStr +" X,Y:"+xStr+","+yStr;

                break;
            }
            case Rsed.ui_input_n.mousePickingType.prop:
            {
                str = "PROP:" + Rsed.core.current_project().props.name(Rsed.ui_input_n.mouse_hover_args().idx) +
                      " IDX:" + Rsed.ui_input_n.mouse_hover_args().idx + "(" + Rsed.ui_input_n.mouse_hover_args().trackId + ")";

                break;
            }
            default: break;
        }

        draw_string(str, 0, Rsed.core.render_height() - Rsed.ui_font_n.font_height()-0);
    }

    function draw_fps()
    {
        const fpsString = ("FPS: " + Rsed.core.renderer_fps());
        draw_string(fpsString, pixelSurface.width - (fpsString.length * Rsed.ui_font_n.font_width()/2) - 73, 3);
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
        const xMul = (Rsed.core.current_project().maasto.width / width);
        const yMul = (Rsed.core.current_project().maasto.width / height);
        const image = [];   // An array of palette indices that forms the minimap image.
        const mousePick = [];
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                const tileX = (x * xMul);
                const tileZ = (y * yMul);

                const pala = Rsed.core.current_project().palat.texture[Rsed.core.current_project().varimaa.tile_at(tileX, tileZ)];
                let color = ((pala == null)? 0 : pala.indices[1]);

                // Have a black outline.
                if (y % (height - 1) === 0) color = "black";
                if (x % (width - 1) === 0) color = "black";

                image.push(color);
                mousePick.push(Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ui,
                                                                       {
                                                                           elementId: Rsed.ui_input_n.uiElement.minimap,
                                                                           uiX: tileX,
                                                                           uiY: tileZ
                                                                       }));
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
        const currentPala = Rsed.ui_brush_n.brush_pala_idx();
        const pala = Rsed.core.current_project().palat.texture[currentPala];

        if (pala != null)
        {
            draw_image(pala.indices, null, 16, 16, pixelSurface.width - 16 - 5, 34 + 3, false);
            draw_string((Rsed.ui_brush_n.brush_size() + 1) + "*", pixelSurface.width - 16 - 4 + 6, 34 + 3 + 16)
        }
    }

    /// FIXME: This gets very slow to draw, because each pixel is paletted. Pre-bake the image as RGBA values
    /// into a buffer and just blit it out, updating the buffer whenever you edit the VARIMAA.
    function draw_paint_view()
    {
        // Draw a large minimap of the track in the middle of the screen.
        const width = Math.floor(Rsed.core.render_width() * 0.81);
        const height = Math.floor(Rsed.core.render_height() * 0.72);
        {
            const xMul = (Rsed.core.current_project().maasto.width / width);
            const zMul = (Rsed.core.current_project().maasto.width / height);
            const image = [];   // An array of palette indices that forms the minimap image.
            const mousePick = [];

            for (let z = 0; z < height; z++)
            {
                for (let x = 0; x < width; x++)
                {
                    const tileX = Math.floor(x * xMul);
                    const tileZ = Math.floor(z * zMul);

                    const pala = Rsed.core.current_project().palat.texture[Rsed.core.current_project().varimaa.tile_at(tileX, tileZ)];
                    let color = ((pala == null)? 0 : pala.indices[1]);

                    // Create an outline.
                    if (z % (height - 1) === 0) color = "gray";
                    if (x % (width - 1) === 0) color = "gray";

                    // Indicate the location of the track's checkpoint.
                    /// FIXME: Disabled for now. Will be reimplemented for the new resource-handling code.
                    /*if ((tileX === Rsed.maasto_n.track_checkpoint_x()) &&
                        (tileZ === Rsed.maasto_n.track_checkpoint_y()))
                    {
                        color = "white";
                    }*/

                    image.push(color);
                    mousePick.push(Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ui,
                        {elementId:Rsed.ui_input_n.uiElement.large_minimap,
                        uiX:tileX, uiY:tileZ}));
                }
            }



            draw_image(image, mousePick, width, height, ((pixelSurface.width / 2) - (width / 2)), ((pixelSurface.height / 2) - (height / 2)), false);
        }

        draw_string("TRACK SIZE:" + Rsed.core.current_project().maasto.width + "," + Rsed.core.current_project().maasto.width,
                    ((pixelSurface.width / 2) - (width / 2)),
                    ((pixelSurface.height / 2) - (height / 2)) - Rsed.ui_font_n.font_height());
    }

    const publicInterface = {};
    {
        // Call this when RallySportED crashes and you want the user to be given a visual indication of that
        // on the render surface.
        // NOTE: Avoid evoking Rsed.assert in this function, since the function itself may be called on asserts.
        publicInterface.draw_crash_message = function(renderSurface, message)
        {
            if (!(renderSurface instanceof Rsed.render_surface_n.render_surface_o)) return;

            pixelSurface = renderSurface.getContext("2d").getImageData(0, 0, renderSurface.width, renderSurface.height);

            draw_string("RALLYSPORTED HAS STOPPED RUNNING. SORRY ABOUT THAT!", 2, Rsed.ui_font_n.font_height()*1);
            draw_string("C:>_", 2, Rsed.ui_font_n.font_height()*3);

            renderSurface.getContext("2d").putImageData(pixelSurface, 0, 0);
            pixelSurface = null;
        }

        publicInterface.draw_ui = function(renderSurface = Rsed.render_surface_n.render_surface_o)
        {
            // Draw the UI.
            pixelSurface = renderSurface.getContext("2d").getImageData(0, 0, renderSurface.width, renderSurface.height);
            mousePickBuffer = [];//renderSurface.mousePickBuffer;
            {
                switch (Rsed.ui_view_n.current_view())
                {
                    case "3d":
                    case "3d-topdown":
                    {
                        draw_watermark();
                        draw_minimap();
                        draw_active_pala();
                        draw_footer_info();
                        if (Rsed.ui_view_n.showPalatPane) draw_palat_pane();

                        break;
                    }
                    case "2d-topdown":
                    {
                        draw_paint_view();
                        draw_active_pala();
                        if (Rsed.ui_view_n.showPalatPane) draw_palat_pane();
                        
                        break;
                    }
                    default: break;
                }

                if (Rsed.core.fps_counter_enabled()) draw_fps();
                
                draw_mouse_cursor();
            }
            renderSurface.getContext("2d").putImageData(pixelSurface, 0, 0);
            pixelSurface = null;
            mousePickBuffer = null;
        }

        // Create a set of thumbnails of the contents of the current PALAT file. We'll display this pane of
        // thumbnails to the user for selecting PALAs.
        publicInterface.prebake_palat_pane = function()
        {
            const maxNumPalas = 253;

            const palaWidth = Rsed.constants.palaWidth;
            const palaHeight = Rsed.constants.palaHeight;

            palatPaneBuffer.length = 0;
            palatPaneMousePick.length = 0;

            // Recompute the pane's dimensions based on the current display size.
            /// FIXME: Leaves unnecessary empty rows for some resolutions.
            numPalatPaneRows = (Math.floor(Rsed.core.render_height() / 8) - 1);
            numPalatPaneCols = Math.ceil(253 / numPalatPaneRows);
            palatPaneWidth = ((numPalatPaneCols * (palaWidth / 2)) + 1);
            palatPaneHeight = ((numPalatPaneRows * (palaHeight / 2)) + 1);
        
            let palaIdx = 0;
            for (let y = 0; y < numPalatPaneRows; y++)
            {
                for (let x = 0; x < numPalatPaneCols; (x++, palaIdx++))
                {
                    if (palaIdx > maxNumPalas) break;

                    const pala = Rsed.core.current_project().palat.texture[palaIdx];
                    for (let py = 0; py < palaHeight; py++)
                    {
                        for (let px = 0; px < palaWidth; px++)
                        {
                            const palaTexel = Math.floor(px + py * palaWidth);
                            const bufferTexel = Math.floor((Math.floor(x * palaWidth + px) / 2) +
                                                            Math.floor((y * palaHeight + py) / 2) * palatPaneWidth);

                            palatPaneBuffer[bufferTexel] = Rsed.palette.color(pala.indices[palaTexel]);
                            palatPaneMousePick[bufferTexel] = Rsed.ui_input_n.create_mouse_picking_id(Rsed.ui_input_n.mousePickingType.ui,
                                                                                                      {elementId:Rsed.ui_input_n.uiElement.palat_pane, uiX:palaIdx, uiY:0});
                        }
                    }
                }
            }

            // Draw a grid over the PALA thumbnails.
            for (let i = 0; i < numPalatPaneRows * palaHeight/2; i++)
            {
                for (let x = 0; x < numPalatPaneCols; x++)
                {
                    palatPaneBuffer[(x * palaWidth/2) + i * palatPaneWidth] = "black";
                }
            }
            for (let i = 0; i < numPalatPaneCols * palaWidth/2; i++)
            {
                for (let y = 0; y < numPalatPaneRows; y++)
                {
                    palatPaneBuffer[i + (y * palaHeight/2) * palatPaneWidth] = "black";
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
 * RallySportED-js
 *
 * Handles user input.
 * 
 */

"use strict";

Rsed.ui_input_n = (function()
{
    const publicInterface = {};

    // The current x,y pixel position of the mouse on the screen.
    const mousePos = {x:0, y:0};

    // The number of pixels the mouse has moved since the last time set_mouse_pos() was called.
    const mousePosDelta = {x:0, y:0};

    // The x,y coordinates of the ground tile the mouse is currently hovering over.
    const mouseTileHover = {x:-1, y:-1};

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
        const movement = {x:0, y:0, z:0};

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
                    mouseLock = {grab:"prop",propTrackId:Rsed.ui_input_n.mouse_hover_args().trackId};
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
                default: Rsed.throw("Unhandled mouse lock type."); break;
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
                    if (mouseLeftPressed &&
                        !Rsed.shared_mode_n.enabled()) // For now, shared mode doesn't support interacting with props.
                    {
                        Rsed.core.current_project().props.add_location(Rsed.core.current_project().track_id(),
                                                                       Rsed.core.current_project().props.id_for_name("tree"),
                                                                       {
                                                                           x: (hoverArgs.tileX * Rsed.constants.groundTileSize),
                                                                           z: (hoverArgs.tileZ * Rsed.constants.groundTileSize),
                                                                       });

                        mouseLock.hibernating = true;
                    }
                }
                // Edit/paint the terrain.
                else
                {
                    if (mouseLeftPressed | mouseRightPressed)
                    {
                        const delta = (mouseLeftPressed? 2 : (mouseRightPressed? -2 : 0));
                        Rsed.ui_brush_n.apply_brush_to_terrain(Rsed.ui_brush_n.brushAction.changeHeight, delta,
                                                        hoverArgs.tileX, hoverArgs.tileZ);
                    }
                    else if (mouseMiddlePressed)
                    {
                        Rsed.ui_brush_n.apply_brush_to_terrain(Rsed.ui_brush_n.brushAction.changePala, Rsed.ui_brush_n.brush_pala_idx(),
                                                          hoverArgs.tileX, hoverArgs.tileZ);
                    }
                }

                break;
            }
            case "prop":
            {
                // For now, shared mode doesn't support interacting with props.
                if (Rsed.shared_mode_n.enabled()) break;

                Rsed.assert && (mouseLock.propTrackId != null)
                            || Rsed.throw("Expected the prop track id as a parameter to prop grabs.");

                if (mouseLeftPressed)
                {
                    // Remove the selected prop.
                    if (shiftPressed)
                    {
                        Rsed.core.current_project().props.remove(Rsed.core.current_project().track_id(), mouseLock.propTrackId);
                        mouseLock.hibernating = true;
                    }
                    // Drag the prop.
                    else
                    {
                        // For now, don't allow moving the starting line (prop #0).
                        if (mouseLock.propTrackId !== 0)
                        {
                            Rsed.core.current_project().props.move(Rsed.core.current_project().track_id(),
                                                                   mouseLock.propTrackId,
                                                                   {
                                                                       x: Rsed.ui_input_n.mouse_pos_delta_x()*6,
                                                                       z: Rsed.ui_input_n.mouse_pos_delta_y()*12,
                                                                   });
                        }
                    }
                }

                break;
            }
            case "ui":
            {
                Rsed.assert && (mouseLock.elementId != null)
                            || Rsed.throw("Expected the element id as a parameter to ui grabs.");

                Rsed.assert && ((mouseLock.x != null) &&
                                (mouseLock.y != null))
                            || Rsed.throw("Expected x,y coordinates as parameters to ui grabs.");

                switch (mouseLock.elementId)
                {
                    case publicInterface.uiElement.palat_pane:
                    {
                        if (mouseLeftPressed | mouseRightPressed) Rsed.ui_brush_n.set_brush_pala_idx(mouseLock.x);

                        break;
                    }
                    case publicInterface.uiElement.large_minimap:
                    {
                        if (mouseMiddlePressed)
                        {
                            Rsed.ui_brush_n.apply_brush_to_terrain(Rsed.ui_brush_n.brushAction.changePala, Rsed.ui_brush_n.brush_pala_idx(),
                                                              mouseLock.x, mouseLock.y);
                                               
                            // We want the user to be able to paint by dragging the cursor, so we release the mouse lock here
                            // and let it refresh itself next frame with a (potentially) new cursor position.
                            mouseLock = null;
                        }

                        break;
                    }
                    default: Rsed.throw("Unhandled UI element click."); break;
                }
                break;
            }
            default: Rsed.throw("Unknown mouse grab type."); break;
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
            Rsed.assert && ((pickType & ((1<<numBitsForIndex)-1)) === pickType)
                        || Rsed.throw("Can't store the picking index in the given number of bytes.");

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

                    Rsed.assert && (numBitsRequired <= 32)
                                || Rsed.throw("Not enough bits to store the mouse-picking args for a UI element.");

                    Rsed.assert && ((args.elementId != null) &&
                                    (args.uiX != null) &&
                                    (args.uiY != null))
                                || Rsed.throw("Missing arguments for a UI picking id.");

                    id |= (args.uiX << numBitsForIndex);
                    id |= (args.uiY << (numBitsForIndex + numBitsForUiCoord));
                    id |= (args.elementId << (numBitsForIndex + (numBitsForUiCoord * 2)));

                    return id;
                }
                case this.mousePickingType.prop:
                {
                    const numBitsRequired = (numBitsForPropIdx + numBitsForPropTrackId + numBitsForIndex);

                    Rsed.assert && (numBitsRequired <= 32)
                                || Rsed.throw("Not enough bits to store the mouse-picking args for a prop.");

                    Rsed.assert && ((args.propIdx != null) &&
                                    (args.propTrackId != null))
                                || Rsed.throw("Missing arguments for a prop picking id.");

                    id |= (args.propIdx << numBitsForIndex);
                    id |= (args.propTrackId << (numBitsForIndex + numBitsForPropIdx));

                    return id;
                }
                case this.mousePickingType.ground:
                {
                    const numBitsRequired = (numBitsForTileCoords * 2 + numBitsForIndex);

                    Rsed.assert && (numBitsRequired <= 32)
                                || Rsed.throw("Not enough bits to store the mouse-picking args for a ground tile.");

                    Rsed.assert && ((args.tileX != null) &&
                                    (args.tileZ != null))
                                || Rsed.throw("Missing arguments for a ground picking id.");

                    // The tile coordinates can be out of bounds when the camera is moved outside of the
                    // track's boundaries. In that case, simply ignore them, since there's no interactible
                    // ground elements outside of the track.
                    if ((args.tileX < 0) || (args.tileX >= Rsed.core.current_project().maasto.width) ||
                        (args.tileZ < 0) || (args.tileZ >= Rsed.core.current_project().maasto.width))
                    {
                        return null;
                    }

                    Rsed.assert && ((args.tileX & ((1<<numBitsForTileCoords)-1)) === args.tileX)
                                || Rsed.throw("Can't store the MAASTO x coordinate in the picking id.");

                    Rsed.assert && ((args.tileZ & ((1<<numBitsForTileCoords)-1)) === args.tileZ)
                                || Rsed.throw("Can't store the MAASTO z coordinate in the picking id.");

                    id |= (args.tileX << numBitsForIndex);
                    id |= (args.tileZ << (numBitsForIndex + numBitsForTileCoords));

                    return id;
                }
                default: Rsed.throw("Undefined mouse-picking case when packing."); return null;
            }

            Rsed.throw("Fell through (shouldn't have) when creating a mouse-picking id.");
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

            Rsed.throw("Fell through (shouldn't have) when extracting mouse-picking args.");
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
            if ((x < 0 || x >= Rsed.core.render_width()) ||
                (y < 0 || y >= Rsed.core.render_height()))
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

                const mousePickValue = Rsed.core.mouse_pick_buffer_value_at(x, y);
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

        publicInterface.are_editing_keys_pressed = function() { return (mouseLeftPressed | mouseRightPressed | mouseMiddlePressed); }
    }
    return publicInterface;
})();
/*
 * Most recent known filename: js/misc/window.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
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
    // The default start-up parameters to provide to RallySportED when we launch it. These may
    // be modified by the user via address parameters, which we parse for in the code below.
    const rsedStartupArgs =
    {
        // Whether edits to the project happen locally on the client or are broadcast onto the
        // server for other participants to see. Server-side editing is only available for
        // projects that have been created on the server specifically for shared editing.
        editMode: "local", // | "shared"

        project:
        {
            // Whether the project's initial data files will be found on the server or on
            // the client. If on the client, an additional property, .dataAsJSON, is expected
            // to provide these data as a JSON string.
            dataLocality: "server", // | "client"

            // A property uniquely identifying this project's data. For server-side projects,
            // this will be a string, and for client-side data a file reference.
            dataIdentifier: "demod",
        }
    };
    
    // Parse any parameters the user supplied on the address line. Generally speaking, these
    // will direct which track's assets RallySportED should load up when it starts.
    {
        const params = new URLSearchParams(window.location.search);

        if (params.has("shared"))
        {
            // Give the input a sanity check.
            if (!(/^[0-9a-z]+$/.test(params.get("shared"))))
            {
                Rsed.throw("Invalid track identifier detected. Can't continue.");
                return;
            }

            rsedStartupArgs.editMode = "shared";
            rsedStartupArgs.project.dataLocality = "server";
            rsedStartupArgs.project.dataIdentifier = params.get("shared");

            // Sanitize input.
            /// TODO.
        }
        // Server-side custom tracks. These have an id string that identifies the track.
        else if (params.has("track"))
        {
            // Give the input a sanity check.
            if (!(/^[0-9a-z]+$/.test(params.get("track"))))
            {
                Rsed.throw("Invalid track identifier detected. Can't continue.");
                return;
            }

            rsedStartupArgs.editMode = "local";
            rsedStartupArgs.project.dataLocality = "server";
            rsedStartupArgs.project.dataIdentifier = params.get("track");
        }
        // Server side original tracks from Rally-Sport's demo. These take a value in the range 1..8,
        // corresponding to the eight tracks in the demo.
        else if (params.has("original"))
        {
            // Give the input a sanity check.
            if (!(/^[1-8]+$/.test(params.get("original"))))
            {
                Rsed.throw("Invalid track identifier detected. Can't continue.");
                return;
            }

            const trackId = parseInt(params.get("original"), 10);
            Rsed.assert && ((trackId >= 1) &&
                            (trackId <= 8))
                        || Rsed.throw("The given track id is out of bounds.");

            rsedStartupArgs.editMode = "local";
            rsedStartupArgs.project.dataLocality = "server";
            rsedStartupArgs.project.dataIdentifier = ("demo" + String.fromCharCode("a".charCodeAt(0) + trackId - 1));
        }
    }

    Rsed.core.run(rsedStartupArgs);
}

window.close_dropdowns = function()
{
    const dropdowns = document.getElementsByClassName("dropdown_list");
    for (let i = 0; i < dropdowns.length; i++)
    {
        if (dropdowns[i].classList.contains("show")) dropdowns[i].classList.toggle("show");
    }

    RSED_DROPDOWN_ACTIVATED = false;
    Rsed.ui_input_n.reset_mouse_hover_info();
}

// Disable the right-click browser menu, since we want to use the right mouse button for other things.
window.oncontextmenu = function(event)
{
    if (RSED_DROPDOWN_ACTIVATED)
    {
        window.close_dropdowns();
        return false;
    }

    if (event.target.id !== Rsed.core.render_surface_id()) return;

    // Display a right-click menu for changing the type of the prop under the cursor.
    if (!Rsed.shared_mode_n.enabled() &&
        (Rsed.ui_input_n.mouse_hover_type() === Rsed.ui_input_n.mousePickingType.prop) &&
        !Rsed.core.current_project().props.name(Rsed.ui_input_n.mouse_hover_args().idx).toLowerCase().startsWith("finish")) /// Temp hack. Disallow changing any prop's type to a finish line, which is a special item.
    {
        const propDropdown = document.getElementById("prop-dropdown");
        propDropdown.style.transform = "translate(" + (RSED_MOUSE_POS.x - 40) + "px, " + (RSED_MOUSE_POS.y - 0) + "px)";
        propDropdown.classList.toggle("show");

        RSED_DROPDOWN_ACTIVATED = true;
    }

    return false;
}

// The program uses onmousedown for primary click processing, but onclick is used here
// to close any open dropdown lists.
window.onclick = function(event)
{
    if (RSED_DROPDOWN_ACTIVATED &&
        (event.target.id === Rsed.core.render_surface_id()))
    {
        window.close_dropdowns();
        return false;
    }
}

window.onmousedown = function(event)
{
    switch (event.button)
    {
        case 0: Rsed.ui_input_n.set_left_click(true); break;
        case 1: Rsed.ui_input_n.set_middle_click(true); break;
        case 2: Rsed.ui_input_n.set_right_click(true); break;
        default: break;
    }
}

window.onmouseup = function(event)
{
    switch (event.button)
    {
        case 0: Rsed.ui_input_n.set_left_click(false); break;
        case 1: Rsed.ui_input_n.set_middle_click(false); break;
        case 2: Rsed.ui_input_n.set_right_click(false); break;
        default: break;
    }
}

window.onmousemove = function(event)
{
    if (event.target.id !== Rsed.core.render_surface_id())
    {
        /// Temp hack. Prevent mouse clicks over prop dropdown dialogs from falling through and
        /// inadvertently editing the terrain.
        if (Rsed.ui_input_n.mouse_hover_type() !== Rsed.ui_input_n.mousePickingType.prop)
        {
            Rsed.ui_input_n.reset_mouse_hover_info();
        }

        return;
    }

    if (!RSED_DROPDOWN_ACTIVATED)
    {
        RSED_MOUSE_POS.x = (event.clientX - event.target.getBoundingClientRect().left);
        RSED_MOUSE_POS.y = (event.clientY - event.target.getBoundingClientRect().top);

        Rsed.ui_input_n.set_mouse_pos(Math.floor(RSED_MOUSE_POS.x * Rsed.core.scaling_multiplier()),
                                      Math.floor(RSED_MOUSE_POS.y * Rsed.core.scaling_multiplier()));
    }
}

window.onkeydown = function(event)
{
    Rsed.ui_input_n.update_key_status(event, true);

    /// Temp hack. Process some of the key presses here, for convenience.
    {
        if (event.repeat) return;

        switch (event.keyCode)
        {
            case "q": case 81: Rsed.ui_view_n.toggle_view("2d-topdown", "3d"); break;
            case "w": case 87: Rsed.ui_view_n.show3dWireframe = !Rsed.ui_view_n.show3dWireframe; break;
            case "a": case 65: Rsed.ui_view_n.showPalatPane = !Rsed.ui_view_n.showPalatPane; break;
            case "r": case 82: Rsed.ui_view_n.toggle_view("3d", "3d-topdown"); break;
            case "l": case 76: Rsed.core.current_project().maasto.bulldoze(window.prompt("Level the terrain to a height of...")); break;
            case "b": case 66: Rsed.ui_view_n.hideProps = !Rsed.ui_view_n.hideProps; break;
            case "spacebar": case 32: Rsed.ui_brush_n.brushSmoothens = !Rsed.ui_brush_n.brushSmoothens; event.preventDefault(); break;
            case "1": case 49: Rsed.ui_brush_n.set_brush_size(0); break;
            case "2": case 50: Rsed.ui_brush_n.set_brush_size(1); break;
            case "3": case 51: Rsed.ui_brush_n.set_brush_size(2); break;
            case "4": case 52: Rsed.ui_brush_n.set_brush_size(3); break;
            case "5": case 53: Rsed.ui_brush_n.set_brush_size(8); break;
            case "tab": case 9: event.preventDefault(); break;
            default: break;
        }
    }
}

window.onkeyup = function(event)
{
    Rsed.ui_input_n.update_key_status(event, false);
}

// Gets called when something is dropped onto RallySportED's render canvas. We expect
// the drop to be a zip file containing the files of a RallySportED project for us to
// load up. If it's not, we'll ignore the drop.
window.drop_handler = function(event)
{
    // Don't let the browser handle the drop.
    event.preventDefault();

    // See if the drop delivers a zip file.
    const zipFile = Array.from(event.dataTransfer.items, (item)=>item.getAsFile())
                         .filter(file=>(file != null))
                         .filter(file=>(file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase() === "zip"))
                         [0] || null;

    if (!zipFile)
    {
        Rsed.log("The drop contained no RallySportED zip files. Ignoring it.");
        return;
    }

    // Launch RallySportED with project data from the given zip file.
    Rsed.core.run(
    {
        editMode: "local",
        project:
        {
            dataLocality: "client",
            dataIdentifier: zipFile,
        }
    });

    // Clear the address bar's parameters to reflect the fact that the user has loaded a local
    // track resource instead of specifying a server-side resource via the address bar.
    const basePath = (window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1));
    window.history.replaceState({}, document.title, basePath);
}
/*
 * Most recent known filename: js/main.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 */

"use strict";

Rsed.core = (function()
{
    // Set to true while the core is running (e.g. as a result of calling run()).
    let isRunning = false;

    // The number of frames per second being generated.
    let programFPS = 0;

    // The project we've currently got loaded. When the user makes edits or requests a save,
    // this is the target project.
    let project = Rsed.project.placeholder;

    const renderScalingMultiplier = 0.25;

    // Whether to display an FPS counter to the user.
    const fpsCounterEnabled = (()=>
    {
        const params = new URLSearchParams(window.location.search);
        return (params.has("showFramerate") && (Number(params.get("showFramerate")) === 1));
    })();

    const htmlUI = (function()
    {
        const uiContainer = new Vue(
        {
            el: "#html-ui",
            data:
            {
                // The display name of the track that's currently open in the editor.
                trackName: "",

                propList: [],

                // Whether the UI should be displayed or kept invisible at this time.
                uiVisible: false,
            },
            methods:
            {
                // Called when the user selects a prop from the prop dropdown menu.
                /// TODO: Needs to be somewhere more suitable, and named something more descriptive.
                activate_prop: function(name = "")
                {
                    Rsed.core.current_project().props.change_prop_type(Rsed.core.current_project().track_id(),
                                                                       Rsed.ui_input_n.mouse_hover_args().trackId,
                                                                       Rsed.core.current_project().props.id_for_name(name));
                    window.close_dropdowns();

                    return;
                },
                
                refresh: function()
                {
                    this.trackName = Rsed.core.current_project().name;
                    this.propList = Rsed.core.current_project().props.names()
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

    // The canvas we'll render into.
    const canvas =
    {
        width: 0,
        height: 0,
        scalingFactor: 0.25,
        element: document.getElementById("render-canvas"),
    };

    Rsed.assert && (canvas.element != null)
                || Rsed.throw("Failed to find a canvas element to render into.");

    const publicInterface =
    {
        // Starts up RallySportED with the given project to edit.
        run: async function(startupArgs = {})
        {
            Rsed.assert && ((typeof startupArgs.project.dataLocality !== "undefined") &&
                            (typeof startupArgs.editMode !== "undefined"))
                        || Rsed.throw("Missing startup parameters for launching RallySportED.");

            isRunning = false;

            // Hide the UI while we load up the project's data etc.
            htmlUI.set_visible(false);

            verify_browser_compatibility();

            await load_project(startupArgs);

            Rsed.ui_draw_n.prebake_palat_pane();

            htmlUI.refresh();
            htmlUI.set_visible(true);

            isRunning = true;
            tick();
        },

        // Terminate RallySporED with an error message.
        panic: function(errorMessage)
        {
            //renderer.indicate_error(errorMessage);
            //renderer.remove_callbacks();
            htmlUI.set_visible(false);
            isRunning = false;
            this.run = ()=>{};
        },

        current_project: ()=>
        {
            Rsed.assert && (project !== null)
                        || Rsed.throw("Attempting to access an uninitialized project.");

            return project;
        },
        
        is_running: ()=>isRunning,
        render_width: ()=>canvas.width,
        render_height: ()=>canvas.height,
        renderer_fps: ()=>programFPS,
        render_surface_id: ()=>canvas.element.getAttribute("id"),
        fps_counter_enabled: ()=>fpsCounterEnabled,
        scaling_multiplier: ()=>renderScalingMultiplier,
        mouse_pick_buffer_value_at: (x, y)=>0,//renderer.mouse_pick_buffer_value_at(x, y),
    }

    return publicInterface;

    // Called once per frame to orchestrate program flow.
    function tick(timestamp = 0, frameDeltaMs = 0)
    {
        if (!isRunning) return;

        programFPS = Math.round(1000 / (frameDeltaMs || 1));

        // Poll and process user input.
        Rsed.ui_input_n.enact_inputs();

        // Render the next frame.
        {
            const trackMesh = Rsed.worldBuilder().track_mesh({x: Math.floor(Rsed.camera_n.pos_x()),
                                                              y: 0,
                                                              z: Math.floor(Rsed.camera_n.pos_z())});

            const isTopdownView = (Rsed.ui_view_n.current_view() === "3d-topdown");

            const renderInfo = Rngon.render(canvas.element.getAttribute("id"), [trackMesh],
            {
                cameraPosition: Rngon.translation_vector(0, 0, 0),
                cameraDirection: Rngon.rotation_vector((isTopdownView? 90 : 21), 0, 0),
                scale: canvas.scalingFactor,
                fov: 45,
            });

            // If the rendering was resized since the previous frame...
            if ((renderInfo.renderWidth !== canvas.width ||
                (renderInfo.renderHeight !== canvas.height)))
            {
                canvas.width = renderInfo.renderWidth;
                canvas.height = renderInfo.renderHeight;

                // The PALAT pane needs to adjust to the new size of the canvas.
                Rsed.ui_draw_n.prebake_palat_pane();
            }

            Rsed.ui_draw_n.draw_ui(canvas.element);
        }

        window.requestAnimationFrame((time)=>tick(time, (time - timestamp)));
    }

    // Test various browser compatibility factors, and give the user messages of warning where appropriate.
    function verify_browser_compatibility()
    {
        // We expect to export projects with JSZip using blobs.
        /// TODO: Doesn't need to be checked in shared mode, since it doesn't use JSZip for saving.
        if (!JSZip.support.blob)
        {
            alert("NOTE: This browser doesn't support saving RallySportED projects. Any changes you make to a track in this session will be lost.");
        }
    }

    async function load_project(args = {})
    {
        Rsed.assert && ((typeof args.editMode !== "undefined") &&
                        (typeof args.project.dataIdentifier !== "undefined"))
                    || Rsed.throw("Missing required arguments for loading a project.");
            
        if (args.editMode === "shared")
        {
            await Rsed.shared_mode_n.register_as_participant_in_project(startupArgs.project.dataIdentifier);
        }
        else
        {
            Rsed.shared_mode_n.unregister_current_registration();
        }

        project = await Rsed.project(args.project);

        Rsed.apply_manifesto(project);
        
        Rsed.camera_n.reset_camera_position();

        Rsed.palette.set_palette(project.track_id() === 4? 1 :
                                 project.track_id() === 7? 3 : 0);

        /// TODO. This needs to be implemented in a better way and/or somewhere
        /// else - ideally so you don't have to manually start the poll loop;
        /// so you don't risk starting it twice or whatever.
        if (Rsed.shared_mode_n.enabled())
        {
            Rsed.shared_mode_n.start_polling_server();
        }
    }
})();
