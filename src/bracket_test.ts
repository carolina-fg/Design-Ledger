import * as fs from "fs";

const content = fs.readFileSync("src/App.tsx", "utf8");

// A basic regex for matching tags, both open (<div ...>) and close (</div>) and self-closing (<br />)
// We need to parse correctly while avoiding matching characters in strings or quotes.
// To keep it simple and robust: we can search for tag bounds. Let's write a lexer!

const lines = content.split("\n");
const stack: { tag: string; line: number }[] = [];

for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
  const line = lines[lineIdx];
  const cleanLine = line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
  
  // Custom parsing state to find tags that are JSX
  let i = 0;
  while (i < cleanLine.length) {
    if (cleanLine[i] === "<") {
      // Check if it's a comment or start of a tag
      if (cleanLine.substring(i, i + 4) === "<!--" || cleanLine[i + 1] === " ") {
        i++;
        continue;
      }
      
      // Let's extract the tag token up to >
      let tagEnd = cleanLine.indexOf(">", i);
      if (tagEnd === -1) {
        i++;
        continue;
      }
      
      const fullTag = cleanLine.substring(i, tagEnd + 1);
      i = tagEnd + 1;
      
      // Check if it's self-closing (ends with />)
      if (fullTag.endsWith("/>") || fullTag.includes("self_closing") || fullTag.includes("<img") || fullTag.includes("<input") || fullTag.includes("<br") || fullTag.includes("<hr") || fullTag.includes("<col")) {
        continue;
      }
      
      const tagNameMatch = fullTag.match(/<\/?([a-zA-Z0-9_\-\.]+)/);
      if (!tagNameMatch) continue;
      const tagName = tagNameMatch[1];
      
      // Let's filter out standard components that are often self-closed but we missed them because of layout, e.g. <Sparkles ... /> or <Check ... />
      // Since our simple tokenizer might miss when self-closing tags are on multiple lines or have extra attributes:
      // Let's check if the tag is actually closing or opening!
      const isClosing = fullTag.startsWith("</");
      
      // Let's filter out well-known icon components which are ALWAYS self-closed or closed immediately
      const isIcon = /^[A-Z][a-zA-Z0-9]*$/.test(tagName) && tagName !== "SettingsPanel" && tagName !== "EthicsLogDashboard";
      if (isIcon && !isClosing) {
        // Most lucide-react icons are <Icon ... /> which end in /> or rest self-closed. 
        // We can ignore them to avoid false positives!
        continue;
      }
      
      if (isClosing) {
        const opened = stack.pop();
        if (!opened) {
          console.log(`Error: Closed tag </${tagName}> on line ${lineIdx + 1} which was never opened.`);
        } else if (opened.tag !== tagName) {
          console.log(`Error: Mismatched close tag. Expected </${opened.tag}> (opened on line ${opened.line}), but got </${tagName}> on line ${lineIdx + 1}.`);
          // Push it back to keep tracking other things
          stack.push(opened);
        }
      } else {
        stack.push({ tag: tagName, line: lineIdx + 1 });
      }
    } else {
      i++;
    }
  }
}

console.log("\nRemaining open tags stack:");
for (const item of stack) {
  console.log(`  <${item.tag}> opened on line ${item.line}`);
}
