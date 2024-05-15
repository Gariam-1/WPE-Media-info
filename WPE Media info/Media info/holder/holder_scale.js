'use strict';

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addCheckbox({
        name: 'media',
        label: 'Media Based Detection',
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
        value: 0.75,
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
        value: 0.05,
        min: 0,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'timerOut',
        label: 'Fade out timer',
        value: 1.25,
        min: 0,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'fadeInDur',
        label: 'Fade in duration',
        value: 0.25,
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
    .finish();

const vecToggles = new Vec3(1, 1, 1); //1 enabled, 0 disabled
const audioBuffer = engine.registerAudioBuffers(16);
let state, oldState, target, dur = 0, isVector, stopTimeout, oldSettings = false, cursor, oldCursor = false;

export function update(value) {
	if (oldState == undefined) {
		oldState = state;
		target = (state && shared.miTextPos != 3) ^ scriptProperties.invert ? scriptProperties.max : scriptProperties.min;
		return target = isVector ? lerp(value, new Vec3(target), vecToggles) : target;
	}

    if (!scriptProperties.media) state = !!audioBuffer.average.reduce((a, b) => a + b) ^ scriptProperties.invert;
    cursor = shared.miCursorIn ^ scriptProperties.invert;

    if (oldState != state || shared.miSettingsOpen != oldSettings || cursor != oldCursor){
        if (stopTimeout) stopTimeout();
        oldState = state;

        let fadeDur, targ, timer;

        if (state && shared.miTextPos != 3 || shared.miSettingsOpen || cursor && shared.miTextPos == 3 && state) {
            timer = scriptProperties.timerIn;
            fadeDur = scriptProperties.fadeInDur;
            targ = scriptProperties.max;
        } else {
            timer = scriptProperties.timerOut;
            fadeDur = scriptProperties.fadeOutDur;
            targ = scriptProperties.min;
        }
        if (shared.miSettingsOpen != oldSettings) {
            timer = 0;
            fadeDur = shared.miSettingsOpenSpeed;
        }

        stopTimeout = engine.setTimeout(() => {setTarget(targ, fadeDur)}, timer * 1000);

        oldCursor = cursor;
        oldSettings = shared.miSettingsOpen;
    }

    return lerp(value, target, dur);
}

function setTarget(targ, fadeDur) {
    target = isVector ? new Vec3(targ) : targ;
	dur = engine.frametime / Math.max(0.0001, fadeDur);
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
    shared.miCursorIn = false;

    if (!scriptProperties.media) {
		state = !!audioBuffer.average.reduce((a, b) => a + b) ^ scriptProperties.invert;
		target = state ? scriptProperties.max : scriptProperties.min;
    	return target = isVector ? lerp(value, new Vec3(target), vecToggles) : target;
	}
}

export function mediaPlaybackChanged(event) {
    if (scriptProperties.media) state = event.state == 1 ^ scriptProperties.invert;
}

export function cursorEnter(event) {
	shared.miCursorIn = true;
}

export function cursorLeave(event) {
	shared.miCursorIn = false;
}