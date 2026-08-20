import type { FillStyle, StrokeStyle } from "pixi.js";

export const grid = {
	size: 32,
	stroke: {
		color: 0x111111,
		width: 1,
		alpha: 0.5,
		pixelLine: true,
	} satisfies StrokeStyle,
};

export const unblocked_vision = {
	fill: {
		color: 0xeeeeee,
		alpha: 0.08,
	} satisfies FillStyle,
	stroke: {
		alpha: 0,
	} satisfies StrokeStyle,
};

export const intuition = {
	fill: {
		color: 0xeeeeee,
		alpha: 0.05,
	} satisfies FillStyle,
	stroke: {
		alpha: 0,
	} satisfies StrokeStyle,
};

export const hearing = {
	fill: {
		alpha: 0,
	} satisfies FillStyle,
	stroke: {
		color: 0xeeeeee,
		alpha: 0.05,
	} satisfies StrokeStyle,
};

export const obstacle = {
	fill: {
		color: 0x161616,
	} satisfies FillStyle,
	stroke: {
		color: 0x484848,
		alignment: 1,
	} satisfies StrokeStyle,
};

export const npc = {
	in_vision: {
		fill: {
			alpha: 0,
		} satisfies FillStyle,
		stroke: {
			alpha: 0,
		} satisfies StrokeStyle,
	},
	in_unblocked_vision: {
		fill: {
			color: 0xff0000,
			alpha: 1,
		} satisfies FillStyle,
		stroke: {
			color: 0xffffff,
			alpha: 1,
			alignment: 1,
		} satisfies StrokeStyle,
	},
	in_intuition: {
		fill: {
			alpha: 0,
		} satisfies FillStyle,
		stroke: {
			color: 0xff0000,
			alpha: 0.15,
			alignment: 1,
		} satisfies StrokeStyle,
	},
	in_hearing: {
		fill: {
			alpha: 0,
		} satisfies FillStyle,
		stroke: {
			color: 0xff0000,
			alpha: 0.05,
			alignment: 1,
		} satisfies StrokeStyle,
	},
};

export const pc = {
	fill: {
		color: 0xffffff,
		alpha: 1,
	} satisfies FillStyle,
	stroke: {
		color: 0x000000,
		width: 1,
		alpha: 1,
		alignment: 1,
	} satisfies StrokeStyle,
};
