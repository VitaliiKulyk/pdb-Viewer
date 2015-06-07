var modelHelper = (function () {
    var getAtomByPosition = function (model, atomPosition) {
        var result;
        model.atoms.map(function (atom) {
            if (atom.position.x === atomPosition.x &&
                atom.position.y === atomPosition.y &&
                atom.position.z === atomPosition.z) 
                    result = atom;
        });
        return result;
    }

    return {
        getAtomByPosition: getAtomByPosition
    }
})();