define(function (require) {

    var Marionette = require('marionette'),
        _          = require('underscore');


    var EditorContentView = Marionette.ItemView.extend({
        template: _.constant('<textarea class="editor"></textarea>'),

        initialize: function (options) {
            var opts = _.defaults(options || {}, {
                val: ''
            });

            this.initialValue = opts.val;
        },

        onAttach: function () {
            this.$('.editor')
                .ckeditor({
                    inline: true,
                    removePlugins: 'elementspath'
                })
                .val(this.initialValue);
        },

        toJSON: function () {
            return {
                type: EditorContentView.TYPE,
                opts: { val: this.$('.editor').val() }
            };
        }

    });

    _.extend(EditorContentView, {
        TYPE: 'editor'
    });

    return EditorContentView;

});
