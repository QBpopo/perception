export const HAlf_PI = Math.PI / 2;
export const TWO_PI = Math.PI * 2;

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const radian = (degree: number): number => degree * (Math.PI / 180);

export const degree = (radian: number): number => radian * (180 / Math.PI);
