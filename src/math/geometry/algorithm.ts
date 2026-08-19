import type { DeepReadonly } from "@/types";
import * as Vec from "@/math/vector";
import type { PointLike, Geometry, CircleLike, Aabb, AabbLike } from "@/geometry";
import { Point, Relation, Segment } from "@/geometry";

export const intersects_geometry_point = (geo: DeepReadonly<Geometry>, point: DeepReadonly<PointLike>): boolean => {
	return geo.relation(point) === Relation.Intersects;
};

export const intersects_geometry_circle = (geo: DeepReadonly<Geometry>, circle: DeepReadonly<CircleLike>): boolean => {
	const closest = geo.closest(circle.center);
	return Point.distance_sq(closest, circle.center) <= circle.radius ** 2;
};

export const intersects_aabb_aabb = (a: DeepReadonly<AabbLike>, b: DeepReadonly<AabbLike>): boolean => {
	return (
		a.min.x <= b.max.x
		&& a.max.x >= b.min.x
		&& a.min.y <= b.max.y
		&& a.max.y >= b.min.y
	);
};

export const segment_intersects_segment = (seg1: DeepReadonly<Segment>, seg2: DeepReadonly<Segment>): Point | Segment | null => {
	const s1 = seg1.start;
	const s2 = seg2.start;
	const d1 = Vec.dir(s1, seg1.end);
	const d2 = Vec.dir(s2, seg2.end);

	const denom = Vec.cross(d1, d2);

	// 不平行
	if (denom !== 0) {
		const s1s2 = Vec.dir(s1, s2);
		const t1 = Vec.cross(s1s2, d2) / denom;
		const t2 = Vec.cross(s1s2, d1) / denom;
		if (0 <= t1 && t1 <= 1 && 0 <= t2 && t2 <= 1) {
			return Point.offset(s1, d1, t1);
		}
		return null;
	}

	// 平行但不共线
	if (!Vec.is_collinear(Vec.dir(s1, s2), d1)) {
		return null;
	}

	// seg1 退化
	if (Vec.len_sq(d1) === 0) {
		return intersects_geometry_point(seg2, s1) ? new Point(s1) : null;
	}

	// 将 seg2 映射到 seg1 的参数空间
	const t1 = Vec.proj_factor(Vec.dir(s1, seg2.start), d1);
	const t2 = Vec.proj_factor(Vec.dir(s1, seg2.end), d1);

	// seg1: [0, 1]
	// seg2: [min(t1, t2), max(t1, t2)]
	const start_t = Math.max(Math.min(t1, t2), 0);
	const end_t = Math.min(Math.max(t1, t2), 1);

	// 无交集
	if (start_t > end_t) {
		return null;
	}

	// 单点交集
	if (start_t === end_t) {
		return Point.offset(s1, d1, start_t);
	}

	// 线段交集
	return new Segment({
		start: Point.offset(s1, d1, start_t),
		end: Point.offset(s1, d1, end_t),
	});
};

// slab 裁剪
const clip_axis = (origin: number, delta: number, min: number, max: number, lo: number, hi: number): [number, number] | null => {
	if (delta === 0) {
		return origin >= min && origin <= max ? [lo, hi] : null;
	}
	const t1 = (min - origin) / delta;
	const t2 = (max - origin) / delta;
	const new_lo = Math.max(lo, Math.min(t1, t2));
	const new_hi = Math.min(hi, Math.max(t1, t2));
	return new_lo <= new_hi ? [new_lo, new_hi] : null;
};

export const segment_intersects_aabb = (seg: DeepReadonly<Segment>, aabb: DeepReadonly<Aabb>): Point | Segment | null => {
	const s = seg.start;
	const se = Vec.dir(s, seg.end);

	// 线段退化
	if (seg.dimension === 0) {
		return aabb.relation(s) !== Relation.Disjoint ? new Point(s) : null;
	}

	let lo = 0;
	let hi = 1;

	const x = clip_axis(s.x, se.x, aabb.min.x, aabb.max.x, lo, hi);
	if (x === null) {
		return null;
	}
	[lo, hi] = x;

	const y = clip_axis(s.y, se.y, aabb.min.y, aabb.max.y, lo, hi);
	if (y === null) {
		return null;
	}
	[lo, hi] = y;

	// 单点交集
	if (lo === hi) {
		return Point.offset(s, se, lo);
	}

	// 线段交集
	return new Segment({
		start: Point.offset(s, se, lo),
		end: Point.offset(s, se, hi),
	});
};
