const test_color = function()
{
    unit_tester_n.test_unit("Color", function()
    {
        {
            const c = new color_n.rgba_o(1, 2, 3);
            unit_tester_n.require((c.a == 255), "Alpha channel should default to 255.");
        }

        unit_tester_n.require(((new color_n.rgba_o(132, 7, 99)).to_hex()==="#840763"),
                            "Color conversion from RGB to hex.");

        unit_tester_n.reject(function(){ new color_n.rgba_o(-132, 7, 99); },
                            "Reject invalid color arguments: blue underflow.");
        unit_tester_n.reject(function(){ new color_n.rgba_o(132, 256, 0); },
                            "Reject invalid color arguments: green overflow.");
        unit_tester_n.reject(function(){ new color_n.rgba_o(132, 989965312314, 0); },
                            "Reject invalid color arguments: green overflow.");
        unit_tester_n.reject(function(){ new color_n.rgba_o(0, 0, 0, 256); },
                            "Reject invalid color arguments: alpha overflow.");
    });
}
