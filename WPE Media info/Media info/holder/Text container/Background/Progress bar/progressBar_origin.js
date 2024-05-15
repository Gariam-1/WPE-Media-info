'use strict';

let initValue, parent, initParent;

export function update(value) {
    value.x = initValue.x / Math.max(0.001, parent.scale.x) * initParent.x;
    return value;
}

export function init(value) {
    parent = thisLayer.getParent();
    initParent = parent.scale;
    initValue = value;
}