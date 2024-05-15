'use strict';

let initValue, container;

export function update() {
    return initValue.multiply(vecSign(container.scale));
}

export function init(value) {
    container = thisLayer.getParent();
    initValue = value;
}

function vecSign(vec) {
    return new Vec3(Math.sign(vec.x), Math.sign(vec.y), Math.sign(vec.z));
}