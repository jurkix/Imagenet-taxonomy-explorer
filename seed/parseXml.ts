import { XMLParser } from "fast-xml-parser";

interface SeedNode {
  path: string;
  name: string;
  size: number;
  depth: number;
  parentPath: string | null;
}

interface XmlSynset {
  "@_wnid": string;
  "@_words": string;
  "@_gloss": string;
  synset?: XmlSynset[];
}

export function parseXmlToSeedNodes(xmlContent: string): SeedNode[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (name) => name === "synset",
  });

  const parsed = parser.parse(xmlContent);
  const rootSynsets: XmlSynset[] = parsed.ImageNetStructure.synset;
  const results: SeedNode[] = [];

  function traverse(node: XmlSynset, parentPath: string | null, depth: number): number {
    const name = node["@_words"];
    const currentPath = parentPath ? `${parentPath} > ${name}` : name;

    const children = node.synset ?? [];
    let descendantCount = children.length;

    for (const child of children) {
      descendantCount += traverse(child, currentPath, depth + 1);
    }

    results.push({ path: currentPath, name, size: descendantCount, depth, parentPath });
    return descendantCount;
  }

  for (const root of rootSynsets) {
    traverse(root, null, 1);
  }

  return results;
}
