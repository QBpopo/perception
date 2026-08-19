import type { DeepReadonly } from "@/types";
import { TWO_PI, clamp } from "@/math";
import * as Vec from "@/math/vector";
import type { BoundedGeometry, Dimension, PointLike } from "@/geometry";
import { Point, Relation } from "@/geometry";

export interface SectorLike {
	center: Point;
	radius: number;
	angle: number; // 张角 [0, 2pi]
	direction: Vec.Vec2; // 平行对称轴的从圆心到弧的的向量
}

export class Sector implements BoundedGeometry, SectorLike {
	center = Point.zero();
	#radius = 0;
	#angle = 0;
	direction = Vec.zero();

	constructor(sector: Partial<SectorLike>) {
		if (!sector) return;
		const { center, radius, angle, direction } = sector;
		if (center !== undefined) this.center = new Point(center);
		if (radius !== undefined) this.radius = radius;
		if (angle !== undefined) this.angle = angle;
		if (direction !== undefined) this.direction = Vec.Vec2(direction);
	}

	get radius(): number {
		return this.#radius;
	}

	set radius(r: number) {
		this.#radius = Math.max(0, r);
	}

	get angle(): number {
		return this.#angle;
	}

	set angle(a: number) {
		this.#angle = clamp(a, 0, TWO_PI);
	}

	get left_endpoint(): Point {
		const half = this.angle / 2;
		const left = Vec.rotate(this.direction, -half);
		return Point.offset(this.center, left, this.radius);
	}

	get right_endpoint(): Point {
		const half = this.angle / 2;
		const right = Vec.rotate(this.direction, +half);
		return Point.offset(this.center, right, this.radius);
	}

	get dimension(): Dimension {
		if (this.radius === 0) {
			return 0;
		}
		if (Vec.is_zero(this.direction)) {
			return 0;
		}
		if (this.angle === 0) {
			return 1;
		}
		return 2;
	}

	relation(p: DeepReadonly<PointLike>): Relation {
		const cp = Vec.dir(this.center, p);

		if (Vec.len_sq(cp) > this.radius ** 2) {
			return Relation.Disjoint;
		}

		if (Vec.is_zero(cp)) {
			return Relation.Intersects;
		}

		if (Vec.is_zero(this.direction)) {
			return Relation.Disjoint;
		}

		const half = this.angle / 2;
		const cos_half = Math.cos(half);
		return Vec.cos_theta(cp, this.direction) >= cos_half ? Relation.Intersects : Relation.Disjoint;
	}

	closest(p: DeepReadonly<PointLike>): Point {
		// 在扇形内，最近点即自身
		if (this.relation(p) !== Relation.Disjoint) {
			return new Point(p);
		}

		const r = this.radius;
		const cp = Vec.dir(this.center, p);

		// 在角度范围内，在弧上
		const half = this.angle / 2;
		if (Vec.cos_theta(this.direction, cp) >= Math.cos(half)) {
			return Point.offset(this.center, Vec.normalize(cp), r);
		}

		// 在角度范围外，在直边上
		const left = Vec.rotate(this.direction, half);
		const right = Vec.rotate(this.direction, -half);

		const tl = clamp(Vec.proj_factor(cp, left), 0, r);
		const tr = clamp(Vec.proj_factor(cp, right), 0, r);

		const left_closest = Point.offset(this.center, left, tl);
		const right_closest = Point.offset(this.center, right, tr);

		if (Vec.len_sq(Vec.dir(p, left_closest)) <= Vec.len_sq(Vec.dir(p, right_closest))) {
			return left_closest;
		} else {
			return right_closest;
		}
	}
}
