// Shared Playwright launch with software WebGL for headless runs.
import { chromium } from "playwright";
export const GL_ARGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"];
export async function launch() {
  return chromium.launch({ args: GL_ARGS });
}
export const BASE = process.env.BASE_URL ?? "http://localhost:3000";
