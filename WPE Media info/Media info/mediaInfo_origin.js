'use strict';

export var scriptProperties = createScriptProperties()
    .addCheckbox({
        name: 'isMovable',
        label: 'Is movable',
        value: false
    })
    .finish();

const storageName = "storedPosMICRounded";
let isDragging = false, dragOffset, timer;

export function cursorDown(event) {
    timer = Date.now();
    isDragging = true;
    dragOffset = thisLayer.origin.subtract(event.worldPosition);
}

export function cursorUp(event) {
    isDragging = false;
    localStorage.set(storageName, thisLayer.origin);
}

export function cursorMove(event) {
    const overClick = Date.now() - timer > 100;
    if (!overClick) dragOffset = thisLayer.origin.subtract(event.worldPosition);

    if (isDragging && scriptProperties.isMovable && shared.miDragable && overClick) {
        thisLayer.origin = event.worldPosition.add(dragOffset);
    }
}

export function init() {
    shared.miDragable = localStorage.get("miDragable");
    shared.miDragable = shared.miDragable == undefined ? scriptProperties.isMovable : shared.miDragable;
    return localStorage.get(storageName) || thisLayer.origin;
}