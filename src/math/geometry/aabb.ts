import type { DeepReadonly } from "@/types";
import { clamp } from "@/math";
import type { BoundedGeometry, Dimension, PointLike } from "@/geometry";
import { Point, Relation } from "@/geometry";

export interface AabbLike {
	min: Point;
	max: Point;
}

// 轴对齐包围盒，Axis-Aligned Bounding Box
export class Aabb implements BoundedGeometry, AabbLike {
	readonly min = Point.zero();
	readonly max = Point.zero();

	constructor(aabb?: Partial<AabbLike>) {
		if (!aabb) return;
		const { min, max } = aabb;
		if (min !== undefined) this.min = new Point(min);
		if (max !== undefined) this.max = new Point(max);
		if (this.min.x > this.max.x || this.min.y > this.max.y) {
			[this.min, this.max] = [this.max, this.min];
		}
	}

	static from_points = (ps: DeepReadonly<Iterable<PointLike>>): Aabb => {
		const it = ps[Symbol.iterator]();

		const first = it.next();
		if (first.done) {
			return new Aabb();
		}

		const min = new Point(first.value);
		const max = new Point(first.value);

		let next = it.next();
		while (!next.done) {
			const p = next.value;
			min.x = Math.min(min.x, p.x);
			min.y = Math.min(min.y, p.y);
			max.x = Math.max(max.x, p.x);
			max.y = Math.max(max.y, p.y);
			next = it.next();
		}

		return new Aabb({ min, max });
	};

	get width(): number {
		return this.max.x - this.min.x;
	}

	get height(): number {
		return this.max.y - this.min.y;
	}

	get dimension(): Dimension {
		const w = this.width;
		const h = this.height;

		if (w === 0 && h === 0) {
			return 0;
		}
		if (w === 0 || h === 0) {
			return 1;
		}
		return 2;
	}

	relation(p: DeepReadonly<PointLike>): Relation {
		if (this.min.x <= p.x && p.x <= this.max.x && this.min.y <= p.y && p.y <= this.max.y) {
			return Relation.Intersects;
		} else {
			return Relation.Disjoint;
		}
	}

	closest(p: DeepReadonly<PointLike>): Point {
		return Point.point(
			clamp(p.x, this.min.x, this.max.x),
			clamp(p.y, this.min.y, this.max.y),
		);
	}

	non_smooth(): Iterable<Point> {
		return [
			Point.point(this.min.x, this.min.y),
			Point.point(this.min.x, this.max.y),
			Point.point(this.max.x, this.min.y),
			Point.point(this.max.x, this.max.y),
		];
	}

	aabb(): Aabb {
		return new Aabb({
			min: new Point(this.min),
			max: new Point(this.max),
		});
	}
}
