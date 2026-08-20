import { input_ctx } from "./input.ts";
import type { Character, Pc, Obstacle, Level } from "./level.ts";
import { create_pc, create_npc, create_obstacle } from "./level.ts";
import { Renderer } from "./render.ts";

import * as Vec from "@/math/vector";
import { intersects_geometry_circle } from "@/geometry/algorithm";

const default_level = (): Level => ({
	pc: create_pc(0, 0),
	npcs: [
		create_npc(-200, -200),
		create_npc(100, -100),
		create_npc(0, 150),
	],
	obstacles: [
		create_obstacle(-100, -100, 50, 50),
		create_obstacle(-50, 100, 100, 20),
		create_obstacle(100, -50, 20, 100),
	],
});

const collides = (ch: Character, obstacles: readonly Obstacle[]): boolean => {
	return obstacles.some(e => intersects_geometry_circle(e.aabb, ch.circle));
};

const move_axis = (pc: Pc, delta: number, axis: "x" | "y", dt: number, obstacles: readonly Obstacle[]): void => {
	const total = delta * pc.speed * dt;
	const steps = Math.ceil(Math.abs(total) / pc.radius);
	const inc = total / steps;
	for (let i = 0; i < steps; i++) {
		const next = pc[axis] + inc;
		pc[axis] = next;
		if (collides(pc, obstacles)) {
			pc[axis] -= inc; // 回退该步
			break;
		}
	}
};

const renderer = await Renderer.create(document.getElementById("app")!);

const input = input_ctx();
const level = default_level();
const pc = level.pc;

// 准星死区
const AIM_DEADZONE_SQ = 4;
let last_dir = pc.crosshair_dir;

let enable_move = true;
let enable_viewport = true;
let enable_crosshair = true;

renderer.app.ticker.add(ticker => {
	const dt = Math.min(ticker.deltaMS / 1000, 0.05);

	// WASD 移动
	if (enable_move) {
		const axis = input.wasd_axis();
		move_axis(pc, axis.x, "x", dt, level.obstacles);
		move_axis(pc, axis.y, "y", dt, level.obstacles);
	}

	// 相机跟随
	if (enable_viewport) {
		renderer.follow(pc);
	}

	// 准星方向
	if (enable_crosshair) {
		const to_mouse = Vec.dir(pc, renderer.viewport.toWorld(input.x, input.y));
		if (Vec.len_sq(to_mouse) >= AIM_DEADZONE_SQ) {
			last_dir = Vec.normalize(to_mouse);
			pc.crosshair_dir = last_dir;
		}
	}

	// 鼠标滚轮抬高/降低相机，按鼠标中键还原
	if (input.mmb) {
		renderer.viewport.setZoom(1, true);
	}

	renderer.render(level);
});
