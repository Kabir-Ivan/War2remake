class Sprite {
    constructor(url, pos, size, speed, frames, dir = 'horizontal', once = false, degrees = 0, flip = 'no', scale = 1, shift = [0, 0]) {
      this.pos = pos;
      this.size = size;
      this.speed = typeof speed === 'number' ? speed : 0;
      this.frames = frames;
      this._index = 0;
      this.url = url;
      this.dir = dir;
      this.once = once;
      this.degrees = degrees;
      this.flip = flip;
      this.endTime = Date.now() + this.frames.length / this.speed;
      this.spriteScale = scale;
      this.shift = shift;
    }
  
    update(dt) {
      this._index += this.speed * dt / 1000;
    }
  
    render(ctx, scale = 1, cameraPos = [0, 0]) {
      let frame;
      this.scale = scale || 1;
      if (this.speed > 0) {
        let max = this.frames.length;
        let idx = Math.floor(this._index);
        frame = this.frames[idx % max];
        if (this.once && (idx >= max || this.endTime < Date.now())) {
          this.done = true;
          return;
        }
      } else {
        frame = 0;
      }
  
      let x = this.pos[0];
      let y = this.pos[1];
  
      if (this.dir == 'vertical') {
        y += frame * this.size[1] - frame * this.shift[1];
      } else {
        x += frame * this.size[0] - frame * this.shift[0];
      }
      let flipX = this.flip == 'vertical';
      let flipY = this.flip == 'horizontal';
  
      ctx.save();
  
      // Set the x-scale and y-scale to flip the image if necessary
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  
      // Rotate the canvas context
      ctx.rotate((this.degrees / 180) * Math.PI);
  
      // Calculate the new destination coordinates and dimensions
      const dWidth = flipX ? -this.size[0] : this.size[0];
      const dHeight = flipY ? -this.size[1] : this.size[1];
      const ndx = flipX ? this.size[0] / 2 + cameraPos[0] / scale / this.spriteScale: -this.size[0] / 2 - cameraPos[0] / scale / this.spriteScale;
      const ndy = flipY ? this.size[1] / 2 + cameraPos[1] / scale / this.spriteScale : -this.size[1] / 2 - cameraPos[1] / scale / this.spriteScale;
  
      // Draw the image
      const resources = require('./resources').resources;
      ctx.drawImage(
        resources.get(this.url),
        x,
        y,
        this.size[0],
        this.size[1],
        ndx * scale * this.spriteScale,
        ndy * scale * this.spriteScale,
        dWidth * this.scale * this.spriteScale,
        dHeight * this.scale * this.spriteScale
      );
      ctx.restore();
      ctx.translate(x + this.size[0] / 2, y + this.size[1] / 2);
    }
  }
  
  if (typeof window !== 'undefined') {
    window.Sprite = Sprite;
  }
  
function SpriteFromJSON(json) {
  data = JSON.parse(json);
  return new Sprite(data.url, data.pos, data.size, data.speed, data.frames, data.dir, data.once, data.degrees, data.flip, data.scale, data.shift);
}

module.exports = {
    Sprite : Sprite,
    SpriteFromJSON : SpriteFromJSON
}