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

footstepSound.playbackRate = 1.5;
footstepSound.volume = 0.2;

forestBackgroundSound.loop = true;
forestBackgroundSound.volume = 0.05;

stoneButtonSound.loop = false;
stoneButtonSound.playbackRate = 1.0; 
stoneButtonSound.volume = 0.05;

gravelCrumbleSound.volume = 0.5;
whistleSound.loop = true;
whistleSound.volume = .3;

mouseSound.volume = .5;