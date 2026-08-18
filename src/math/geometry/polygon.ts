import * as Vec from "@/math/vector";
import type { BoundedGeometry } from "@/geometry";
import { Point } from "@/geometry";

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
}
