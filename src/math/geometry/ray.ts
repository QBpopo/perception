import * as Vec from "@/math/vector";
import type { Geometry, Dimension } from "@/geometry";
import { Point } from "@/geometry";

export interface RayLike {
	origin: Point; // 射线起点
	direction: Vec.Vec2; // 沿射线方向
}

export class Ray implements Geometry, RayLike {
	origin = Point.zero();
	direction = Vec.zero();

	constructor(ray?: Partial<RayLike>) {
		if (!ray) return;
		const { origin, direction } = ray;
		if (origin !== undefined) this.origin = new Point(origin);
		if (direction !== undefined) this.direction = Vec.Vec2(direction);
	}

	get dimension(): Dimension {
		return Vec.len_sq(this.direction) === 0 ? 0 : 1;
	}
}
