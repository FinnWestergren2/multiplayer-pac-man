import * as p5 from 'p5';

export default function sketch(p: p5) {
    console.log(p);
    let rotationY = 0;
    let rotationX = 0;

    p.setup = function () {
        p.createCanvas(600, 400, p.WEBGL);
    };

    p.draw = function () {
        p.background(100);
        p.normalMaterial();
        p.noStroke();
        p.push();
        p.rotateY(rotationY);
        p.rotateX(rotationX);
        p.box(100);
        p.pop();
    };

    p.mouseWheel = (e: { delta: number}) => {
        rotationY += e.delta * Math.PI / 180;
    }

    p.mousePressed = () => {
        rotationX += 5 * Math.PI / 180;
    }
};