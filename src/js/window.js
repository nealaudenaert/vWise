define(function (require) {

    var Marionette = require('marionette');
    var interact = require('interact');
    var _ = require('underscore');

    var WindowView = Marionette.LayoutView.extend({
        template: require('templates/window.html'),
        className: 'window',

        regions: {
            content: '> .content'
        },

        templateHelpers: function () {
            return {
                title: this.title,
                autoHeight: this.autoHeight
            };
        },

        triggers: {
            mousedown: 'focus',
            'click .close': 'close'
        },

        initialize: function (options) {
            var opts = _.defaults(options || {}, {
                title: 'untitled',
                autoHeight: false
            });

            _.extend(this, _.pick(opts, 'autoHeight', 'title'));

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

            interact(this.el).resizable({
                    edges: {
                        bottom: this.autoHeight ? false : '.resize-handle',
                        right: '.resize-handle'
                    }
                })
                .on('resizemove', function (evt) {
                    var size = _this.getSize();

                    var width  = size.width + evt.dx,
                        height = size.height + evt.dy;

                    // area based aspect ratio normalization
                    if (!_this.autoHeight && _this.aspectRatio) {
                        var targetArea = width * height;

                        // let r = w / h
                        //
                        // solve h = w / r
                        //
                        // let A = x * y
                        //       = x * (x / r)
                        //       = x^2 / r
                        //
                        // solve x == sqrt(A*r)
                        width = Math.sqrt(targetArea * _this.aspectRatio);
                        height = width / _this.aspectRatio;
                    }

                    _this.setSize(width, height);
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

            if (!this.autoHeight && this.height) {
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

            this.trigger('change:position', this, x, y);
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
                this.$el.width(width);

                if (!this.autoHeight) {
                    this.$el.height(height);
                }
            }

            this.trigger('change:size', this, width, height);
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

            this.trigger('change:zIndex', this, zIndex);
        },

        getZIndex: function () {
            return this.zIndex;
        },

        setActive: function (active) {
            if (active) {
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            }

            this.trigger('change:active', this, active ? true : false);
        },

        lockAspectRatio: function () {
            this.aspectRatio = this.width / this.height;
        },

        unlockAspectRatio: function () {
            this.aspectRatio = null;
        }
    });

    return WindowView;

});
