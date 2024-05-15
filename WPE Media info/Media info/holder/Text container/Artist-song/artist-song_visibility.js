'use strict';

let parent;

export function update(value) {
    if (shared.miSettingsOpen && Math.abs(parent.scale.x) < shared.miTextVisibleTriggerValue) value = false;
    else if (!shared.miSettingsOpen && Math.abs(parent.scale.x) < shared.miTextVisibleTriggerValue) value = true;
    return shared.miTextVisible = value;
}

export function init() {
    parent = thisLayer.getParent();
    shared.miTextVisible = true;
}