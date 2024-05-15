'use strict';

export var scriptProperties = createScriptProperties()
	.addSlider({
		name: 'dur',
		label: 'Transition duration',
		value: 1,
		min: 0,
		max: 2,
		integer: false
	})
	.finish();

let timer, oldColor = new Vec3(0), newColor = new Vec3(0);

export function update() {
	var color = newColor;

	if (timer < scriptProperties.dur) {
		color = oldColor.mix(newColor, timer / scriptProperties.dur);
		timer += engine.frametime;
		shared.miPrimaryColor = color;
	}

	return color;
}

export function mediaThumbnailChanged(event) {
	timer = 0;
	oldColor = newColor;
	newColor = event.primaryColor;
	shared.miPrimaryColor = newColor;
}

export function init() {
	shared.miPrimaryColor = newColor;
}