define(function (require) {

    var Marionette = require('marionette'),
        interact   = require('interact'),
        _          = require('underscore');


    var WindowView = Marionette.LayoutView.extend({
        template: require('templates/window.html'),
        className: 'window',

        regions: {
            content: 'content'
        },

        templateHelpers: function () {
            return {
                title: this.title
            };
        },

        triggers: {
            mousedown: 'focus'
        },

        initialize: function (options) {
            var opts = _.defaults(options || {}, {
                title: 'untitled'
            });

            _.extend(this, _.pick(opts, 'title'));

            this._isShown = false;
        },

        show: function (view) {
            this.getRegion('content').show(view);
        },

        onRender: function () {
            var _this = this;

            interact(this.$('> .title-bar').get(0)).draggable({
                onmove: function (evt) {
                    var position = _this.getPosition();
                    _this.setPosition(position.x + evt.dx, position.y + evt.dy);
                }
            });

            interact(this.el).resizable(true)
                .on('resizemove', function (evt) {
                    var size = _this.getSize();
                    _this.setSize(size.width + evt.dx, size.height + evt.dy);
                });

            if (this.x) {
                this.$el.css('left', this.x);
            }

            if (this.y) {
                this.$el.css('top', this.y);
            }

            if (this.width) {
                this.$el.width(this.width);
            }

            if (this.height) {
                this.$el.height(this.height);
            }

            if (this.zIndex) {
                this.$el.css('z-index', this.zIndex);
            }

            this._isShown = true;
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;

            if (this._isShown) {
                this.$el.css({ left: x, top: y });
            }
        },

        getPosition: function () {
            return {
                x: this.x || 0,
                y: this.y || 0
            };
        },

        setSize: function (width, height) {
            this.width = width;
            this.height = height;

            if (this._isShown) {
                this.$el.width(width).height(height);
            }
        },

        getSize: function () {
            return {
                width: this.width || (this._isShown ? this.$el.width() : 0),
                height: this.height || (this._isShown ? this.$el.height() : 0)
            };
        },

        setZIndex: function (zIndex) {
            this.zIndex = zIndex;

            if (this._isShown) {
                this.$el.css('z-index', zIndex);
            }
        },

        getZIndex: function () {
            return this.zIndex;
        }
    });



    function WindowStack() {
        this.windows = [];
    }

    _.extend(WindowStack.prototype, {
        push: function (win) {
            this.windows.push(win);

            win.on('focus', function () {
                this.focus(win);
            }, this);
        },

        remove: function (win) {
            var index = this.windows.indexOf(win);

            if (index === -1) {
                return;
            }

            this.windows.splice(index, 1);
        },

        focus: function (win) {
            var index = this.windows.indexOf(win);

            if (index === -1) {
                return;
            }

            // move focused window to the top
            this.windows.splice(index, 1);
            this.windows.push(win);

            this._update();
        },

        _update: function () {
            _.each(this.windows, function (win, zIndex) {
                win.setZIndex(zIndex);
            });
        }
    });


    var Workspace = Marionette.ItemView.extend({
        template: _.constant(''),
        className: 'workspace',

        initialize: function () {
            this.windowStack = new WindowStack();
        },

        createWindow: function (options) {
            var win = new WindowView(options);
            this.windowStack.push(win);

            // borrowed from marionette's collection view
            this.$el.append(win.render().el);
            Marionette.triggerMethodOn(win, 'show');

            return win;
        }
    });




    var workspace = new Workspace({ el: '.workspace' });
    for (var i = 0; i < 3; i++) {
        var w = workspace.createWindow({ title: i });
        w.setPosition(i * 30, i * 30);
        w.setSize(200, 200);
    }
});
