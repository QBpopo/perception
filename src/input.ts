import type { Vec2 } from "@/math/vector";

export interface InputCtx {
	x: number;
	y: number;
	lmb: boolean;
	mmb: boolean;
	is_draged: boolean;
	keys: Set<string>;
	// WASD 归一化移动向量
	wasd_axis: () => Vec2;
	is_key_down: (code: string) => boolean;
}

export const input_ctx = (): InputCtx => {
	let x = 0;
	let y = 0;
	let mmb = false;
	let lmb = false;
	let is_draged = false;
	const keys = new Set<string>();

	// 游戏按键，禁用浏览器默认行为
	const GAME_KEYS = [
		"KeyW", "KeyA", "KeyS", "KeyD",
		"ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
		"ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "AltLeft", "AltRight",
		"Space",
	];

	window.addEventListener("keydown", e => {
		// 输入框聚焦时不记录游戏按键
		const target = e.target;
		if (target instanceof HTMLElement && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)) {
			return;
		}

		keys.add(e.code);

		if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || GAME_KEYS.includes(e.code)) {
			e.preventDefault();
		}
	});

	window.addEventListener("keyup", e => {
		keys.delete(e.code);
	});

	window.addEventListener("blur", () => {
		keys.clear();
		lmb = false;
		is_draged = false;
	});

	window.addEventListener("pointermove", e => {
		x = e.clientX;
		y = e.clientY;
		if (lmb) {
			is_draged = true;
		}
	});

	window.addEventListener("pointerdown", e => {
		if (e.button !== 1) return;
		e.preventDefault();
		mmb = true;
	});

	window.addEventListener("pointerup", e => {
		if (e.button !== 1) return;
		mmb = false;
	});

	window.addEventListener("pointerdown", e => {
		if (e.button !== 0) return;
		lmb = true;
	});

	window.addEventListener("pointerup", e => {
		if (e.button !== 0) return;
		lmb = false;
		is_draged = false;
	});

	const wasd_axis = (): Vec2 => {
		let x = 0;
		let y = 0;
		if (keys.has("KeyW")) y -= 1;
		if (keys.has("KeyS")) y += 1;
		if (keys.has("KeyA")) x -= 1;
		if (keys.has("KeyD")) x += 1;
		const len = Math.hypot(x, y);
		if (len > 0) {
			x /= len;
			y /= len;
		}
		return { x, y };
	};

	return {
		get x(): number {
			return x;
		},
		get y(): number {
			return y;
		},
		get keys(): Set<string> {
			return keys;
		},
		get lmb(): boolean {
			return lmb;
		},
		get mmb(): boolean {
			return mmb;
		},
		get is_draged(): boolean {
			return is_draged;
		},
		wasd_axis,
		is_key_down: (code: string) => keys.has(code),
	};
};
