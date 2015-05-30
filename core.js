var W, H;
var cameraDistance = 10;
var scene;
var model;
var t = 0;
var center, scale;

var core = (function () {
    var fileStr;

    function getCenter(model) {
        var maxX = _.max(model.atoms, function (atom) { return atom.position.x; }).position.x;
        var minX = _.min(model.atoms, function (atom) { return atom.position.x; }).position.x;
        var maxY = _.max(model.atoms, function (atom) { return atom.position.y; }).position.y;
        var minY = _.min(model.atoms, function (atom) { return atom.position.y; }).position.y;
        var maxZ = _.max(model.atoms, function (atom) { return atom.position.z; }).position.z;
        var minZ = _.min(model.atoms, function (atom) { return atom.position.z; }).position.z;
        scale = _.max([maxX - minX, maxY - minY, maxZ - minZ]) * 1.5;
        return {
            x: (maxX + minX) / 2,
            y: (maxY + minY) / 2,
            z: (maxZ + minZ) / 2
        }
    }

    function animate() {
        camera.position.x = center.x + (Math.sin(Math.PI * 2 * t) * scale); //remove this hardcode later
        camera.position.y = center.y + (Math.cos(Math.PI * 2 * t) * scale);
        camera.position.z = center.z + (Math.cos(Math.PI * 2 * t) * scale);
        camera.lookAt(center);
        t += 1 / 1500;
        setTimeout(function () {
            requestAnimationFrame(animate);
        }, 1000 / 60);
        renderer.render(scene, camera);
    }

    var setCamera = function () {
        camera = new THREE.PerspectiveCamera(45, W / H, 1, 100);
    }

    var renderScene = function () {
        modelBuilder.getModel(model.atoms, model.connections, scene);
        center = getCenter(model);
        setCamera();
        light(10, 10, 10);
        light(-10, -10, -10);
        light(10, -10, -10);
        light(-10, 10, -10);
        light(10, 10, -10);
        $("#molecula").show();
        animate();
    }

    var light = function (x, y, z) {
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(x, y, z);
        spotLight.castShadow = true;
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;
        spotLight.shadowCameraNear = 10;
        spotLight.shadowCameraFar = 40;
        spotLight.shadowCameraFov = 30;
        scene.add(spotLight);
    }


    var readFile = function (evt) {
        var file = evt.target.files[0];
        if (file) {
            scene = new THREE.Scene();
            var reader = new FileReader();
            reader.onload = function () {
                fileStr = reader.result;
                model = pdbParser.parse(fileStr);
                console.log(model);
                renderScene();
            }
            reader.readAsText(file);
        } else {
            alert("Failed to load file");
        }
    }
    return {
        readFile: readFile
    }
})();

function init() {
    container = document.createElement('webGl');
    var div = document.getElementById("molecula");
    
    W = parseInt(div.clientWidth);
    H = parseInt(document.documentElement.clientHeight - div.offsetTop - 20);
    div.appendChild(container);

    //others
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(W, H);
    renderer.shadowMapEnabled = true;
    container.appendChild(renderer.domElement);
    $("#molecula").hide();
}

window.onload = function () {
    init();
};