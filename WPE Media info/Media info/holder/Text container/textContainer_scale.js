'use strict';

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addCheckbox({
        name: 'media',
        label: 'Media based detection',
        value: true
    })
    .addCheckbox({
		name: 'invert',
		label: 'Invert',
		value: false
	})
    .addSlider({
        name: 'min',
        label: 'Min value',
        value: 0,
        min: 0,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'max',
        label: 'Max value',
        value: 1,
        min: 0,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'timerIn',
        label: 'Fade in timer',
        value: 0.5,
        min: 0,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'timerOut',
        label: 'Fade out timer',
        value: 0.5,
        min: 0,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'fadeInDur',
        label: 'Fade in duration',
        value: 0.155,
        min: 0,
        max: 2,
        integer: false
    })
    .addSlider({
        name: 'fadeOutDur',
        label: 'Fade out duration',
        value: 0.2,
        min: 0,
        max: 2,
        integer: false
    })
    .addSlider({
        name: 'timerSwitch',
        label: 'Flip timer',
        value: 0.08,
        min: 0,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'switchDur',
        label: 'Flip duration',
        value: 0.125,
        min: 0,
        max: 2,
        integer: false
    })
    .finish();

const vecToggles = new Vec3(1, 0, 0); //1 enabled, 0 disabled
const audioBuffer = engine.registerAudioBuffers(16);
let state, oldState, target, dur = 0, isVector, stopTimeout, pos, oldPos, flip, oldSettings = false, oldTextVisible = true, cursor, oldCursor = false;

export function update(value) {
	if (oldState == undefined) {
        oldState = state;
        target = (state && shared.miTextPos != 3) ^ scriptProperties.invert ? scriptProperties.max : scriptProperties.min;
        target = shared.miTextPos == 1 || shared.miTextPos == 2 && oldPos ? target : -target;
        return target = isVector ? lerp(value, new Vec3(target), vecToggles) : target;
    }
    
    pos = thisLayer.getTransformMatrix().m[12] > engine.canvasSize.x / 2;
    if (!scriptProperties.media) state = !!audioBuffer.average.reduce((a, b) => a + b) ^ scriptProperties.invert;
    cursor = shared.miCursorIn ^ scriptProperties.invert;

    flip = pos != oldPos;
    const textVisibleChange = shared.miTextVisible != oldTextVisible;
    const settingsChange = oldSettings != shared.miSettingsOpen;
    const cursorChange = cursor != oldCursor;
    
    if (oldState != state || flip || settingsChange || textVisibleChange || cursorChange){
        if (stopTimeout) stopTimeout();
        oldState = state;
        
        let fadeDur, targ, timer;
        if (state && !shared.miSettingsOpen && shared.miTextVisible && shared.miTextPos != 3 || shared.miSettingsOpen && !shared.miTextVisible || cursor && shared.miTextPos == 3 && !shared.miSettingsOpen && state && shared.miTextVisible) {
            timer = flip ? scriptProperties.timerSwitch : scriptProperties.timerIn;
            fadeDur = scriptProperties.fadeInDur;
            targ = scriptProperties.max;
        } else {
            timer = flip ? scriptProperties.timerSwitch : scriptProperties.timerOut;
            fadeDur = scriptProperties.fadeOutDur;
            targ = scriptProperties.min;
        }
        if (settingsChange || textVisibleChange || cursorChange) {
            timer = !cursor ^ scriptProperties.invert && cursorChange ? scriptProperties.timerOut : 0;
            fadeDur = !cursor ^ scriptProperties.invert && cursorChange ? scriptProperties.fadeOutDur : shared.miSettingsOpenSpeed;
        }

        stopTimeout = engine.setTimeout(() => {setTarget(targ, fadeDur)}, timer * 1000);
        
        oldCursor = cursor;
        oldTextVisible = shared.miTextVisible;
        oldSettings = shared.miSettingsOpen;
        oldPos = pos;
    }
    
    return shared.miTextContainerScale = lerp(value, target, dur);
}

function setTarget(targ, fadeDur) {
    target = shared.miTextPos == 1 || (shared.miTextPos >= 2 && pos) ? targ : -targ;
    target = isVector ? new Vec3(target) : target;
	dur = engine.frametime / Math.max(0.0001, flip ? scriptProperties.switchDur : fadeDur);
    dur = isVector ? vecToggles.multiply(dur) : dur;
}

function lerp(a, b, value) {
    if (isVector) {
        const x = WEMath.mix(a.x, b.x, value.x);
        const y = WEMath.mix(a.y, b.y, value.y);
        const z = WEMath.mix(a.z, b.z, value.z);
        return new Vec3(x, y, z);
    }
    return WEMath.mix(a, b, value);
}

export function init(value) {
	isVector = value.hasOwnProperty("x");
	dur = isVector ? new Vec3(dur) : dur;
    oldPos = thisLayer.getTransformMatrix().m[12] > engine.canvasSize.x / 2;
    shared.miTextContainerScale = value;
    shared.miTextPos = localStorage.get("miTextPos");
    shared.miTextPos = shared.miTextPos == undefined ? 2 : shared.miTextPos;

    if (!scriptProperties.media) state = !!audioBuffer.average.reduce((a, b) => a + b) ^ scriptProperties.invert;
}

export function mediaPlaybackChanged(event) {
    if (scriptProperties.media) state = event.state == 1 ^ scriptProperties.invert;
}