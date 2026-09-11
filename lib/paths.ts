import path from "node:path";

export const dataDir = path.join(process.cwd(), "data");
export const magazinesFile = path.join(dataDir, "magazines.json");
export const commentsFile = path.join(dataDir, "comments.json");
export const suggestionsFile = path.join(dataDir, "suggestions.json");
export const magazinesDir = path.join(process.cwd(), "public", "magazines");
