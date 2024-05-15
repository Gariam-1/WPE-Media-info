'use strict';

export function mediaPlaybackChanged(event) {
    if (event.state == 2 && !shared.miSettingsVisible) thisObject.getAnimation().play();
}

export function init() {
  return 0;
}