import { createElement } from "./helpers.js";

export function createProgressBar() {
  const bar = createElement("div", "progress-bar");
  const progress = createElement("div", "progress");
  bar.appendChild(progress);
  return { bar, progress };
}
