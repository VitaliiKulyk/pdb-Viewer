﻿var sceneBuilder = (function () {

    var t = 0;
    var scene, camera, center;

    function getCenter(model) {
        var maxX = _.max(model.atoms, function (atom) { return atom.position.x; }).position.x;
        var minX = _.min(model.atoms, function (atom) { return atom.position.x; }).position.x;
        var maxY = _.max(model.atoms, function (atom) { return atom.position.y; }).position.y;
        var minY = _.min(model.atoms, function (atom) { return atom.position.y; }).position.y;
        var maxZ = _.max(model.atoms, function (atom) { return atom.position.z; }).position.z;
        var minZ = _.min(model.atoms, function (atom) { return atom.position.z; }).position.z;
        config.cameraPositionScale = _.max([maxX - minX, maxY - minY, maxZ - minZ]) * config.cameraScale;
        return {
            x: (maxX + minX) / 2,
            y: (maxY + minY) / 2,
            z: (maxZ + minZ) / 2
        }
    }

    var light = function (x, y, z) {
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(x, y, z);
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 500;
        spotLight.shadowCameraFar = 500;
        spotLight.shadowCameraFov = 100;
        scene.add(spotLight);
    }

    function animate() {
        camera.position.x = center.x + (Math.sin(Math.PI * 2 * t) * config.cameraPositionScale);
        camera.position.y = center.y + (Math.cos(Math.PI * 2 * t) * config.cameraPositionScale);
        camera.position.z = center.z + (Math.cos(Math.PI * 2 * t) * config.cameraPositionScale);
        camera.lookAt(center);
        t += 1 / config.timeStep;
        renderer.render(scene, camera);

        setTimeout(function () {
            requestAnimationFrame(animate);
        }, 1000 / 60);
    }

    var renderScene = function (model) {
        scene = new THREE.Scene();
        modelBuilder.getModel(model.atoms, model.connections, scene);
        center = getCenter(model);
        setCamera();
        light(10, 10, 10);
        light(-10, -10, -10);
        light(10, -10, -10);
        light(-10, 10, 10);
        $("#molecula").show();
        animate();
    }

    var setCamera = function () {
        camera = new THREE.PerspectiveCamera(45, config.W / config.H, 1, 100);
    }

    return {
        renderScene: renderScene
    }
})();