class GameMap {
	constructor(tiles, objects) {
		//this.width = tiles[0].length;
		//this.height = tiles.length;
		this.tiles = tiles;
		this.objects = objects;
		this.tileChache = new Map();
	}

	select(pos, size) {
		let ids = [];
		for(let i = 0; i < this.objects.length; i++) {
			if(this.objects[i].collides(pos, size)) {
				ids.push(this.objects[i].id);
			}
		}
		return ids;
	}

	get width() {
		return this.tiles[0].length;
	}

	get height() {
		return this.tiles.length;
	}
	generateTile(pos) {
		const Sprite = require('../utils/sprite').Sprite;
		//console.log(pos);
		return new Sprite('img/Summer Tiles.png', [pos[0] * 33, pos[1] * 33], [32, 32],
                               1, [0], 'no', false, 0, 'no')
	}

	getTile(mask, type) {
		const getTileXY = require('../utils/tile').getTileXY;
		const s = mask.join("|") + "@" + type;
		if(!this.tileChache.get(s)) {
			let coords = getTileXY(mask, type);
			let tile = this.generateTile(coords);
			this.tileChache.set(s, tile);
		}
		return this.tileChache.get(s);
	}

	render(ctx) {
		for(let i = 0; i < this.width; i++) {
			for(let j = 0; j < this.height; j++) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.translate(i * 32 + 16, j * 32 + 16);
				this.getTile(this.getNeighbors(i, j), this.tiles[j][i]).render(ctx);
			}
		}
		this.objects.forEach(element => element.render(ctx));
	}

	update(dt) {
		this.objects.forEach(element => element.update(dt));
	}

	getNeighbors(x, y){
		let neighbors = []
		for(let dy = -1; dy <= 1; dy++){
			for(let dx = -1; dx <= 1; dx++){
				if(dx || dy){
					let xc = x + dx;
					let yc = y + dy;
					if(xc >= 0 && xc < this.width && yc >= 0 && yc < this.height){
						neighbors.push(this.tiles[yc][xc]);
					}
					else{
						neighbors.push('E');
					}
				}
			}
		}
		return neighbors;
	}
	toJSON() {
		let obj = [];
		for(let j = 0; j < this.objects.length; j++) {
			obj.push(this.objects[j].toJSON());
		}
		return {
			"tiles": this.tiles,
			"objects": obj
		}
	}
}
module.exports = GameMap;
