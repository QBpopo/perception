import type { BoundedGeometry } from "@/geometry";
import { Point } from "@/geometry";

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
	}

	static from_points = (ps: Iterable<Point>): Aabb => {
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
}
