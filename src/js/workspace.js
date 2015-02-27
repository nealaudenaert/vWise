define(function (require) {

    var Marionette = require('marionette');
    var _ = require('underscore');
    var WindowView = require('./window');


    function WindowStack() {
        this.windows = [];
    }

    _.extend(WindowStack.prototype, {
        push: function (win) {
            if (!_.isEmpty(this.windows)) {
                _.last(this.windows).setActive(false);
            }

            this.windows.push(win);
            win.setActive(true);


            win.on('focus', function () {
                this.focus(win);
            }, this);
        },

        remove: function (win) {
            var index = this.windows.indexOf(win);

            if (index === -1) {
                return;
            }

            // removed window should no longer be active
            this.windows[index].setActive(false);

            this.windows.splice(index, 1);

            // set current last window active in case we just removed the last one.
            if (!_.isEmpty(this.windows)) {
                _.last(this.windows).setActive(true);
            }
        },

        focus: function (win) {
            var index = this.windows.indexOf(win);

            if (index === -1) {
                return;
            }

            // deactivate current window
            if (!_.isEmpty(this.windows)) {
                _.last(this.windows).setActive(false);
            }

            // move focused window to the top
            this.windows.splice(index, 1);
            this.windows.push(win);

            // activate newly focused window
            win.setActive(true);

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

    return Workspace;

});
