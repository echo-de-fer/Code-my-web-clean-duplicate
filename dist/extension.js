"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
function activate(context) {
  const watcher = vscode.workspace.createFileSystemWatcher("**/* copy*.*");
  watcher.onDidCreate(async (uri) => {
    try {
      const segments = uri.path.split("/");
      const filename = segments.pop() ?? "";
      const dirUri = uri.with({ path: segments.join("/") });
      const lastDot = filename.lastIndexOf(".");
      const ext = lastDot !== -1 ? filename.slice(lastDot) : "";
      const base = lastDot !== -1 ? filename.slice(0, lastDot) : filename;
      const originalBase = base.replace(/\s+copy(?:\s+\d+)?$/i, "").trim();
      const entries = await vscode.workspace.fs.readDirectory(dirUri);
      let maxNum = 1;
      const pattern = new RegExp(`^${escapeRegExp(originalBase)}(?:\\s+(\\d+))?${escapeRegExp(ext)}$`, "i");
      for (const [name, type] of entries) {
        if (type === vscode.FileType.File) {
          const match = name.match(pattern);
          if (match) {
            const num = match[1] ? parseInt(match[1], 10) : 1;
            maxNum = Math.max(maxNum, num);
          }
        }
      }
      const newUri = vscode.Uri.joinPath(dirUri, `${originalBase} ${maxNum + 1}${ext}`);
      await vscode.workspace.fs.rename(uri, newUri, { overwrite: false });
    } catch (err) {
      console.error("Rename failed:", err);
    }
  });
  context.subscriptions.push(watcher);
}
var escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function deactivate() {
}
//# sourceMappingURL=extension.js.map
