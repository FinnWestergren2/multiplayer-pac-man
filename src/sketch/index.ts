import * as p5 from "p5";
import { Player } from "./Player";
import * as Loader from "../utils/mapLoader/loader";
import CellTypes from "../utils/mapLoader/cellTypes";

export default function sketch(p: p5) {
	const players: Player[] = [];

	p.setup = function (): void {
		Loader.load().then((response: CellTypes[][]) => {
			p.createCanvas(400, 400);
			const cols = response[2][2];
			const size = Math.min(p.width/(cols * Math.sqrt(2)), p.height/(cols * Math.sqrt(2)));
			for(let i = 1; i < cols; i++){
				for(let j = 1; j < cols; j++){
					const x = j * p.width/(cols);
					const y = i * p.height/(cols);
					players.push(new Player(x,y,size));
				}
			}
		});
	};

	p.draw = function () {
		p.background(0);
		players.forEach(pl => pl.draw(p));
	};
    

	p.mouseWheel = (e: { delta: number}) => {
		players.forEach(pl => pl.rotate(e.delta * Math.PI / 180));
	};
}