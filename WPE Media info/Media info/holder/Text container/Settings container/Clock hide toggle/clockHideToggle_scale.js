'use strict';

let animation, parent;

export function init() {
    animation = thisLayer.getTextureAnimation();
    animation.stop();
    parent = thisLayer.getParent();
    animation.setFrame(shared.miShowClock);
}

export function cursorClick(event) {
    if (parent.visible) {
        shared.miShowClock = (shared.miShowClock + 1) % 3;
        localStorage.set("miShowClock", shared.miShowClock);
        animation.setFrame(shared.miShowClock);
    }
}