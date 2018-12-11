const test_matrix44 = function()
{
    unit_tester_n.test_unit("Matrix (4x4)", function()
    {
        {
            const m = matrix44_n.identity_matrix();
            unit_tester_n.require(m.length === 16 && (m[0]===1 && m[4]===0 && m[ 8]===0 && m[12]===0 &&
                                m[1]===0 && m[5]===1 && m[ 9]===0 && m[13]===0 &&
                                m[2]===0 && m[6]===0 && m[10]===1 && m[14]===0 &&
                                m[3]===0 && m[7]===0 && m[11]===0 && m[15]===1),
                                "Valid identity matrix.");
        }
        
        {
            const m = matrix44_n.rotation_matrix(1.6572, 0.3457, 874665.5247);
            unit_tester_n.require(m.length === 16 && (unit_tester_n.tr4(m[0])===-0.5131 && unit_tester_n.tr4(m[4])===-0.7886 && unit_tester_n.tr4(m[ 8])===-0.3389 && unit_tester_n.tr4(m[12])===0.0000 && 
                                unit_tester_n.tr4(m[1])===0.1118  && unit_tester_n.tr4(m[5])===0.3300  && unit_tester_n.tr4(m[ 9])===-0.9373 && unit_tester_n.tr4(m[13])===0.0000 && 
                                unit_tester_n.tr4(m[2])===0.8510  && unit_tester_n.tr4(m[6])===-0.5188 && unit_tester_n.tr4(m[10])===-0.0812 && unit_tester_n.tr4(m[14])===0.0000 && 
                                unit_tester_n.tr4(m[3])===0.0000  && unit_tester_n.tr4(m[7])===0.0000  && unit_tester_n.tr4(m[11])===0.0000  && unit_tester_n.tr4(m[15])===1.0000),
                                "Valid rotation matrix.");
        }

        {
            const m = matrix44_n.translation_matrix(452.8541, 2.5412, 8745.1645);
            unit_tester_n.require(m.length === 16 && (unit_tester_n.tr4(m[0])===1.0000 && unit_tester_n.tr4(m[4])===0.0000 && unit_tester_n.tr4(m[ 8])===0.0000 && unit_tester_n.tr4(m[12])===452.8541  && 
                                unit_tester_n.tr4(m[1])===0.0000 && unit_tester_n.tr4(m[5])===1.0000 && unit_tester_n.tr4(m[ 9])===0.0000 && unit_tester_n.tr4(m[13])===2.5412    && 
                                unit_tester_n.tr4(m[2])===0.0000 && unit_tester_n.tr4(m[6])===0.0000 && unit_tester_n.tr4(m[10])===1.0000 && unit_tester_n.tr4(m[14])===8745.1645 && 
                                unit_tester_n.tr4(m[3])===0.0000 && unit_tester_n.tr4(m[7])===0.0000 && unit_tester_n.tr4(m[11])===0.0000 && unit_tester_n.tr4(m[15])===1.0000),
                                "Valid translation matrix.");
        }

        {
            const m = matrix44_n.perspective_matrix(0.7545, 1.7155, 0.9138, 97852.8647);
            unit_tester_n.require(m.length === 16 && (unit_tester_n.tr4(m[0])===1.4712 && unit_tester_n.tr4(m[4])===0.0000 && unit_tester_n.tr4(m[ 8])===0.0000 && unit_tester_n.tr4(m[12])===0.0000  && 
                                unit_tester_n.tr4(m[1])===0.0000 && unit_tester_n.tr4(m[5])===2.5238 && unit_tester_n.tr4(m[ 9])===0.0000 && unit_tester_n.tr4(m[13])===0.0000  && 
                                unit_tester_n.tr4(m[2])===0.0000 && unit_tester_n.tr4(m[6])===0.0000 && unit_tester_n.tr4(m[10])===1.0000 && unit_tester_n.tr4(m[14])===-1.8276 && 
                                unit_tester_n.tr4(m[3])===0.0000 && unit_tester_n.tr4(m[7])===0.0000 && unit_tester_n.tr4(m[11])===1.0000 && unit_tester_n.tr4(m[15])===0.0000),
                                "Valid perspective matrix.");
        }

        {
            const m = matrix44_n.screen_space_matrix(4567.2434, 3.1284);
            unit_tester_n.require(m.length === 16 && (unit_tester_n.tr4(m[0])===2283.6217 && unit_tester_n.tr4(m[4])===0.0000  && unit_tester_n.tr4(m[ 8])===0.0000 && unit_tester_n.tr4(m[12])===2283.1217 && 
                                unit_tester_n.tr4(m[1])===0.0000    && unit_tester_n.tr4(m[5])===-1.5642 && unit_tester_n.tr4(m[ 9])===0.0000 && unit_tester_n.tr4(m[13])===1.0642    && 
                                unit_tester_n.tr4(m[2])===0.0000    && unit_tester_n.tr4(m[6])===0.0000  && unit_tester_n.tr4(m[10])===1.0000 && unit_tester_n.tr4(m[14])===0.0000    && 
                                unit_tester_n.tr4(m[3])===0.0000    && unit_tester_n.tr4(m[7])===0.0000  && unit_tester_n.tr4(m[11])===0.0000 && unit_tester_n.tr4(m[15])===1.0000),
                                "Valid screen-space matrix.");
        }

        {
            const m = matrix44_n.multiply_matrices(matrix44_n.translation_matrix(452.8541, 2.5412, 8745.1645),
                                                    matrix44_n.perspective_matrix(0.7545, 1.7155, 0.9138, 97852.8647));
            unit_tester_n.require(m.length === 16 && (unit_tester_n.tr4(m[0])===1.4712 && unit_tester_n.tr4(m[4])===0.0000 && unit_tester_n.tr4(m[ 8])===452.8541  && unit_tester_n.tr4(m[12])===0.0000  && 
                                unit_tester_n.tr4(m[1])===0.0000 && unit_tester_n.tr4(m[5])===2.5238 && unit_tester_n.tr4(m[ 9])===2.5412    && unit_tester_n.tr4(m[13])===0.0000  && 
                                unit_tester_n.tr4(m[2])===0.0000 && unit_tester_n.tr4(m[6])===0.0000 && unit_tester_n.tr4(m[10])===8746.1645 && unit_tester_n.tr4(m[14])===-1.8276 && 
                                unit_tester_n.tr4(m[3])===0.0000 && unit_tester_n.tr4(m[7])===0.0000 && unit_tester_n.tr4(m[11])===1.0000    && unit_tester_n.tr4(m[15])===0.0000),
                                "Valid matrix multiplication.");
        }
    });
}
