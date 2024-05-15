'use strict';

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addCheckbox({
        name: 'enabled',
        label: 'Enabled',
        value: true
    })
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

const vecToggles = new Vec3(0, 1, 0); //1 enabled, 0 disabled
const audioBuffer = engine.registerAudioBuffers(16);
let state, oldState, target, dur = 0, isVector, stopTimeout, pos, oldPos, flip, mediaState = 0, oldSettings = false, oldClockOrientation = 2, parent;

export function update(value) {
	if (oldState == undefined) {
        oldState = state;
        target = state ? scriptProperties.max : scriptProperties.min;
        target = oldPos ? target : -target;
        return target = isVector ? lerp(value, new Vec3(target), vecToggles) : target;
    }

    pos = parent.getTransformMatrix().m[13] > engine.canvasSize.y / 2;
    state = scriptProperties.media ? mediaState : !!audioBuffer.average.reduce((a, b) => a + b);
    state = (!scriptProperties.enabled || state) ^ scriptProperties.invert ^ !scriptProperties.enabled;
    state = (shared.miShowClock == 1 || state) && shared.miShowClock;

    flip = pos != oldPos;
    const settings = shared.miSettingsOpen != oldSettings;
    const orientation = shared.miClockPos != oldClockOrientation;
    if (oldState != state || flip || settings || orientation){
        if (stopTimeout) stopTimeout();
        oldState = state;
        
        let fadeDur, targ, timer;

        if (state || (shared.miSettingsOpen && shared.miShowClock)) {
            timer = flip ? scriptProperties.timerSwitch : scriptProperties.timerIn;
            fadeDur = scriptProperties.fadeInDur;
            targ = scriptProperties.max;
        } else {
            timer = flip ? scriptProperties.timerSwitch : scriptProperties.timerOut;
            fadeDur = scriptProperties.fadeOutDur;
            targ = scriptProperties.min;
        }
        if (settings || orientation) {
            timer = 0;
            fadeDur = shared.miSettingsOpenSpeed;
        }

        stopTimeout = engine.setTimeout(() => {setTarget(targ, fadeDur)}, timer * 1000);
		
		oldClockOrientation = shared.miClockPos;
        oldSettings = shared.miSettingsOpen;
        oldPos = pos;
    }

    return lerp(value, target, dur);
}

function setTarget(targ, fadeDur) {
    target = (pos && shared.miClockPos == 2) || !shared.miClockPos ? targ : -targ;
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
    oldPos = thisLayer.getTransformMatrix().m[13] > engine.canvasSize.y / 2;
    shared.miTextContainerScale = value;
    parent = thisLayer.getParent();
    shared.miShowClock = localStorage.get("miShowClock");
    shared.miShowClock = shared.miShowClock == undefined ? scriptProperties.enabled * 1 : shared.miShowClock;
    shared.miClockPos = localStorage.get("miClockPos");
    shared.miClockPos = shared.miClockPos == undefined ? 2 : shared.miClockPos;

    if (!scriptProperties.media) state = !!audioBuffer.average.reduce((a, b) => a + b) ^ scriptProperties.invert;
}

export function mediaPlaybackChanged(event) {
    mediaState = event.state == 1;
    if (oldState == undefined && scriptProperties.media) state = mediaState ^ scriptProperties.invert;
}