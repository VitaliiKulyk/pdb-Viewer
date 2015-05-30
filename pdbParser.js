var pdbParser = (function () {

    var atom = function (element, number, x, y, z, aminoAcid, chainName, sequenceNumber) {
        this.element = element;
        this.number = number;
        this.position = {
            x: x,
            y: y,
            z: z
        };
        this.aminoAcid = aminoAcid;
        this.chainName = chainName;
        this.sequenceNumber = sequenceNumber;
    }

    var getConnections = function (pdbString) {

        var connections = [];

        // inner function
        var addConnections = function (line) {
            var cursor = 11, step = 5;
            var from = parseInt(line.substr(6, 5));
            for (var i = 0; i < 4; i++) {
                var to = parseInt(line.substr(cursor, step));
                if (to) {
                    connections.push([from, to]);
                }
                cursor += step;
            }
        }

        var makeUniqueConnections = function () {
            var uniqueConnections = [];
            _.each(connections, function (value) {
                if (!_.contains(connections, [value[1], value[0]])) {
                    uniqueConnections.push(value);
                }
            });
            return uniqueConnections;
        }

        // function flow
        var string = pdbString.split("\n");
        for (var i = 0; i < string.length; i++) {
            if (string[i].substr(0, 6) === "CONECT") {
                addConnections(string[i]);
            }
        }

        return makeUniqueConnections();
    }

    var getAtoms = function (pdbString) {
        var atoms = [];
        var string = pdbString.split("\n");
        for (var i = 0; i < string.length; i++) {
            if (string[i].substr(0, 4) === "ATOM" || string[i].substr(0, 6) === "HETATM") {
                var element = string[i].substr(13, 1);
                var number = parseFloat(string[i].substr(9, 2));
                var x = parseFloat(string[i].substr(30, 8));
                var y = parseFloat(string[i].substr(38, 8));
                var z = parseFloat(string[i].substr(46, 8));

                atoms.push(new atom(element, number, x, y, z));
            }
        }
        return atoms;
    }

    var parse = function (pdbString) {
        return {
            atoms: getAtoms(pdbString),
            connections: getConnections(pdbString)
        }
    }

    return {
        parse: parse
    }
})();