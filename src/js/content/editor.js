define(function (require) {

    var Marionette = require('marionette'),
        _          = require('underscore');


    var EditorContentView = Marionette.ItemView.extend({
        template: _.constant('<textarea class="editor"></textarea>'),

        onAttach: function () {
            this.$('.editor').ckeditor({
                inline: true,
                removePlugins: 'elementspath'
            });
        }

    });

    return EditorContentView;

});
