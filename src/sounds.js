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

footstepSound.playbackRate = 2;
footstepSound.volume = 1;
forestBackgroundSound.loop = true;
forestBackgroundSound.volume = .5;