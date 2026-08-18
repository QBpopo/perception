import type { DeepReadonly } from "@/types";
import type { Vec2 } from "@/math/vector";
import type { BoundedGeometry } from "@/geometry";

export interface PointLike {
	x: number;
	y: number;
}

export class Point implements BoundedGeometry, PointLike {
	x = 0;
	y = 0;

	constructor(point?: PointLike) {
		if (!point) return;
		this.x = point.x;
		this.y = point.y;
	}

	static zero(): Point {
		return new Point();
	}

	static from_xy = (x: number, y: number): Point => new Point({ x, y });

	static distance = (a: DeepReadonly<PointLike>, b: DeepReadonly<PointLike>): number => {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		return Math.hypot(dx, dy);
	};

	static distance_sq = (a: DeepReadonly<PointLike>, b: DeepReadonly<PointLike>): number => {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		return dx * dx + dy * dy;
	};

	static offset = (o: DeepReadonly<Point>, dir: DeepReadonly<Vec2>, t: number): Point => {
		return Point.from_xy(o.x + t * dir.x, o.y + t * dir.y);
	};
}
