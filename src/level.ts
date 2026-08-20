import * as Vec from "@/math/vector";
import { Point, Circle, Aabb } from "@/geometry";

export interface Actor {
	x: number;
	y: number;
	id: number;
}

export interface Character extends Actor {
	radius: number;
	circle: Circle;
}

export interface Perceptive {
	crosshair_dir: Vec.Vec2;
	vision_angle: number;
	vision_distance: number;
	intuition_distance: number;
	hearing_distance: number;
}

export interface Pc extends Character, Perceptive {
	id: 0;
	speed: number; // px/s
}

export interface Npc extends Character { }

export interface Obstacle extends Actor {
	width: number;
	height: number;
	aabb: Aabb;
}

export interface Level {
	pc: Pc;
	npcs: Npc[];
	obstacles: Obstacle[];
}

let object_id = 0;

export const next_object_id = (): number => {
	return object_id++;
};

export const reset_object_id = (): void => {
	object_id = 1;
};

export const set_object_id = (v: number): void => {
	object_id = v;
};

export const create_pc = (x: number, y: number): Pc => ({
	id: 0,
	speed: 240,
	crosshair_dir: Vec.vec2(1, 0),
	vision_angle: (Math.PI / 180) * 90,
	vision_distance: 960,
	intuition_distance: 150,
	hearing_distance: 420,
	get x() { return this.circle.center.x; },
	set x(v: number) { this.circle.center.x = v; },
	get y() { return this.circle.center.y; },
	set y(v: number) { this.circle.center.y = v; },
	get radius() { return this.circle.radius; },
	circle: new Circle({ center: Point.point(x, y), radius: 12 }),
});

export const create_npc = (x: number, y: number): Npc => ({
	id: next_object_id(),
	get x() { return this.circle.center.x; },
	set x(v: number) { this.circle.center.x = v; },
	get y() { return this.circle.center.y; },
	set y(v: number) { this.circle.center.y = v; },
	get radius() { return this.circle.radius; },
	circle: new Circle({ center: Point.point(x, y), radius: 12 }),
});

export const create_obstacle = (x: number, y: number, width: number, height: number): Obstacle => ({
	id: next_object_id(),
	get x() { return this.aabb.min.x; },
	set x(v: number) { this.aabb.min.x = v; },
	get y() { return this.aabb.min.y; },
	set y(v: number) { this.aabb.min.y = v; },
	get width() { return this.aabb.width; },
	get height() { return this.aabb.height; },
	aabb: Aabb.from_points([Point.point(x, y), Point.point(x + width, y + height)]),
});
