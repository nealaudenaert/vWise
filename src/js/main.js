/*global interact $*/
interact('.window > .title-bar')
    .draggable({
        restrict: {
            restriction: '.workspace',
            elementRect: { top: 0, bottom: 1, left: 0, right: 1 }
        },

        onmove: function(evt) {
            var target = $(evt.target).parent(),
                x = (target.data('x') || 0) + evt.dx,
                y = (target.data('y') || 0) + evt.dy;

            target
                .css({ left: x, top: y })
                .data({ x: x, y: y });
        }
    });

interact('.window')
    .resizable({
        restrict: {
            restriction: 'parent',
            elementRect: { top: 0, bottom: 1, left: 0, right: 1 }
        }
    })
    .on('resizemove', function(evt) {
        var target = $(evt.target);

        target
            .width(target.width() + evt.dx)
            .height(target.height() + evt.dy);
    });
