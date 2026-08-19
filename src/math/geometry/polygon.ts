import type { DeepReadonly } from "@/types";
import * as Vec from "@/math/vector";
import type { BoundedGeometry, Dimension, PointLike } from "@/geometry";
import { Point, Segment, Relation } from "@/geometry";

export interface PolygonLike {
	vertices: Point[];
}

export class Polygon implements BoundedGeometry, PolygonLike {
	vertices: Point[] = [];

	constructor(polygon: PolygonLike) {
		this.vertices = polygon.vertices.map(v => new Point(v));
	}

	static from_points = (ps: Point[]) => new Polygon({ vertices: ps });

	signed_area(): number {
		const n = this.vertices.length;
		let sum = 0;
		for (let i = 0; i < n; i++) {
			const a = this.vertices[i];
			const b = this.vertices[(i + 1) % n];
			sum += Vec.cross(a, b);
		}
		return sum / 2;
	}

	degenerate_segment(): Segment {
		const n = this.vertices.length;
		let best_i = 0;
		let best_j = 1;
		let best_sq = -1;

		for (let i = 0; i < n; i++) {
			for (let j = i + 1; j < n; j++) {
				const sq = Point.distance_sq(this.vertices[i], this.vertices[j]);
				if (sq > best_sq) {
					best_sq = sq;
					best_i = i;
					best_j = j;
				}
			}
		}

		return new Segment({
			start: this.vertices[best_i],
			end: this.vertices[best_j],
		});
	}

	// 水平向右射线与多边形边的交点数为奇数即在内部
	#intersects(p: DeepReadonly<PointLike>): boolean {
		const n = this.vertices.length;
		let inside = false;

		for (let i = 0, j = n - 1; i < n; j = i++) {
			const vi = this.vertices[i];
			const vj = this.vertices[j];

			if (new Segment({ start: vi, end: vj }).relation(p) === Relation.Intersects) {
				return true;
			}

			const intersects = Math.min(vi.y, vj.y) <= p.y && p.y < Math.max(vi.y, vj.y)
				&& p.x < vi.x + (p.y - vi.y) / (vj.y - vi.y) * (vj.x - vi.x);

			if (intersects) {
				inside = !inside;
			}
		}

		return inside;
	}

	#edges(): Segment[] {
		const n = this.vertices.length;
		const edges: Segment[] = [];
		for (let i = 0; i < n; i++) {
			edges.push(new Segment({
				start: this.vertices[i],
				end: this.vertices[(i + 1) % n],
			}));
		}
		return edges;
	}

	get dimension(): Dimension {
		if (this.vertices.length < 2) {
			return 0;
		}

		if (this.vertices.every(v => v.relation(this.vertices[0]) !== Relation.Disjoint)) {
			return 0;
		}

		return this.signed_area() === 0 ? 1 : 2;
	}

	relation(p: DeepReadonly<PointLike>): Relation {
		const d = this.dimension;

		if (d === 0) {
			return this.vertices[0].relation(p);
		}

		if (d === 1) {
			return this.degenerate_segment().relation(p);
		}

		// 射线法
		return this.#intersects(p) ? Relation.Intersects : Relation.Disjoint;
	}

	closest(p: DeepReadonly<PointLike>): Point {
		const d = this.dimension;

		// 退化为点
		if (d === 0) {
			return new Point(this.vertices[0]);
		}

		// 退化为线段
		if (d === 1) {
			return this.degenerate_segment().closest(p);
		}

		if (this.relation(p) !== Relation.Disjoint) {
			return new Point(p);
		}

		// 取每条边最近点
		const edges = this.#edges();
		let best = edges[0].closest(p);
		let best_sq = Point.distance_sq(best, p);

		for (let i = 1; i < edges.length; i++) {
			const c = edges[i].closest(p);
			const sq = Point.distance_sq(c, p);
			if (sq < best_sq) {
				best_sq = sq;
				best = c;
			}
		}

		return best;
	}

	non_smooth(): Iterable<Point> {
		return this.vertices.map(v => new Point(v));
	}
}
