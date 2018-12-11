const test_texture = function()
{
    unit_tester_n.test_unit("Texture", function()
    {
        // Creating a texture.
        {
            const w = 1;
            const h = 2;
            const pixels = [new color_n.rgba_o(1, 2, 3), new color_n.rgba_o(4, 5, 6)];
            const texture = new texture_n.texture_o(w, h, pixels);

            unit_tester_n.require((texture.width === w && texture.height === h && texture.pixels.length === (w * h)),
                                  "Set texture's resolution.");
            unit_tester_n.require((texture.pixels[0].r === pixels[0].r &&
                                   texture.pixels[0].g === pixels[0].g &&
                                   texture.pixels[0].b === pixels[0].b &&
                                   texture.pixels[1].r === pixels[1].r &&
                                   texture.pixels[1].g === pixels[1].g &&
                                   texture.pixels[1].b === pixels[1].b), "Set texture's pixels.");

            pixels[0].r = Number(!pixels[0].r);
            unit_tester_n.require((texture.pixels[0].r !== pixels[0].r), "Copy texture pixel data by value, not by reference.");
        }
    });
}
