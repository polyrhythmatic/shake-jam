var reverb = new Tone.Freeverb(0.2, 0.1);
reverb.wet.value = 0.1;

var shaker = new Tone.Sampler({
    "cabasa": "./samples/shaker/cabasa.mp3",
    "caxixi": "./samples/shaker/caxixi.mp3",
    "maracas": "./samples/shaker/maracas.mp3",
    "shaker": "./samples/shaker/shaker.mp3"
}).chain(reverb, Tone.Master);

var guitar = new Tone.Sampler({
    "1": "./samples/guitar/1.mp3",
    "2": "./samples/guitar/2.mp3",
    "3": "./samples/guitar/3.mp3"
}).chain(reverb, Tone.Master);

var cowbell = new Tone.Sampler({
    "hi": "./samples/cowbell/hi.mp3",
    "med-hi": "./samples/cowbell/med-hi.mp3",
    "med": "./samples/cowbell/med.mp3",
    "low": "./samples/cowbell/low.mp3"
}).chain(reverb, Tone.Master);

var cat = new Tone.Sampler({
    "1": "./samples/cat/meow1.mp3",
    "2": "./samples/cat/meow2.mp3",
    "3": "./samples/cat/hiss.mp3",
    "4": "./samples/cat/meow3.mp3",
    "5": "./samples/cat/meow4.mp3",
    "6": "./samples/cat/purr.mp3",
    "7": "./samples/cat/meow5.mp3",
    "8": "./samples/cat/meow6.mp3"
}).toMaster();
cat.volume.value = -12;

var tambourine = new Tone.Sampler({
    "finger": "./samples/tambourine/finger.mp3",
    "roll": "./samples/tambourine/roll.mp3",
    "shake": "./samples/tambourine/shake.mp3",
    "slap": "./samples/tambourine/slap.mp3"
}).chain(reverb, Tone.Master);

var activeInst = 'shaker';

$("input[name=instrument]:radio").change(function(data) {
    tambourine.triggerAttack("finger", 0, 0);
    activeInst = data.target.id;
});

window.addEventListener('devicemotion', deviceMotionHandler);

var lastTime = Date.now();

function deviceMotionHandler(event) {
    var x = event.acceleration.x;
    var y = event.acceleration.y;
    var z = event.acceleration.z;
    var changeTest = changeDirection(x);

    //console.log(changeTest + " and time " + (Date.now() - lastTime));
    //console.log(x + " and time " + (Date.now() - lastTime));
    //playShaker(x);
    var diff = Math.abs(x);
    //if (Math.abs(x) > threshold) {
    switch (activeInst) {
        case 'guitar':
            playGuitar(diff);
            break;
        case 'cowbell':
            playCowbell(diff);
            break;
        case 'shakers':
            playShaker(diff);
            break;
        case 'cat':
            playCat(diff);
            break;
        case 'tambourine':
            playTambourine(diff);
            break;
    }
    // }

    lastTime = Date.now();
}

var threshold = 20;

var lastMove = Date.now();

var mousePos = 'ul';


playShaker = function(diff) {
    if (Math.abs(diff) > threshold && Date.now() - lastMove > 150) {
        var vel = map(Math.abs(diff), 10, 100, 0, 1);
        //console.log("velocity = " + vel + " and diff = " + diff);
        // if (diff > 0) {
        //     shaker.triggerRelease("cabasa");
        //     shaker.pitch = 0;
        //     shaker.triggerAttack("cabasa", 0, vel);
        // };
        // if (diff < 0) {
        //     shaker.triggerRelease("cabasa");
        //     shaker.pitch = -4;
        //     shaker.triggerAttack("cabasa", 0, vel);
        // };
        switch (mousePos) {
            case 'ul':
                shaker.triggerAttack("cabasa", 0, 1);
                break;
            case 'ur':
                shaker.triggerAttack("caxixi", 0, 1);
                break;
            case 'll':
                shaker.triggerAttack("maracas", 0, 1);
                break;
            case 'lr':
                shaker.triggerAttack("shaker", 0, 1);
                break;
        }

        lastMove = Date.now();
    }
    lastVal = diff;
}

var guitarCount = 1;
playGuitar = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {

        if (guitarCount > 3) {
            guitarCount = 1;
        }
        guitar.triggerAttack(guitarCount);
        guitarCount++;

        lastMove = Date.now();
    }
    lastVal = diff;
}

var triggerSpace = 150;

playTambourine = function(diff) {
    if (diff > threshold && Date.now() - lastMove > triggerSpace) {
        switch (mousePos) {
            case 'ul':
                tambourine.triggerAttack("finger", 0, 1);
                break;
            case 'ur':
                tambourine.triggerAttack("roll", 0, 1);
                break;
            case 'll':
                tambourine.triggerAttack("shake", 0, 1);
                break;
            case 'lr':
                tambourine.triggerAttack("slap", 0, 1);
                break;
        }

        lastMove = Date.now();
    }
    lastVal = diff;
}

playCowbell = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {
            cowbell.triggerAttack("low", 0, 1);
        lastMove = Date.now();
    }
    lastVal = diff;
}

var triggerTimeout = 200;
var catCount = 1;
playCat = function(diff) {
    if (diff > threshold && Date.now() - lastMove > triggerTimeout) {

        if (catCount > 8) {
            catCount = 1;
        }
        cat.triggerAttack(catCount);
        catCount++;

        lastMove = Date.now();
    }
    lastVal = diff;
}


map = function(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

var lastXVal;
var shakeDir;
changeDirection = function(val) {
    var lastDir = shakeDir;
    if (val - lastXVal > 4) {
        shakeDir = 'forward';
    } else if (val - lastXVal < 4) {
        shakeDir = 'backward';
    }
    var returnVal = lastXVal;
    lastXVal = val;
    if (shakeDir != lastDir) {
        return returnVal - val;
    } else {
        return false;
    }
}
