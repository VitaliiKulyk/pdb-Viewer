
var core = (function () {

    var drawTable = function (data) {
        $("#tableBody").empty();

        var drawRow = function (rowData) {
            var row = $("<tr />")   
            $("#tableBody").append(row);
            row.append($("<td>" + rowData.element + "</td>"));
            row.append($("<td>" + rowData.position.x + "</td>"));
            row.append($("<td>" + rowData.position.y + "</td>"));
            row.append($("<td>" + rowData.position.z + "</td>"));
        }

        for (var i = 0; i < data.length; i++) {
            drawRow(data[i]);
        }
    }

    var readFile = function (evt) {
        var file = evt.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function () {
                var fileStr = reader.result;
                model = pdbParser.parse(fileStr);
                console.log(model);
                sceneBuilder.renderScene(model);
                drawTable(model.atoms);
            }
            reader.readAsText(file);
        } else
            alert("Failed to load file");
    }
    return {
        readFile: readFile
    }
})();

function init() {

    //initialize containers
    container = document.createElement('webGl');
    container.id = 'webgl';
    var div = document.getElementById("molecula");

    config.W = parseInt(div.clientWidth);
    config.H = parseInt(document.documentElement.clientHeight - div.offsetTop - 20);
    div.appendChild(container);

    //others
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(config.W, config.H);
    renderer.shadowMapEnabled = true;
    container.appendChild(renderer.domElement);
    $("#molecula").hide();
}

window.onload = function () {
    init();
};