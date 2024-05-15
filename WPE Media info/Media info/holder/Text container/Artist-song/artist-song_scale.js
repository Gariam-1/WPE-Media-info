'use strict';

let initValue, parent;

export function update(value) {
    value.x = Math.sign(parent.scale.x) * initValue.x;
    thisLayer.horizontalalign = value.x > 0 ? "right" : "left";
    return value;
}

export function init(value) {
    initValue = value;
    parent = thisLayer.getParent();
}