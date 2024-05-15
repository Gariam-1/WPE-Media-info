'use strict';

let initValue, parent;

export function update(value) {
    value.y = initValue.y * Math.sign(-parent.origin.y);
    thisLayer.verticalalign = parent.origin.y < 0 ? "top" : "bottom";
    return value;
}

export function init(value) {
    initValue = value;
    parent = thisLayer.getParent();
}