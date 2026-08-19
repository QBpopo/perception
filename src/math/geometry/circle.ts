import type { DeepReadonly, Values } from "@/types";
import type { BoundedGeometry } from "@/geometry";
import { Point } from "@/geometry";

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
