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

footstepSound.playbackRate = 2;
footstepSound.volume = 0.1;

forestBackgroundSound.loop = true;
forestBackgroundSound.volume = 0.05;

stoneButtonSound.loop = false;
stoneButtonSound.playbackRate = 1.0; 
stoneButtonSound.volume = 0.05;