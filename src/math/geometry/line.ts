import type { DeepReadonly } from "@/types";
import * as Vec from "@/math/vector";
import type { Geometry, PointLike } from "@/geometry";
import { Point, Relation } from "@/geometry";

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

	get dimension(): 0 | 1 {
		return Vec.is_zero(this.direction) ? 0 : 1;
	}

	relation(p: DeepReadonly<PointLike>): Relation {
		if (this.dimension === 0) {
			return this.origin.relation(p);
		}

		const op = Vec.dir(this.origin, p);
		if (Vec.is_collinear(this.direction, op)) {
			return Relation.Intersects;
		} else {
			return Relation.Disjoint;
		}
	}

	closest(p: DeepReadonly<PointLike>): Point {
		const op = Vec.dir(this.origin, p);
		const t = Vec.proj_factor(op, this.direction);
		return Point.offset(this.origin, this.direction, t);
	}

	non_smooth(): Iterable<Point> {
		return [];
	}
}
