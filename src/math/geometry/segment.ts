import type { BoundedGeometry } from "@/geometry";
import { Point } from "@/geometry";

export interface SegmentLike {
	start: Point;
	end: Point;
}

export class Segment implements BoundedGeometry, SegmentLike {
	start = Point.zero();
	end = Point.zero();

	constructor(segment?: Partial<SegmentLike>) {
		if (!segment) return;
		const { start, end } = segment;
		if (start !== undefined) this.start = new Point(start);
		if (end !== undefined) this.end = new Point(end);
	}

	get len(): number {
		return Point.distance(this.start, this.end);
	}

	get midpoint(): Point {
		return Point.point(
			(this.start.x + this.end.x) / 2,
			(this.start.y + this.end.y) / 2,
		);
	}
}
