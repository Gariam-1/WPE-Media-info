'use strict';

let animation, parent;

export function init() {
    animation = thisLayer.getTextureAnimation();
    animation.stop();
    parent = thisLayer.getParent();
    animation.setFrame(shared.miDragable * 1);
}

export function cursorClick(event) {
    if (parent.visible) {
        shared.miDragable = !shared.miDragable;
        localStorage.set("miDragable", shared.miDragable);
        animation.setFrame(shared.miDragable * 1);
    }
}