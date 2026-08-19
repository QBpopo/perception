import type { DeepReadonly } from "@/types";
import type { PointLike } from "@/geometry";

// 左手坐标系
export interface Vec2 {
	x: number;
	y: number;
}

export class UnitVec2 implements Vec2 {
	readonly x: number;
	readonly y: number;

	constructor(vec: Vec2) {
		const l = len(vec);
		if (!Number.isFinite(l) || l === 0) {
			throw new Error();
		}
		this.x = vec.x / l;
		this.y = vec.y / l;
	}
}

export const Vec2 = (v: Vec2): Vec2 => vec2(v.x, v.y);

export const vec2 = (x: number, y: number): Vec2 => ({ x, y });

export const zero = () => vec2(0, 0);

export const dir = (from: DeepReadonly<PointLike>, to: DeepReadonly<PointLike>): Vec2 => {
	const x = to.x - from.x;
	const y = to.y - from.y;
	return { x, y };
};

export const is_zero = (v: DeepReadonly<Vec2>): boolean => len_sq(v) === 0;

export const len = (v: DeepReadonly<Vec2>): number => Math.hypot(v.x, v.y);

export const len_sq = (v: DeepReadonly<Vec2>): number => v.x * v.x + v.y * v.y;

export const translate = (v: DeepReadonly<Vec2>, t: DeepReadonly<Vec2>): Vec2 => vec2(v.x + t.x, v.y + t.y);

// 顺时针旋转
export const rotate = (vec: DeepReadonly<Vec2>, rad: number): Vec2 => {
	const { x, y } = vec;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);
	return {
		x: x * cos - y * sin,
		y: x * sin + y * cos,
	};
};

export const scale: {
	(v: DeepReadonly<Vec2>, s: DeepReadonly<Vec2>): Vec2;
	(v: DeepReadonly<Vec2>, s: number): Vec2;
} = (v, s) => {
	if (typeof s === "number") {
		return vec2(v.x * s, v.y * s);
	} else {
		return vec2(v.x * s.x, v.y * s.y);
	}
};

export const dot = (u: DeepReadonly<Vec2>, v: DeepReadonly<Vec2>): number => u.x * v.x + u.y * v.y;

export const cross = (u: DeepReadonly<Vec2>, v: DeepReadonly<Vec2>): number => u.x * v.y - u.y * v.x;

export const is_collinear = (u: DeepReadonly<Vec2>, v: DeepReadonly<Vec2>): boolean => cross(u, v) === 0;

export const is_same_dir = (u: DeepReadonly<Vec2>, v: DeepReadonly<Vec2>): boolean => is_collinear(u, v) && dot(u, v) > 0;

// 向量 u 在向量 v 上的投影系数
export const proj_factor = (u: DeepReadonly<Vec2>, v: DeepReadonly<Vec2>): number => {
	const _len_sq = len_sq(v);

	if (_len_sq === 0) {
		return 0;
	}

	return dot(u, v) / _len_sq;
};

// 向量 u 在向量 v 上的投影向量
export const proj = (u: DeepReadonly<Vec2>, v: DeepReadonly<Vec2>): Vec2 => {
	const t = proj_factor(u, v) ?? 0;
	return scale(v, t);
};

// 归一化向量
export const normalize = (v: DeepReadonly<Vec2>): UnitVec2 => new UnitVec2(v);

// 两向量夹角余弦
export const cos_theta = (u: DeepReadonly<Vec2>, v: DeepReadonly<Vec2>): number => {
	const denominator = len(u) * len(v);

	if (denominator === 0) {
		return 0;
	}

	return dot(u, v) / denominator;
};
