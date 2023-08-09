class Structure {
    constructor(id, gridPos, animations, bullet, rechargeTime, cost, buildingSpeed, gridSize) {
        this.id = id;
        if(gridPos) {
            this.pos = [gridPos[0] * 32, gridPos[1] * 32];
        }
        this.gridPos = gridPos;
        this.animations = animations;
        this.currentAnimationName = null;
        this.currentAnimation = null;
        if(this.animations) {
            this.currentAnimationName = Object.keys(this.animations)[0];
            this.currentAnimation = this.animations[this.currentAnimationName];
        }
        this.sprite = null;
        this.bullet = bullet;
        this.isShooting = bullet != null;
        this.rechargeTime = rechargeTime;
        this.cost = cost;
        this.completion = 0;
        this.buildingSpeed = buildingSpeed || 0.0001;
        this.unitsInside = [];
        this.gridSize = gridSize || [1, 1];
        this.showRect = false;
    }

    setAnimation(name) {
        if(this.animations) {
            if(Object.keys(this.animations).indexOf(name) != -1) {
                this.currentAnimationName = name;
                this.currentAnimation = this.animations[name];
            }
        }
    }

    get size() {
        return [this.gridSize[0] * 32, this.gridSize[1] * 32];
    }

    get center() {
        return [this.pos[0] + this.size[0] / 2, this.pos[1] + this.size[1] / 2];
    }

    update(dt) {
        this.completion += this.buildingSpeed * Math.max(1, this.unitsInside.length) * dt;
        this.completion = Math.min(1, this.completion);
        if(this.completed) {
            this.setAnimation("Completed");
        }
        else if(this.completion <= 0.5) {
            this.setAnimation("Started");
        }
        else {
            this.setAnimation("Building");
        }
    }

    get completed() {
        return this.completion >= 1;
    }

    collides(pos, size) {
        size = size || [0, 0];
        let x = pos[0],
            y = pos[1],
            xm = pos[0] + size[0],
            ym = pos[1] + size[1],
            x2 = this.pos[0],
            y2 = this.pos[1],
            xm2 = this.pos[0] + this.size[0],
            ym2 = this.pos[1] + this.size[1];
        return !(xm <= x2 || x > xm2 ||
            ym <= y2 || y > ym2);
    }

    render(ctx) {
        const Sprite = require('../utils/sprite').Sprite;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if(!this.sprite) {
            this.sprite = new Sprite(...this.currentAnimation);
        }
        ctx.translate(this.center[0], this.center[1]);
        this.sprite.render(ctx);
        if(this.showRect) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "red";
            ctx.rect(this.pos[0] + 1.5, this.pos[1] + 1.5, this.size[0] - 2, this.size[1] - 2);
            ctx.stroke();
        }
    }

    toJSON() {
        let unitsJson = [];
        for(let i = 0; i < this.unitsInside.length; i++){
            unitsJson.push(this.unitsInside[i].toJSON());
        }
        return {
            "id": this.id,
            "pos": this.pos,
            "animations": this.animations,
            "currentAnimationName": this.currentAnimationName,
            "currentAnimation": this.currentAnimation,
            "bullet": this.bullet,
            "isShooting": this.isShooting,
            "rechargeTime": this.rechargeTime,
            "cost": this.cost,
            "completion": this.completion,
            "buildingSpeed": this.buildingSpeed,
            "unitsInside": unitsJson,
            "gridSize": this.gridSize,
            "gridPos": this.gridPos
        }
    }

    fromJSON(data) {
        let unitsFromJson = [];
        for(let i = 0; i < this.unitsInside.length; i++){
            const Unit = require('./Unit');
            let unit = new Unit();
            unit.fromJSON(data.unitsInside[i]);
            unitsFromJson.push(unit);
        }
        this.id = data.id;
        this.pos = data.pos;
        this.animations = data.animations;
        this.currentAnimationName = data.currentAnimationName;
        this.currentAnimation = data.currentAnimation;
        this.bullet = data.bullet;
        this.isShooting = data.isShooting;
        this.rechargeTime = data.rechargeTime;
        this.cost = data.cost;
        this.completion = data.completion;
        this.buildingSpeed = data.buildingSpeed;
        this.unitsInside = unitsFromJson;
        this.gridSize = data.gridSize;
        this.gridPos = data.gridPos;

    }
}

module.exports = Structure;