'use strict';

export var scriptProperties = createScriptProperties()
	.addSlider({
		name: 'fadeSpeed',
		label: 'Fade speed',
		value: 1,
		min: 0,
		max: 3,
		integer: false
	})
	.finish();

let initValue, parent, initParent;

export function update() {
	shared.miTextBgColorFadeSpeed = scriptProperties.fadeSpeed;
	return Math.max(0, Math.abs(parent.scale.x / initParent.x) * scriptProperties.fadeSpeed - (scriptProperties.fadeSpeed - 1)) * initValue;
}

export function init(value) {
	initValue = value;
	parent = thisLayer.getParent();
	initParent = parent.scale;
	shared.miTextBgColorFadeSpeed = scriptProperties.fadeSpeed;
	shared.miInitTextBgColorAlpha = value;
}