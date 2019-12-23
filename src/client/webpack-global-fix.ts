// Fix missing global variable when targeting electron-renderer
// @ts-ignore
globalThis.global = globalThis;