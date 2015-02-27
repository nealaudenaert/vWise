var windowStack = [];

$('.window').each(function (i, w) {
    windowStack.push(w);
});


interact('.window > .title-bar')
    .draggable({
        onmove: function(evt) {
            var target = $(evt.target).parent(),
                x = (target.data('x') || 0) + evt.dx,
                y = (target.data('y') || 0) + evt.dy;

            target
                .css({ left: x, top: y })
                .data({ x: x, y: y });
        }
    });

$('.window').on('mousedown', function () {
    // move current (active) window to the top
    windowStack.splice(windowStack.indexOf(this), 1);
    windowStack.push(this);

    // reorder windows by z-index
    var i = windowStack.length;
    while (i--) {
        $(windowStack[i]).css('z-index', i);
    }
});

interact('.window')
    .resizable(true)
    .on('resizemove', function(evt) {
        var target = $(evt.target);

        target
            .width(target.width() + evt.dx)
            .height(target.height() + evt.dy);
    });
