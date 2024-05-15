'use strict';

export var scriptProperties = createScriptProperties()
    .addCheckbox({
        name: 'enabled',
        label: 'Enable settings',
        value: true
    })
    .addSlider({
        name: 'speed',
        label: 'Settings open speed',
        value: 0.1,
        min: 0,
        max: 1,
        integer: false
    })
    
    .finish();

const maxClickTime = 250; //in ms

export function init() {
    shared.miSettingsOpen = shared.miSettingsVisible = thisLayer.visible = false;
    shared.miMaxCLickTime = maxClickTime;
    shared.miSettingsOpenSpeed = scriptProperties.speed;
}

export function cursorEnter(event) {
    shared.miSettingsVisible = thisLayer.visible = true && scriptProperties.enabled;
}

export function cursorLeave(event) {
    shared.miSettingsVisible = thisLayer.visible = false || shared.miSettingsOpen;
}

let timer;

export function cursorDown(event) {
    timer = Date.now();
}

export function cursorUp(event) {
    if (Date.now() - timer < maxClickTime) {
        shared.miSettingsOpen = !shared.miSettingsOpen && scriptProperties.enabled;
        shared.miSettingsOpenSpeed = scriptProperties.speed;
    }    
}