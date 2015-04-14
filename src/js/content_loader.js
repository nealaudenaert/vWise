define(function (require) {

    var _ = require('underscore');

    var Loader = {
        _types: {},

        addType: function (type) {
            this._types[type.TYPE] = type;
        },

        addTypes: function (types) {
            _.each(types, this.addType, this);
        },

        load: function (serialized) {
            if (!_.has(this._types, serialized.type)) {
                throw new TypeError('no type with name [' + serialized.type + '] registered with type loader.');
            }

            return new this._types[serialized.type](serialized.opts);
        }
    };

    return Loader;

});
