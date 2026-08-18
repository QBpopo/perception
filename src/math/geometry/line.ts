import * as Vec from "@/math/vector";
import type { Geometry } from "@/geometry";
import { Point } from "@/geometry";

export interface LineLike {
	origin: Point; // 直线上任一点
	direction: Vec.Vec2; // 切向量
}

export class Line implements Geometry, LineLike {
	origin = Point.zero();
	direction = Vec.zero();

	constructor(line?: Partial<LineLike>) {
		if (!line) return;
		const { origin, direction } = line;
		if (origin !== undefined) this.origin = new Point(origin);
		if (direction !== undefined) this.direction = Vec.Vec2(direction);
	}
}
