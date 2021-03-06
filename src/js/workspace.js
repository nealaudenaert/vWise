define(function (require) {

    var Marionette = require('marionette');
    var _ = require('underscore');
    var WindowView = require('./window');


    function WindowStack() {
        this.windows = [];

        _.bindAll(this, 'push', 'remove', 'focus', 'close', 'clear', 'update');
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

            win.on('close', function () {
                this.close(win);
            }, this);
        },

        remove: function (win) {
            var index = this.windows.indexOf(win);

            if (index === -1) {
                return false;
            }

            // removed window should no longer be active
            this.windows[index].setActive(false);

            this.windows.splice(index, 1);

            // set current last window active in case we just removed the last one.
            if (!_.isEmpty(this.windows)) {
                _.last(this.windows).setActive(true);
            }

            return true;
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

            this.update();
        },

        close: function (win) {
            if (!this.remove(win)) {
                return false;
            }
            win.destroy();
            this.update();
            return true;
        },

        clear: function () {
            _.invoke(this.windows, 'destroy');
            this.windows = [];
        },

        update: function () {
            _.each(this.windows, function (win, zIndex) {
                win.setZIndex(zIndex);
            });
        },

        toArray: function () {
            return this.windows.slice();
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

        initialize: function (options) {
            var opts = _.defaults(options || {}, {

            });

            if (!opts.typeLoader) {
                throw new TypeError('no type loader provided');
            }

            _.extend(this, _.pick(opts, 'typeLoader'));

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

        closeAll: function () {
            this.windowStack.clear();
        },

        addSearchProvider: function (keywords, provider) {
            if (!_.isArray(keywords)) {
                keywords = [keywords];
            }

            _.each(keywords, function (keyword) {
                if (_.has(this.searchProviders, keyword)) {
                    throw new Error(keyword + ' search provider is already registered');
                }

                if (!this.defaultSearchProvider) {
                    this.defaultSearchProvider = provider;
                }

                this.searchProviders[keyword] = provider;
            }, this);
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
                var parts = q.split(/(?:\:\s*|\s+)/);

                var provider = this.defaultSearchProvider;
                if (parts.length > 1 && _.has(this.searchProviders, parts[0])) {
                    var keyword = parts.shift();
                    provider = this.searchProviders[keyword];
                }

                var query = parts.join(' ').trim();
                var _this = this;
                var workspaceSize = this.getSize();
                provider.search(query).then(function (results) {
                    _.each(results, function (result) {
                        var w = _this.createWindow({
                            title: result.title
                        });

                        w.setSize(result.width, result.height);
                        var randX = Math.random() * (workspaceSize.width - result.width);
                        var randY = Math.random() * (workspaceSize.height - result.height);
                        w.setPosition(Math.max(0, randX), Math.max(0, randY));
                        w.show(result.content);

                        if (result.lockAspectRatio) {
                            w.lockAspectRatio();
                        }
                    });
                    _this.windowStack.update();
                }).catch(function (err) {
                    console.error(err);
                    alert('unable to display search results');
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
        },

        getSize: function () {
            return {
                width: this.$el.width(),
                height: this.$el.height()
            };
        },

        getState: function () {
            return {
                windows: this.windowStack.toArray().map(function (win) {
                    return {
                        opts: win.toJSON(),
                        contents: win.getContents() && win.getContents().toJSON()
                    };
                })
            };
        },

        setState: function (memento) {
            // this.windowStack.clear();

            _.each(memento.windows, function (attrs) {
                var win = this.createWindow(attrs.opts);
                var content = this.typeLoader.load(attrs.contents);
                win.show(content);
            }, this);
        }
    });

    return Workspace;

});
