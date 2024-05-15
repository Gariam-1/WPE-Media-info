'use strict';

let initContainer;

export function update() {
    const mixValue = Math.max(0, Math.abs(shared.miTextContainerScale.x / initContainer.x) * shared.miTextBgColorFadeSpeed - (shared.miTextBgColorFadeSpeed - 1)) * shared.miInitTextBgColorAlpha;
    return shared.miPrimaryColor.mix(shared.miTextBgColor, mixValue);
}

export function init() {
    initContainer = shared.miTextContainerScale;
}