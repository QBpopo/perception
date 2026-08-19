import * as Vec from "@/math/vector";
import type { BoundedGeometry, Dimension } from "@/geometry";
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

	get dimension(): Dimension {
		const n = this.vertices.length;
		if (n < 2) {
			return 0;
		}

		const v0 = this.vertices[0];
		if (this.vertices.every(v => v.x === v0.x && v.y === v0.y)) {
			return 0;
		}

		return this.signed_area() === 0 ? 1 : 2;
	}
}
