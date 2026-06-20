import dotenv from "dotenv";
import path from "path";

// Load .env.local immediately when this file is imported
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
