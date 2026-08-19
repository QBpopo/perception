import type { DeepReadonly } from "@/types";
import { clamp } from "@/math";
import type { BoundedGeometry, PointLike } from "@/geometry";
import * as Vec from "@/math/vector";
import { Point, Relation } from "@/geometry";

export interface SegmentLike {
	start: Point;
	end: Point;
}

export class Segment implements BoundedGeometry, SegmentLike {
	start = Point.zero();
	end = Point.zero();

	constructor(segment?: Partial<SegmentLike>) {
		if (!segment) return;
		const { start, end } = segment;
		if (start !== undefined) this.start = new Point(start);
		if (end !== undefined) this.end = new Point(end);
	}

	get len(): number {
		return Point.distance(this.start, this.end);
	}

	get midpoint(): Point {
		return Point.point(
			(this.start.x + this.end.x) / 2,
			(this.start.y + this.end.y) / 2,
		);
	}

	get dimension(): 0 | 1 {
		return this.start.x === this.end.x && this.start.y === this.end.y ? 0 : 1;
	}

	relation(p: DeepReadonly<PointLike>): Relation {
		const se = Vec.dir(this.start, this.end);
		const sp = Vec.dir(this.start, p);

		if (this.dimension === 0) {
			return this.start.relation(p);
		}

		if (!Vec.is_collinear(sp, se)) {
			return Relation.Disjoint;
		}

		const t = Vec.proj_factor(sp, se);
		return 0 <= t && t <= 1 ? Relation.Intersects : Relation.Disjoint;
	}

	closest(p: DeepReadonly<PointLike>): Point {
		const se = Vec.dir(this.start, this.end);
		const sp = Vec.dir(this.start, p);
		const t = clamp(Vec.proj_factor(sp, se), 0, 1);
		return Point.offset(this.start, se, t);
	}
}
