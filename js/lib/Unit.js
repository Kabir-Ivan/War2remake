class Unit {
	constructor(id, owner, layer, pos, size, name, HP, armor, sight, isShooter, bullet, range, mana, attackSpeed, attackReload, damage, speed, animations, sounds, vulnurable, queue) {
		this.id = id;
		this.owner = owner;
		this.layer = layer;
		this.coord = [pos[0] * 33, pos[1] * 33];
		this.pos = pos;
		this.name = name;
		this.size = size;
		this.HP = HP;
		this.sight = sight;
		this.isShooter = isShooter;
		this.bullet = bullet;
		this.range = range;
		this.mana = mana;
		this.armor = armor;
		this.attackSpeed = attackSpeed;
		this.attackReload = attackReload;
		this.damage = damage;
		this.speed = speed;
		this.animations = animations;
		this.sounds = sounds;
		if(this.animations) {
			this.currentAnimationName = Object.keys(this.animations)[0];
			this.currentAnimation = this.animations[this.currentAnimationName];
		}
		this.currentSoundName = null;
		this.currentSound = null;
		this.vulnurable = vulnurable || true;
		this.lastUpdate = Date.now();
		this.actionQueue = queue;
	}
	render(ctx) {

	}
	setAnimation(name) {
		if(this.animations[name]){
			this.currentAnimationName = name;
			this.currentAnimation = this.animations[this.currentAnimationName];
		}
	}
	
	setSound(name) {
		if(this.sounds[name]){
			this.currentSoundName = name;
			this.currentSound = this.sounds[this.currentSoundName];
		}
	}
	
	playSound(name) {
		if(this.sounds[name]){
			var sound = new Audio(this.sounds[name]);
			sound.loop = false;
			sound.play();
		}
	}
	
	realPos() {
		[this.pos[0] * 32, this.pos[1] * 32]
	}
	
	inflictDamage(damage) {
		if(this.vulnurable){
			this.HP -= Math.max(0, damage - this.armor);
		}
	}
	
	inflictTrueDamage(damage) {
		if(this.vulnurable){
			this.HP -= Math.max(0, damage);
		}
	}
	
	heal(amount) {
		this.HP += amount;
	}
	
	kill() {
		this.HP = 0;
	}
	
	killed() {
		return this.HP <= 0
	}

	// toJson() {
	// 	return JSON.stringify({
	// 		"pos" : this.pos,
	// 		"coord" : this.coord,
	// 		"HP" : this.HP,
	// 		"mana" : this.mana,
	// 		"actionQueue" : this.actionQueue
	// 	})
	// }
	fromJSON(data) {

	}
	
}
module.exports = Unit;