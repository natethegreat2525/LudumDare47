function sound(src) {
    let sound = document.createElement("audio");
    sound.src = src;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    return sound; 
}

export const forestBackgroundSound = sound('./forest_birds.mp3');
export const footstepSound = sound('./footstep.mp3');
export const stoneButtonSound = sound('./scape_stone.mp3');
export const gravelCrumbleSound = sound('./gravel_crumble.mp3');
export const whistleSound = sound('./whistle_tune.mp3');
export const mouseSound = sound('./mouse_click.mp3');
export const chirpHigh = sound('./chirp_high.mp3');
export const chirpLow = sound('./chirp_low.mp3');

footstepSound.playbackRate = 1.5;
footstepSound.volume = 0.4;

forestBackgroundSound.loop = true;
forestBackgroundSound.volume = 0.1;

stoneButtonSound.loop = false;
stoneButtonSound.playbackRate = 1.0; 
stoneButtonSound.volume = 0.1;

gravelCrumbleSound.volume = 0.2;
whistleSound.loop = true;
whistleSound.volume = .5;

mouseSound.volume = .8;