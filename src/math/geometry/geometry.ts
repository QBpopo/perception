import type { Values, DeepReadonly } from "@/types";
import type { PointLike } from "@/geometry/point";

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

	// 点与 geometry 的位置关系
	relation(p: DeepReadonly<PointLike>): Relation;
}

export interface BoundedGeometry extends Geometry { }

export type Dimension = 0 | 1 | 2;

export type Relation = Values<typeof Relation>;

export const Relation = {
	Intersects: "intersects",
	Disjoint: "disjoint",
} as const;
