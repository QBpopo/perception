import { input_ctx } from "./input.ts";
import type { Character, Pc, Obstacle, Level } from "./level.ts";
import { create_pc, create_npc, create_obstacle } from "./level.ts";
import { Renderer } from "./render.ts";

import { exp_smooth } from "@/math";
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

const move_axis = (pc: Pc, delta: number, axis: "x" | "y", dt: number, speed: number, obstacles: readonly Obstacle[]): void => {
	const total = delta * speed * dt;
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

// 潜行感知加成
const VISION_ANGLE_BASE = pc.vision_angle;
const INTUITION_BASE = pc.intuition_distance;
const SNEAK_VISION_BOOST = 1.5;
const SNEAK_INTUITION_BOOST = 1.5;
const SNEAK_SMOOTH_RATE = 5;

// 准星死区
const AIM_DEADZONE_SQ = 4;
let last_dir = pc.crosshair_dir;

let enable_move = true;
let enable_viewport = true;
let enable_crosshair = true;

renderer.app.ticker.add(ticker => {
	const dt = Math.min(ticker.deltaMS / 1000, 0.05);

	// Shift 疾跑，Alt 潜行
	// 原本是想要以 Ctrl 潜行，但浏览器上某些快捷键组合无法通过 JS 禁用，其中包括关闭标签页的 Ctrl + W
	const sprint = input.is_key_down("ShiftLeft");
	const sneak = input.is_key_down("AltLeft");

	// 潜行时
	const vision_angle_target = sneak ? VISION_ANGLE_BASE * SNEAK_VISION_BOOST : VISION_ANGLE_BASE;
	const intuition_target = sneak ? INTUITION_BASE * SNEAK_INTUITION_BOOST : INTUITION_BASE;
	pc.vision_angle = exp_smooth(pc.vision_angle, vision_angle_target, SNEAK_SMOOTH_RATE, dt);
	pc.intuition_distance = exp_smooth(pc.intuition_distance, intuition_target, SNEAK_SMOOTH_RATE, dt);

	// WASD 移动
	if (enable_move) {
		const axis = input.wasd_axis();
		const speed = sneak ? pc.speed * 0.3 : sprint ? pc.speed * 2 : pc.speed;
		move_axis(pc, axis.x, "x", dt, speed, level.obstacles);
		move_axis(pc, axis.y, "y", dt, speed, level.obstacles);
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
