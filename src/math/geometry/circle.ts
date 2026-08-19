import type { DeepReadonly, Values } from "@/types";
import * as Vec from "@/math/vector";
import type { BoundedGeometry, PointLike } from "@/geometry";
import { Point, Relation } from "@/geometry";

export interface CircleLike {
	center: Point;
	radius: number;
}

export class Circle implements BoundedGeometry, CircleLike {
	center = Point.zero();
	#radius = 0;

	constructor(circle: Partial<CircleLike>) {
		if (!circle) return;
		const { center, radius } = circle;
		if (center !== undefined) this.center = new Point(center);
		if (radius !== undefined) this.radius = radius;
	}

	get radius(): number {
		return this.#radius;
	}

	set radius(r: number) {
		this.#radius = Math.max(0, r);
	}

	static circle_relation = (c1: DeepReadonly<CircleLike>, c2: DeepReadonly<CircleLike>): CircleRelation => {
		const d = Point.distance(c1.center, c2.center);

		const r1 = c1.radius;
		const r2 = c2.radius;

		const radius_sum = r1 + r2;
		const radius_diff = Math.abs(r1 - r2);

		if (d > radius_sum) {
			return CircleRelation.Separate;
		}

		if (d === radius_sum) {
			return CircleRelation.ExternallyTangent;
		}

		if (d < radius_diff) {
			return CircleRelation.Contained;
		}

		if (d === radius_diff) {
			return CircleRelation.InternallyTangent;
		}

		return CircleRelation.Intersecting;
	};

	get dimension(): 0 | 2 {
		return this.radius === 0 ? 0 : 2;
	}

	relation(p: DeepReadonly<PointLike>): Relation {
		const d_sq = Point.distance_sq(this.center, p);
		const r_sq = this.radius ** 2;
		return d_sq <= r_sq ? Relation.Intersects : Relation.Disjoint;
	}

	closest(p: DeepReadonly<PointLike>): Point {
		const cp = Vec.dir(this.center, p);
		const d = Vec.len(cp);

		// 最近点即自身
		if (d <= this.radius) {
			return new Point(p);
		}

		// 在圆外，沿圆心到点方向偏移半径
		return Point.offset(this.center, Vec.scale(cp, d), this.radius);
	}
}

export type CircleRelation = Values<typeof CircleRelation>;

// 两圆的位置关系
export const CircleRelation = {
	// 外离：没有公共点
	Separate: "separate",

	// 外切：一个公共点
	ExternallyTangent: "externally-tangent",

	// 相交：两个公共点
	Intersecting: "intersecting",

	// 内切：一个公共点
	InternallyTangent: "internally-tangent",

	// 内含：没有公共点
	Contained: "contained",
} as const;
