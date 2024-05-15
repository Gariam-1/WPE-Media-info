'use strict';

let animation, parent;

export function init() {
    animation = thisLayer.getTextureAnimation();
    animation.stop();
    parent = thisLayer.getParent();
    animation.setFrame(shared.miClockPos);
}

export function cursorClick(event) {
    if (parent.visible) {
        shared.miClockPos = (shared.miClockPos + 1) % 3;
        localStorage.set("miClockPos", shared.miClockPos);
        animation.setFrame(shared.miClockPos);
    }
}