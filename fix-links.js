const fs = require("fs");
const path = require("path");

// Recursively get all .tsx files
const getAllFiles = (dir, ext, files = []) => {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, ext, files);
    } else if (fullPath.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
};

// Fix <Link><a></a></Link> issues
const fixLinkTags = (filePath) => {
  let content = fs.readFileSync(filePath, "utf8");

  // Remove <a> inside <Link>
  content = content.replace(/<Link([^>]+)>\s*<a([^>]*)>(.*?)<\/a>\s*<\/Link>/g, "<Link$1>$3</Link>");

  fs.writeFileSync(filePath, content, "utf8");
};

// Get all .tsx files in the project
const tsxFiles = getAllFiles("./app", ".tsx");

// Process each file
tsxFiles.forEach(fixLinkTags);

console.log("✅ All <Link> issues have been fixed!");
