import * as p5 from 'p5';

export class Player {
    private locationX: number = 0;
    private locationY: number = 0;
    private size: number = 0;

    private rotation: number = 0;
    
    public constructor(locationX: number, locationY: number, size: number){
        this.locationX = locationX;
        this.locationY = locationY;
        this.size = size;
    }

    public draw: (p: p5) => void = (p) => {
        p.noStroke();
        p.push();
        p.translate(this.locationX, this.locationY);
        p.rotate(this.rotation)
        p.rect(-this.size/2,-this.size/2, this.size, this.size);
        p.pop();
    };

    public rotate: (delta: number) => void = (delta) => this.rotation += delta;
}