/**
 *
 * GLOBALS: loader, timer, sound
 * PIXI globals: Sprite, Rectangle
 * fns: removeRobot, getNearbyWalls
 *
 **/
var getRobot = (function () {

return function () {
	var robot_tex = loader.resources["images/robot.png"].texture;
	var robot_sprite = new Sprite(robot_tex);

	var robot_explode_tex = loader.resources["images/robot-explode.png"].texture;
	var rect = rect = new Rectangle(0, 0, 8, 11);
	robot_tex.frame = rect;
	robot_sprite.vx = 0;
	robot_sprite.vy = 0;
	robot_sprite.scale.set(4, 4);
	robot_sprite.rate = 0.5;
	robot_sprite.explode_tex = robot_explode_tex;
	robot_sprite.explode_tex.num_frames = 3;
	robot_sprite.tint = 0xFF0000;
	robot_sprite.death_start_timer = -1;
	robot_sprite.timer_offset = Math.floor(Math.random() * 100);
	robot_sprite.index = -1;
	robot_sprite.name = `robot${timer}`;
	robot_sprite.bullet_velocity = 4;
	robot_sprite.bullet_length = 6;
	robot_sprite.bullet_color = 0xFF0000;
	robot_sprite.qx = -1;
	robot_sprite.qy = -1;

	// public methods
	robot_sprite.tick = robotPlay;
	robot_sprite.aim = targetHumanoid;
	robot_sprite.setPosition = setPosition;

	function setPosition (pos) {
		robot_sprite.x = pos.x;
		robot_sprite.y = pos.y;
	}
	
	// animation vars
	var frame_delay = 0.15; // smaller == slower

	// ROBOT STATES
	function robotDead () {

		var frame_num = (Math.floor((timer - robot_sprite.death_start_timer) * 0.1) % 4);		
		if (frame_num < robot_sprite.explode_tex.num_frames) {
			robot_sprite.texture = robot_sprite.explode_tex;
			robot_sprite.anchor.x = 0.28;
			robot_sprite.anchor.y = 0.28;
			robot_sprite.texture.frame = new Rectangle( frame_num * 18, 0, 18, 18);
		} else {
			setTimeout(removeRobot, 1, robot_sprite);
		}
	}

	var qx, qy;
	function robotPlay () {

		var anim_frame_index = (Math.round(timer * frame_delay) % 2) * 8;
		var standing_frame_index = (Math.round( (timer + robot_sprite.timer_offset) * frame_delay) % 6) * 8;


		var arr = [];

		if (robot_sprite.was_hit === true) {

			robot_sprite.death_start_timer = timer;
			sound.play('robot_dead');
			robot_sprite.tick = robotDead;
		} else {

			if (timer < robots_awake_time === false) {
				robot_sprite.aim();
			}

			robot_sprite.x += robot_sprite.vx;
			robot_sprite.y += robot_sprite.vy;

			// animate him
			if (robot_sprite.vy > 0) {
				robot_sprite.texture.frame = new Rectangle(anim_frame_index + 64, 0, 8, 11);
			} else if (robot_sprite.vy < 0) {
				robot_sprite.texture.frame = new Rectangle(anim_frame_index + 96, 0, 8, 11);
			}

			if (robot_sprite.vx > 0) {
				robot_sprite.texture.frame = new Rectangle(anim_frame_index + 48, 0, 8, 11);
			} else if (robot_sprite.vx < 0) {
				robot_sprite.texture.frame = new Rectangle(anim_frame_index + 80, 0, 8, 11);
			}

			if (robot_sprite.vx === 0 && robot_sprite.vy === 0) {
				robot_sprite.texture.frame = new Rectangle(standing_frame_index, 0, 8, 11);
			}
		}
	}

	function targetHumanoid () {

		robot_sprite.ax = (robot_sprite.x - player_sprite.x > 1) ? -1 : 1;
		robot_sprite.ay = (robot_sprite.y - player_sprite.y > 1) ? -1 : 1;

		if (Math.abs(robot_sprite.x - player_sprite.x) < 20) { robot_sprite.ax = 0; }
		if (Math.abs(robot_sprite.y - player_sprite.y) < 20) { robot_sprite.ay = 0; }

		// update robot velocity
		robot_sprite.vx = robot_sprite.ax;
		robot_sprite.vy = robot_sprite.ay;
		
		var nearby_walls = getNearbyWalls(robot_sprite);
		if (nearby_walls.top === true) {
			robot_sprite.vy = Math.max(robot_sprite.vy, 0);
		}
		if (nearby_walls.right === true) {
			robot_sprite.vx = Math.min(robot_sprite.vx, 0);
		}
		if (nearby_walls.bottom === true) {
			robot_sprite.vy = Math.min(robot_sprite.vy, 0);
		}
		if (nearby_walls.left === true) {
			robot_sprite.vx = Math.max(robot_sprite.vx, 0);
		}
	

		if (timer < next_bullet_time === false && robot_bullets.length < max_robot_bullets) {

			if (Math.abs(robot_sprite.x - player_sprite.x) < 20 ||
				Math.abs(robot_sprite.y - player_sprite.y) < 20 ||
				Math.abs((robot_sprite.x - robot_sprite.y) - (player_sprite.x - player_sprite.y)) < 20 ||
				Math.abs((robot_sprite.x - player_sprite.y) - (player_sprite.x - robot_sprite.y)) < 20) {
					fire(robot_sprite);
			}
					
		}
	}

	function robotCanFire () {
		return false;
	}
	return robot_sprite;
}
})();