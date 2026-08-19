export * from "@/geometry/point";
export * from "@/geometry/circle";
export * from "@/geometry/aabb";
export * from "@/geometry/line";
export * from "@/geometry/ray";
export * from "@/geometry/segment";
export * from "@/geometry/sector";
export * from "@/geometry/polygon";

export interface Geometry {
	// 拓扑维度，自然数
	readonly dimension: Dimension;
}

export interface BoundedGeometry extends Geometry { }

export type Dimension = 0 | 1 | 2;
