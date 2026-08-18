export const HAlF_PI = Math.PI / 2;
export const TWO_PI = Math.PI * 2;

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const radian = (degree: number): number => degree * (Math.PI / 180);

export const degree = (radian: number): number => radian * (180 / Math.PI);

// approximately equal
export const aeq = (a: number, b: number, rel_tol = 1e-12, abs_tol = 1e-15): boolean => {
	if (Number.isNaN(a) || Number.isNaN(b)) {
		return false;
	}

	if (a === Infinity || a === -Infinity || b === Infinity || b === -Infinity) {
		return a === b;
	}

	return Math.abs(a - b) <= Math.max(rel_tol * Math.max(Math.abs(a), Math.abs(b)), abs_tol);
};
