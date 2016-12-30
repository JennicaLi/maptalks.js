import { isArray } from 'core/util';
import Coordinate from 'geo/Coordinate';
import Extent from 'geo/Extent';
import { CenterType } from './Geometry.Center';
import { Painter } from 'renderer/vectorlayer/Painter';
import * as Symbolizers from 'renderer/vectorlayer/symbolizers';

/**
 * @classdesc
 * Represents a Point type Geometry.
 * @class
 * @category geometry
 * @extends Geometry
 * @mixes Geometry.Center
 * @param {Coordinate} center      - center of the marker
 * @param {Object} [options=null]           - construct options defined in [Marker]{@link Marker#options}
 * @example
 * var marker = new Marker([100, 0], {
 *     'id' : 'marker0',
 *     'symbol' : {
 *         'markerFile'  : 'foo.png',
 *         'markerWidth' : 20,
 *         'markerHeight': 20,
 *     },
 *     'properties' : {
 *         'foo' : 'value'
 *     }
 * });
 */
export const Marker = Geometry.extend(/** @lends Marker.prototype */ {
    includes: [CenterType],

    type: 'Point',

    options: {
        'symbol': {
            'markerType': 'path',
            'markerPath': [{
                'path': 'M8 23l0 0 0 0 0 0 0 0 0 0c-4,-5 -8,-10 -8,-14 0,-5 4,-9 8,-9l0 0 0 0c4,0 8,4 8,9 0,4 -4,9 -8,14z M5,9 a3,3 0,1,0,0,-0.9Z',
                'fill': '#DE3333'
            }],
            'markerPathWidth': 16,
            'markerPathHeight': 23,
            'markerWidth': 24,
            'markerHeight': 34
        }
    },

    initialize: function (coordinates, opts) {
        if (coordinates && !(coordinates instanceof Coordinate)) {
            coordinates = new Coordinate(coordinates);
        }
        this._coordinates = coordinates;
        this._initOptions(opts);
    },

    /**
     * Can be edited, only marker with a vector symbol, vector path symbol or a image symbol can be edited.
     * @return {Boolean}
     * @private
     */
    _canEdit: function () {
        var symbol = this._getInternalSymbol();
        if (isArray(symbol)) {
            return false;
        }
        return Symbolizers.VectorMarkerSymbolizer.test(symbol) || Symbolizers.VectorPathMarkerSymbolizer.test(symbol) ||
            Symbolizers.ImageMarkerSymbolizer.test(symbol);
    },

    _containsPoint: function (point) {
        var pxExtent = this._getPainter().get2DExtent();
        return pxExtent.contains(point);
    },

    _computeExtent: function () {
        var coordinates = this.getCenter();
        if (!coordinates) {
            return null;
        }
        return new Extent(coordinates, coordinates);
    },

    _computeGeodesicLength: function () {
        return 0;
    },

    _computeGeodesicArea: function () {
        return 0;
    },

    _getSprite: function (resources) {
        if (this._getPainter()) {
            return this._getPainter().getSprite(resources);
        }
        return new Painter(this).getSprite(resources);
    }
});
