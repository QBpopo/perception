import type { Character, Perceptive, Obstacle } from "./level.ts";

import { radian } from "@/math";
import * as Vec from "@/math/vector";
import { Point, Circle, Aabb, Segment, Sector, Polygon } from "@/geometry";
import { intersects_geometry_circle, intersects_aabb_aabb, segment_intersects_aabb } from "@/geometry/algorithm";

export interface PerceptiveCharacter extends Character, Perceptive {}

export interface PerceptionCtx {
	in_vision: Set<number>;
	in_unblocked_vision: Set<number>;
	unblocked_vision: Polygon;
	in_intuition: Set<number>;
	in_hearing: Set<number>;
}

// 以 deg 为步长从 sector 的圆心发射射线，每条射线与附近的 aabb 的交点作为多边形端点
const vision_polygon = (sector: Readonly<Sector>, aabbs: Readonly<Aabb>[], deg = 0.1): Polygon => {
	// 预过滤
	const _aabb = aabbs.filter(e => intersects_aabb_aabb(e.aabb(), sector.aabb()));

	const { center, radius, angle, direction } = sector;
	const { x, y } = center;
	const dir_angle = Vec.angle(direction);
	const half = angle / 2;
	const start_angle = dir_angle - half;
	const end_angle = dir_angle + half;
	const step = radian(deg);

	const count = Math.round((end_angle - start_angle) / step);
	const polygon: Point[] = Array.from({ length: count + 2 });

	polygon[0] = Point.point(x, y);

	for (let i = 0; i <= count; i++) {
		const current_angle = Math.min(start_angle + i * step, end_angle);
		const dir = { x: Math.cos(current_angle), y: Math.sin(current_angle) };

		// 构造长度等于半径的线段
		const seg = new Segment({
			start: Point.point(x, y),
			end: Point.offset(center, dir, radius),
		});

		let endpoint = Point.offset(center, dir, radius);
		let best_sq = Infinity;

		for (const aabb of _aabb) {
			const hit = segment_intersects_aabb(seg, aabb);
			if (hit === null) {
				continue;
			}

			// segment 命中取进入点，point 命中取自身
			const p = hit instanceof Segment ? hit.start : hit;

			// 最近的障碍物交点
			const sq = Point.distance_sq(p, center);
			if (sq < best_sq) {
				best_sq = sq;
				endpoint = p;
			}
		}

		polygon[i + 1] = endpoint;
	}

	return Polygon.from_points(polygon);
};

export const perception_ctx = (pc: PerceptiveCharacter, characters: Character[], obstacles: Obstacle[]): PerceptionCtx => {
	const in_vision = new Set<number>();
	const in_unblocked_vision = new Set<number>();
	const in_intuition = new Set<number>();
	const in_hearing = new Set<number>();

	const vision = new Sector({
		center: new Point(pc),
		radius: pc.vision_distance,
		angle: pc.vision_angle,
		direction: pc.crosshair_dir,
	});

	const unblocked_vision = vision_polygon(vision, obstacles.map(e => e.aabb));

	for (const c of characters) {
		if (intersects_geometry_circle(vision, c.circle)) {
			in_vision.add(c.id);
		}
		if (intersects_geometry_circle(unblocked_vision, c.circle)) {
			in_unblocked_vision.add(c.id);
		}
		if (intersects_geometry_circle(new Circle({ center: new Point(pc), radius: pc.intuition_distance }), c.circle)) {
			in_intuition.add(c.id);
		}
		if (intersects_geometry_circle(new Circle({ center: new Point(pc), radius: pc.hearing_distance }), c.circle)) {
			in_hearing.add(c.id);
		}
	}

	return {
		in_vision,
		in_unblocked_vision,
		unblocked_vision,
		in_intuition,
		in_hearing,
	};
};
