'use strict';
/**
 *
 * @module features\base
 * @description
 instances of features are connected to one another to make a chain of responsibility for handling all the input to the hypergrid.
 *
 */

var Base = require('./Base.js');

function ThumbwheelScrolling() {
    Base.call(this);
    this.alias = 'ThumbwheelScrolling';
};

ThumbwheelScrolling.prototype = Object.create(Base.prototype);

/**
* @function
* @instance
* @description
 handle this event down the feature chain of responsibility
 * @param {fin-hypergrid} grid - [fin-hypergrid](module-._fin-hypergrid.html)
 * @param {Object} event - the event details
*/
ThumbwheelScrolling.handleWheelMoved = function(grid, e) {
    if (!grid.resolveProperty('scrollingEnabled')) {
        return;
    }
    var primEvent = e.primitiveEvent;
    var deltaY = primEvent.wheelDeltaY || -primEvent.deltaY;
    var deltaX = primEvent.wheelDeltaX || -primEvent.deltaX;
    if (deltaY > 0) {
        grid.scrollBy(0, -1);
    } else if (deltaY < -0) {
        grid.scrollBy(0, 1);
    } else if (deltaX > 0) {
        grid.scrollBy(-1, 0);
    } else if (deltaX < -0) {
        grid.scrollBy(1, 0);
    }
};


module.exports = ThumbwheelScrolling;
