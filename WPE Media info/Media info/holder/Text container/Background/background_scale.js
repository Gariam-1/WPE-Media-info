'use strict';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'border',
        label: 'Border',
        value: 0,
        min: -300,
        max: 300,
        integer: false
    })
    .finish();

let artist = "Artist Name R", song = "Song Title R", settings = "Settings Container", corners = "Rounded Corners", initScale;

export function update(value) {
    let width;
    if (!shared.miTextVisible) width = settings.size.x / 2 * Math.abs(settings.scale.x) - settings.origin.x;
    else width = Math.max(artist.size.x * Math.abs(artist.scale.x) - artist.origin.x, song.size.x * Math.abs(song.scale.x) - song.origin.x);

    width -= corners.size.x * Math.min(1, Math.abs(corners.scale.x)) - scriptProperties.border;
    value.x = width / (thisLayer.size.x * initScale.x) * initScale.x;
    return value;
}

export function init(value) {
    artist = thisScene.getLayer(artist);
    song = thisScene.getLayer(song);
    settings = thisScene.getLayer(settings);
    corners = thisScene.getLayer(corners);
    initScale = value;
}