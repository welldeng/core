/* eslint-env browser */

'use strict';

var grid;

window.onload = function() {
    var Hypergrid = fin.Hypergrid;

    var data = [
        { value: 3 },
        { value: 4 },
        { value: -4 },
        { value: 5 }
    ];
    grid = new Hypergrid('div#example');
    grid.setBehavior({ Behavior: fin.Hypergrid.behaviors.JSON, data: data });

    grid.behavior.dataModel.getFields().push('squared');
    grid.behavior.dataModel.getHeaders().push('squared');
    grid.behavior.dataModel.getCalculators().push(square);
    grid.repaint();

    function square(dataRow, columnName) {
        return dataRow.value * dataRow.value;
    }
};

