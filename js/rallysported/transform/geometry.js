/*
 * Most recent known filename: js/geometry.js
 *
 * Tarpeeksi Hyvae Soft 2018 /
 * RallySportED-js
 *
 * Functions to do with space; like vectors, vertices, etc.
 *
 */

"use strict";

Rsed.geometry_n = {};
{
    Rsed.geometry_n.vector2_o = function(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    Rsed.geometry_n.vector3_o = function(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;

        this.cross = function(other = Rsed.geometry_n.vector3_o)
        {
            Rsed.assert && (other instanceof Rsed.geometry_n.vector3_o)
                        || Rsed.throw("Expected a vector.");

            const c = new Rsed.geometry_n.vector3_o();

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

    Rsed.geometry_n.vertex_o = function(x = 0, y = 0, z = 0, w = 1, u = 0, v = 0)
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
            Rsed.assert && (m.length === 16)
                        || Rsed.throw("Expected a 4 x 4 matrix to transform the vertex by.");
            
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

    Rsed.geometry_n.polygon_o = function(numVertices = 3)
    {
        Rsed.assert && ((numVertices > 2) &&
                        (numVertices < 10))
                    || Rsed.throw("Bad vertex count.");

        this.verts = new Array(numVertices).fill().map(()=>new Rsed.geometry_n.vertex_o());
        this.color = new Rsed.color_n.rgba_o();
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
            Rsed.assert && ((otherPolygon instanceof Rsed.geometry_n.polygon_o) &&
                            (this.verts.length === otherPolygon.verts.length))
                        || Rsed.throw("Incompatible polygons for cloning.");

            // Vertices.
            for (let i = 0; i < otherPolygon.verts.length; i++)
            {
                this.verts[i].x = otherPolygon.verts[i].x;
                this.verts[i].y = otherPolygon.verts[i].y;
                this.verts[i].z = otherPolygon.verts[i].z;
                this.verts[i].w = otherPolygon.verts[i].w;

                this.verts[i].u = otherPolygon.verts[i].u;
                this.verts[i].v = otherPolygon.verts[i].v;
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
            if (this.verts.length === 3) // For triangles.
            {
                // Based on https://stackoverflow.com/a/35280392.
                {
                    const ax = (this.verts[0].x - this.verts[1].x);
                    const ay = (this.verts[0].y - this.verts[1].y);
                    const bx = (this.verts[0].x - this.verts[2].x);
                    const by = (this.verts[0].y - this.verts[2].y);
                    const cz = ((ax * by) - (ay * bx));

                    return (cz >= 0);
                }
            }
            else
            {
                return true;
            }
        };
        
        // Transform the polygon's vertices by the given matrix.
        this.transform = function(m = [])
        {
            Rsed.assert && (m.length === 16)
                        || Rsed.throw("Expected a 4 x 4 matrix to transform the polygon by.");
            
            for (let i = 0; i < this.verts.length; i++)
            {
                this.verts[i].transform(m);
            }
        };
        
        this.perspective_divide = function()
        {
            for (let i = 0; i < this.verts.length; i++)
            {
                this.verts[i].x /= this.verts[i].w;
                this.verts[i].y /= this.verts[i].w;
                this.verts[i].z /= this.verts[i].w;
            }
        };
    }

    Rsed.geometry_n.polygon_mesh_o = function(polygons = [Rsed.geometry_n.polygon_o],
                                         translation = new Rsed.geometry_n.vector3_o(0, 0, 0),
                                         rotation = new Rsed.geometry_n.vector3_o(0, 0, 0))
    {
        Rsed.assert && (polygons.length > 0)
                    || Rsed.throw("Expected a non-empty list of polygons.");

        Rsed.assert && (translation instanceof Rsed.geometry_n.vector3_o)
                    || Rsed.throw("Expected a translation vector.");

        Rsed.assert && (rotation instanceof Rsed.geometry_n.vector3_o)
                    || Rsed.throw("Expected a rotation vector.");

        this.polygons = [];
        for (let i = 0; i < polygons.length; i++)
        {
            Rsed.assert && (polygons[i] instanceof Rsed.geometry_n.polygon_o)
                        || Rsed.throw("Expected a polygon.");

            const newPoly = new Rsed.geometry_n.polygon_o(polygons[i].verts.length);
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
            const m = Rsed.matrix44_n.multiply_matrices(Rsed.matrix44_n.translation_matrix(this.translationVec.x, this.translationVec.y, this.translationVec.z),
                                                        Rsed.matrix44_n.rotation_matrix(this.rotationVec.x, this.rotationVec.y, this.rotationVec.z));

            Rsed.assert && (m.length === 16)
                        || Rsed.throw("Expected to return a 4 x 4 object space matrix.");
                        
            return m;
        }

        // Sorts the mesh's polygons from farthest to closest.
        this.sort_vertices_by_depth = function()
        {
            const sort_by_z = function(a, b)
            {
                const d1 = (a.verts[0].z + a.verts[1].z + a.verts[2].z);
                const d2 = (b.verts[0].z + b.verts[1].z + b.verts[2].z);

                return (d1 < d2);
            };

            this.polygons.sort(sort_by_z);
        }
    }
}
