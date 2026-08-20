import { type PerceptionCtx, perception_ctx } from "./perception.ts";
import type { Level, Pc, Npc, Obstacle } from "./level.ts";
import * as Config from "./config.ts";

import type { PointLike } from "@/geometry/point";
import { Application, Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";

export class Renderer {
	readonly app: Application;
	readonly gfx: Graphics;
	readonly viewport: Viewport;

	private constructor(app: Application, viewport: Viewport, gfx: Graphics) {
		this.app = app;
		this.viewport = viewport;
		this.gfx = gfx;
	}

	static async create(container: HTMLElement): Promise<Renderer> {
		const app = new Application();
		await app.init({
			resizeTo: window,
			antialias: true,
			resolution: window.devicePixelRatio ?? 1,
			autoDensity: true,
		});

		const viewport = new Viewport({
			events: app.renderer.events,
			ticker: app.ticker,
		});

		const gfx = new Graphics();

		app.stage.addChild(viewport).addChild(gfx);
		container.appendChild(app.canvas);
		app.canvas.style.display = "block";

		viewport.wheel({ center: viewport.center });

		app.renderer.on("resize", () => {
			viewport.screenWidth = app.screen.width;
			viewport.screenHeight = app.screen.height;
		});

		return new Renderer(app, viewport, gfx);
	}

	follow(p: PointLike): void {
		this.viewport.moveCenter(p.x, p.y);
	}

	render(level: Level): void {
		const p = perception_ctx(level.pc, level.npcs, level.obstacles);
		this.gfx.clear();
		this.draw_grid(this.gfx, Config.grid.size);
		this.draw_perception(this.gfx, p, level.pc);
		this.draw_obstacles(this.gfx, level.obstacles);
		this.draw_npcs(this.gfx, p, level.npcs);
		this.draw_pc(this.gfx, level.pc);
	}

	private draw_grid(g: Graphics, size: number): void {
		const left = this.viewport.left;
		const right = this.viewport.right;
		const top = this.viewport.top;
		const bottom = this.viewport.bottom;

		const x0 = Math.floor(left / size) * size;
		const y0 = Math.floor(top / size) * size;

		g.beginPath();
		for (let i = x0; i <= right; i += size) {
			g.moveTo(i, top);
			g.lineTo(i, bottom);
		}
		for (let i = y0; i <= bottom; i += size) {
			g.moveTo(left, i);
			g.lineTo(right, i);
		}
		g.stroke(Config.grid.stroke);
	}

	private draw_perception(g: Graphics, perception: PerceptionCtx, pc: Pc): void {
		g.circle(pc.x, pc.y, pc.intuition_distance)
			.fill(Config.intuition.fill)
			.stroke(Config.intuition.stroke);

		g.circle(pc.x, pc.y, pc.hearing_distance)
			.fill(Config.hearing.fill)
			.stroke(Config.hearing.stroke);

		g.poly(perception.unblocked_vision.vertices)
			.fill(Config.unblocked_vision.fill)
			.stroke(Config.unblocked_vision.stroke);
	}

	private draw_obstacles(g: Graphics, rs: Obstacle[]): void {
		for (const r of rs) {
			g.rect(r.x, r.y, r.width, r.height)
				.fill(Config.obstacle.fill)
				.stroke(Config.obstacle.stroke);
		}
	}

	private draw_npcs(g: Graphics, perception: PerceptionCtx, npcs: Npc[]): void {
		for (const npc of npcs) {
			if (perception.in_vision.has(npc.id)) {
				g.circle(npc.x, npc.y, npc.radius)
					.fill(Config.npc.in_vision.fill)
					.stroke(Config.npc.in_vision.stroke);
			}
			if (perception.in_unblocked_vision.has(npc.id)) {
				g.circle(npc.x, npc.y, npc.radius)
					.fill(Config.npc.in_unblocked_vision.fill)
					.stroke(Config.npc.in_unblocked_vision.stroke);
			}
			if (perception.in_intuition.has(npc.id)) {
				g.circle(npc.x, npc.y, npc.radius)
					.fill(Config.npc.in_intuition.fill)
					.stroke(Config.npc.in_intuition.stroke);
			}
			if (perception.in_hearing.has(npc.id)) {
				g.circle(npc.x, npc.y, npc.radius)
					.fill(Config.npc.in_hearing.fill)
					.stroke(Config.npc.in_hearing.stroke);
			}
		}
	}

	private draw_pc(g: Graphics, pc: Pc): void {
		g.circle(pc.x, pc.y, pc.radius)
			.fill(Config.pc.fill)
			.stroke(Config.pc.stroke);
	}
}
