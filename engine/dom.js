$(document).on('change', '.btn-file :file', function () {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});

$(document).ready(function () {
    $('.btn-file :file').on('fileselect', function (event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });
});

$(window).resize(function () {
    var div = document.getElementById("molecula");
    var W = parseInt(div.clientWidth);
    var H = parseInt(document.documentElement.clientHeight - div.offsetTop - 20);
    $("#webjs").width(W).height(H);
    renderer.setSize(W, H);
});

document.addEventListener('mousemove', sceneBuilder.mouseMove, false);

var showTable = function(){
    $('#table').show();
    $('#molecula').hide();
}

var showModel = function () {
    $('#table').hide();
    $('#molecula').show();
}