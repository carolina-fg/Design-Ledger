import * as fs from "fs";

let content = fs.readFileSync("src/App.tsx", "utf8");
content = content.replace(/\r\n/g, "\n");

const lines = content.split("\n");

let sectionOpenIdx = -1;
let sectionCloseIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i] && lines[i].includes("<section") && lines[i].includes("select-none")) {
    sectionOpenIdx = i;
  }
  if (lines[i] && lines[i].includes("</section>")) {
    sectionCloseIdx = i;
    break;
  }
}

if (sectionOpenIdx !== -1 && sectionCloseIdx !== -1) {
  console.log(`Found <section> at line ${sectionOpenIdx + 1} and </section> at line ${sectionCloseIdx + 1}`);
  
  const blockLines = lines.slice(sectionCloseIdx - 8, sectionCloseIdx + 1);
  console.log("Current block contents:\n", blockLines.join("\n"));
  
  const newSegment = [
    "                     </div>",
    "                   );",
    "                 })}",
    "               </div>",
    "             </section>"
  ];
  
  lines.splice(sectionCloseIdx - 6, 7, ...newSegment);
  
  fs.writeFileSync("src/App.tsx", lines.join("\n"), "utf8");
  console.log("Successfully restored timeline section closures!");
} else {
  console.log("Could not find section boundary lines.");
}
