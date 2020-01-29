var shapeCount = 1;

var canvas=document.getElementById("canvas");
var ctx = document.getElementById('canvas').getContext('2d');

// load image
var img = new Image;
img.src = "test.jpg";

img.onload = function() {
    canvas.width = 500;
    canvas.height = 334;
    ctx.drawImage(img,0,0, img.width, img.height, 0, 0, 500, 334);
};

// jquery ui slider
$(document).ready(function(){
    var handle = $( "#custom-handle" );
    $( "#shapes" ).slider({
        orientation: "horizontal",
        range: "min",
        min: shapeCount, //only init
        max: 20,
        value: shapeCount,
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
            shapeCount = ui.value;

            // generate points
            var area = $('.points');
            area.empty(); //clear draggable points

            // generate color extract list
            var list = $('ul');
            list.empty();

            // var dimens = getImageDimension().current;

            for (var i = 1; i <= shapeCount; i++){
                // calc random coordinates
                // const widthRand = Math.random() * (dimens.width - 1) + 1;
                // const heightRand = Math.random() * (dimens.height - 1) + 1;

                // generate random place point
                // var generateElem = '<div class="point" data-x="'+widthRand+'" data-y="'+heightRand+'" style="transform: translate('+widthRand+'px, '+heightRand+'px);">'+i+'</div>';

                area.append('<div class="point" data-index="'+i+'">'+i+'</div>');

                list.append(createColorCode(i, 'null'));
            }
        }
    });


    // test
    // context.getImageData(X, Y, 1, 1).data;
    // test

});

function rgba2hex(orig) {
    var a, isPercent,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = 01;
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;

    return hex;
}

function createColorCode(idx, rgba) {
    return '<li data-index="'+idx+'" class="row" style="align-items: center;">' +
        '                    <div class="color"></div>\n' +
        '                    <div class="idx-num">'+idx+'</div>\n' +
        '                    <div class="code">#'+rgba2hex(rgba)+'</div>\n' +
        '                </li>';
}


/*function getImageDimension() {
    var img = $('.img')[0];
    return {
        real: {
            width: img.naturalWidth,
            height: img.naturalHeight,
        },
        current: {
            width: img.offsetWidth,
            height: img.offsetHeight,
        }
    };
}*/

function convertPointColorToRGB(ctxData){
    return 'rgba('+ctxData[0]+','+ctxData[1]+','+ctxData[2]+', '+(ctxData[3] / 255.0)+')';
}

function changeColorCode(idx, color){
    var calcColor = '#' + rgba2hex(color);
    $('li[data-index="'+idx+'"] .color').css('background', calcColor);
    $('li[data-index="'+idx+'"] .code').text(calcColor);
}

function generateGradient(){
    //    background-image: linear-gradient(color-stop1, color-stop2, ...);

    var total = $('ul li').length;
    var colorIterate = "";
    $("ul li").each(function(index) {
        if ($(this).find('.code').text() !== '#nullff'){
            colorIterate += $(this).find('.code').text() + (index !== total - 1 ? ", " : "");
        }
    });

    $('.result').css('background-image', 'linear-gradient(to right, ' + colorIterate + ')');
}

// set points area img current dimension
var points = document.getElementsByClassName('points')[0];
// points.style.width = getImageDimension().current.width;
// points.style.height = getImageDimension().current.height;

interact('.point')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,
        // call this function on every dragmove event
        onmove: dragMoveListener,
    });

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    var idx = target.getAttribute('data-index');
    var calcColor = convertPointColorToRGB(ctx.getImageData(x, y, 1, 1).data);

    console.log(idx, calcColor);

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // set 1x1 pixel's color to point elements
    target.setAttribute('data-color', calcColor);
    changeColorCode(idx, calcColor);

    // generate gradient
    generateGradient();
}
