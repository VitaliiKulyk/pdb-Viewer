var modelBuilder = (function () {
    
    var getModel = function (atoms, connections, scene) {
        var uniqueElements = _.uniq(_.map(_.flatten(atoms), function (value) {
            return value.element;
        }));

        atoms = _.each(atoms, function (value) { //atom = value
            var index = uniqueElements.indexOf(value.element);
            value.color = config.colors[index];
            return value;
        });

        getAtomModels(atoms, scene);
        getConnectionModels(atoms, connections, scene);
    }

    var getAtomModels = function (atoms, scene) {
        _.each(atoms, function (atom) {
            var geometry = new THREE.SphereGeometry(0.3, 15, 15);
            var texture = THREE.ImageUtils.loadTexture(config.fileTexture);
            texture.anisotropy = 8;
            var color = atom.color;
            var material = new THREE.MeshPhongMaterial({ map: texture, color: color });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            var position = atom.position;
            mesh.position.set(position.x, position.y, position.z);
            scene.add(mesh);
        });
    }

    var getConnectionModels = function (atoms, connections, scene) {
        _.each(connections, function (value) { //atom = value
            var atom1 = _.find(atoms, function (num) {
                return num.number == value[0];
            });
            var atom2 = _.find(atoms, function (num) {
                return num.number == value[1];
            });

            var material = new THREE.LineBasicMaterial({ color: 0xFFFFCC });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(atom1.position.x, atom1.position.y, atom1.position.z),
                new THREE.Vector3(atom2.position.x, atom2.position.y, atom2.position.z)
            );
            var line = new THREE.Line(geometry, material);
            scene.add(line);
        });
    }

    return {
        getModel: getModel
    }
})();