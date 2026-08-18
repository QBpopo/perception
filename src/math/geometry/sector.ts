import { TWO_PI, clamp } from "@/math";
import * as Vec from "@/math/vector";
import type { BoundedGeometry } from "@/geometry";
import { Point } from "@/geometry";

export interface SectorLike {
	center: Point;
	radius: number;
	angle: number; // 张角 [0, 2pi]
	direction: Vec.Vec2; // 平行对称轴的从圆心到弧的的向量
}

export class Sector implements BoundedGeometry, SectorLike {
	center = Point.zero();
	#radius = 0;
	#angle = 0;
	direction = Vec.zero();

	constructor(sector: Partial<SectorLike>) {
		if (!sector) return;
		const { center, radius, angle, direction } = sector;
		if (center !== undefined) this.center = new Point(center);
		if (radius !== undefined) this.radius = radius;
		if (angle !== undefined) this.angle = angle;
		if (direction !== undefined) this.direction = Vec.Vec2(direction);
	}

	get radius(): number { return this.#radius; }

	set radius(r: number) { this.#radius = Math.max(0, r); }

	get angle(): number { return this.#angle; }

	set angle(a: number) { this.#angle = clamp(a, 0, TWO_PI); }

	get left_endpoint(): Point {
		const half = this.angle / 2;
		const left = Vec.rotate(this.direction, half);
		return Point.offset(this.center, left, this.#radius);
	}

	get right_endpoint(): Point {
		const half = this.angle / 2;
		const right = Vec.rotate(this.direction, -half);
		return Point.offset(this.center, right, this.#radius);
	}
}
