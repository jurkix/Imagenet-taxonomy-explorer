import { XMLParser } from "fast-xml-parser";
import type { LinearNode } from "../lib/types";

interface XmlSynset {
  "@_wnid": string;
  "@_words": string;
  "@_gloss": string;
  synset?: XmlSynset[];
}

export function parseXmlToLinear(xmlContent: string): LinearNode[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (name) => name === "synset",
  });

  const parsed = parser.parse(xmlContent);
  const rootSynsets: XmlSynset[] = parsed.ImageNetStructure.synset;
  const results: LinearNode[] = [];

  function traverse(node: XmlSynset, parentPath: string): number {
    const currentPath = parentPath
      ? `${parentPath} > ${node["@_words"]}`
      : node["@_words"];

    const children = node.synset ?? [];
    let descendantCount = children.length;

    for (const child of children) {
      descendantCount += traverse(child, currentPath);
    }

    results.push({ path: currentPath, size: descendantCount });
    return descendantCount;
  }

  for (const root of rootSynsets) {
    traverse(root, "");
  }

  return results;
}
