import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom has no IntersectionObserver; the Hairline engine needs one to know a figure is on screen. This one never reports.
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class {
    readonly root = null;
    readonly rootMargin = "";
    readonly scrollMargin = "";
    readonly thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}

// jsdom has no matchMedia either; every query answers "no", as a plain desktop browser would.
if (typeof globalThis.matchMedia !== "function") {
  globalThis.matchMedia = (query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
