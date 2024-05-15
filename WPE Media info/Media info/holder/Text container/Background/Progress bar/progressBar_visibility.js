'use strict';

const trigger = 0.05;
let parent;

export function update(value) {
    if (shared.miSettingsOpen && Math.abs(parent.scale.x) < trigger) value = false;
    else if (!shared.miSettingsOpen && Math.abs(parent.scale.x) < trigger) value = true;
    return shared.miTextVisible = value;
}

export function init() {
    parent = thisLayer.getParent().getParent();
    shared.miTextVisible = true;
    shared.miTextVisibleTriggerValue = trigger;
}