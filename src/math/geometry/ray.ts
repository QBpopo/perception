import type { DeepReadonly } from "@/types";
import * as Vec from "@/math/vector";
import type { Geometry, PointLike } from "@/geometry";
import { Point, Relation } from "@/geometry";

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

	get dimension(): 0 | 1 {
		return Vec.is_zero(this.direction) ? 0 : 1;
	}

	relation(p: DeepReadonly<PointLike>): Relation {
		if (this.dimension === 0) {
			return this.origin.relation(p);
		}

		if (Vec.is_same_dir(this.direction, Vec.dir(this.origin, p))) {
			return Relation.Intersects;
		} else {
			return Relation.Disjoint;
		}
	}
}
