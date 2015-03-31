define(function (require) {

    var Marionette = require('marionette');
    var Promise = require('promise');
    var $ = require('jquery');
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



    var KEY_ESC = 27;

    var SearchForm = Marionette.ItemView.extend({
        template: _.constant('<input type="search" class="search" placeholder="quick search"><button type="submit">Search</button>'),
        id: 'search-form',
        tagName: 'form',

        events: {
            submit: function (e) {
                e.preventDefault();
                var query = this.$('.search').val();
                this.trigger('search', query);
            },

            keyup: function (e) {
                if (e.which === KEY_ESC) {
                    e.preventDefault();
                    this.trigger('close');
                }
            }
        },

        focus: function () {
            this.$('.search').focus();
        },

        onShow: function () {
            this.focus();
        }
    });


    var Workspace = Marionette.ItemView.extend({
        template: _.constant(''),
        className: 'workspace',

        initialize: function () {
            this.windowStack = new WindowStack();
            this.searchProviders = {};
        },

        createWindow: function (options) {
            var win = new WindowView(options);
            this.windowStack.push(win);

            // borrowed from marionette's collection view
            this.$el.append(win.render().el);
            Marionette.triggerMethodOn(win, 'show');

            return win;
        },

        addSearchProvider: function (keyword, provider) {
            if (_.has(this.searchProviders, keyword)) {
                throw new Error(keyword + ' search provider is already registered');
            }

            if (!this.defaultSearchProvider) {
                this.defaultSearchProvider = provider;
            }

            this.searchProviders[keyword] = provider;
        },

        toggleSearchBox: function () {
            if (this.searchForm) {
                this.closeSearchBox();
            } else {
                this.openSearchBox();
            }
        },

        openSearchBox: function () {
            if (this.searchForm) {
                this.searchForm.focus();
                return;
            }

            this.searchForm = new SearchForm();
            this.$el.append(this.searchForm.render().el);
            Marionette.triggerMethodOn(this.searchForm, 'show');

            this.listenToOnce(this.searchForm, 'search', function (q) {
                var parts = q.split(/:\s*/);

                var provider = this.defaultSearchProvider;
                if (parts.length > 1 && _.has(this.searchProviders, parts[0])) {
                    var keyword = parts.shift();
                    provider = this.searchProviders[keyword];
                }

                var query = parts.join(' ');
                var _this = this;
                provider.search(query).then(function (results) {
                    _.each(results, function (result) {
                        var w = _this.createWindow({
                            title: result.title
                        });

                        w.setSize(result.width, result.height);
                        w.setPosition(_this.$el.width() * Math.random(), _this.$el.height() * Math.random());
                        w.show(result.content);

                        if (result.lockAspectRatio) {
                            w.lockAspectRatio();
                        }
                    });

                });

                this.closeSearchBox();
            });

            this.listenToOnce(this.searchForm, 'close', this.closeSearchBox);
        },

        closeSearchBox: function () {
            if (!this.searchForm) {
                return;
            }

            this.searchForm.destroy();
            this.searchForm = null;
        }
    });

    return Workspace;

});
