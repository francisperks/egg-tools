const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "../out/index.html");
let html = fs.readFileSync(htmlPath, "utf8");

// Add <base href="./"> if not present
if (!html.includes('<base href="./">')) {
  html = html.replace("<head>", `<head>\n  <base href="./">`);
}

// Fix incorrectly rooted asset paths
html = html.replace(/(href|src)=["']\/_next/g, '$1="./_next');

fs.writeFileSync(htmlPath, html);
console.log("✅ Patched index.html for Electron (base + asset paths).");
