// Lines of code: non-blank lines that are not only a comment (`//`, `/* */`, `{/* */}`, `<!-- -->`).

export function countLoc(text: string): number {
    let inBlock = false;
    let count = 0;
    for (const raw of text.split("\n")) {
        let line = raw.trim();
        if (inBlock) {
            const end = line.indexOf("*/");
            if (end === -1) {
                continue;
            }
            inBlock = false;
            line = line.slice(end + 2).trim();
        }
        // whole-line block comments, possibly several on one line
        while (
            line.startsWith("/*") ||
            line.startsWith("{/*") ||
            line.startsWith("<!--")
        ) {
            const close = line.startsWith("<!--") ? "-->" : "*/";
            const end = line.indexOf(close);
            if (end === -1) {
                inBlock = close === "*/";
                line = "";
                break;
            }
            line = line
                .slice(end + close.length)
                .replace(/^}/, "")
                .trim();
        }
        if (line === "" || line.startsWith("//")) {
            continue;
        }
        count += 1;
    }
    return count;
}
