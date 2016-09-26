/**
 *
 * GLOBALS: stage, timer
 * PIXI globals: Sprite, Rectangle
 *
 **/
function getEvilOtto (pos) {

	if (evil_otto != null) { evil_otto.destroy(); } // clean up
	
	var otto_tex = loader.resources["images/evil-otto.png"].texture;
	otto_sprite = new Sprite(otto_tex);
	var rect = new Rectangle(44, 0, 11, 43);
	otto_tex.frame = rect;
	otto_sprite.vx = 0;
	otto_sprite.vy = 0;
	otto_sprite.ax = 0; // aim.x
	otto_sprite.ay = 0; // aim.y
	otto_sprite.scale.set(4, 4);
	otto_sprite.rate = 2;
	otto_sprite.tint = 0xFF0000;
	otto_sprite.x = pos.x; // 150;
	otto_sprite.y = pos.y; // 90;
	otto_sprite.name = 'EVIL OTTO';
	
	// public methods
	otto_sprite.tick = ottoDormant;

	return otto_sprite
}

var otto_frame_indices = [6,7,8,9,10,11,12,11,10,9,8,7];
var o_len = otto_frame_indices.length - 1;

function ottoPlay () {

	var x_pos = otto_frame_indices[(Math.round(timer * 0.2) % o_len)] * 11; 
	otto_sprite.x += otto_sprite.vx;
	otto_sprite.y += otto_sprite.vy;

	// animate him
	otto_sprite.texture.frame = new Rectangle( x_pos, 0, 11, 43);
	
}

function ottoDormant () {

	if (timer > otto_delay) {
		soundsInSequence('INTRUDER ALERT INTRUDER ALERT'.split(' '));
		stage.addChild(evil_otto);
		otto_sprite.tick = ottoStart;
		evil_otto.position.set(start_pos.x, start_pos.y);
	}
}

function ottoStart () {

	var x_pos = (Math.round((timer - otto_delay) * 0.1) % 8) * 11; 

	if (x_pos > 66) {
		otto_sprite.tick = ottoPlay;
	} else {
		// animate him
		otto_sprite.texture.frame = new Rectangle(x_pos, 0, 11, 43);
	}
	
}