import { defineConfig } from "vite";

const [_repositoryOwner, repositoryName] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const base = process.env.GITHUB_ACTIONS ? `/${repositoryName ?? ""}/` : "/";

export default defineConfig({
	base,
	resolve: {
		tsconfigPaths: true,
	},
});
