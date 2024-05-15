'use strict';

let initValue, parent, initParent, container, initContainer;

export function update(value) {
    value.x = initValue.x / Math.max(0.001, Math.abs(parent.scale.x * container.scale.x)) * initParent.x * initContainer.x;
    return value;
}

export function init(value) {
    parent = thisLayer.getParent();
    container = parent.getParent();
    initParent = parent.scale;
    initContainer = container.scale;
    initValue = value;
}