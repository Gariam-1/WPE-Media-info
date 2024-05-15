'use strict';

let animation, parent;

export function init() {
    animation = thisLayer.getTextureAnimation();
    animation.stop();
    parent = thisLayer.getParent();
    animation.setFrame(shared.miTextPos);
}

export function cursorClick(event) {
    if (parent.visible) {
        shared.miTextPos = (shared.miTextPos + 1) % 4;
        localStorage.set("miTextPos", shared.miTextPos);
        animation.setFrame(shared.miTextPos);
    }
}