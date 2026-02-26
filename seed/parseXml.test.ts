import { describe, it, expect } from "vitest";
import { parseXmlToLinear } from "./parseXml";

const SMALL_XML = `
<ImageNetStructure>
  <releaseData>fall2011</releaseData>
  <synset wnid="fall11" words="Root" gloss="Root node">
    <synset wnid="n001" words="Animal" gloss="An animal">
      <synset wnid="n002" words="Dog" gloss="A dog">
        <synset wnid="n003" words="Poodle" gloss="A poodle"></synset>
        <synset wnid="n004" words="Labrador" gloss="A labrador"></synset>
      </synset>
      <synset wnid="n005" words="Cat" gloss="A cat"></synset>
    </synset>
    <synset wnid="n006" words="Plant" gloss="A plant"></synset>
  </synset>
</ImageNetStructure>
`;

describe("parseXmlToLinear", () => {
  it("parses XML into linear nodes with correct paths", () => {
    const result = parseXmlToLinear(SMALL_XML);
    const paths = result.map((n) => n.path);

    expect(paths).toContain("Root");
    expect(paths).toContain("Root > Animal");
    expect(paths).toContain("Root > Animal > Dog");
    expect(paths).toContain("Root > Animal > Dog > Poodle");
    expect(paths).toContain("Root > Animal > Dog > Labrador");
    expect(paths).toContain("Root > Animal > Cat");
    expect(paths).toContain("Root > Plant");
  });

  it("computes correct sizes (descendant counts)", () => {
    const result = parseXmlToLinear(SMALL_XML);
    const byPath = Object.fromEntries(result.map((n) => [n.path, n.size]));

    expect(byPath["Root > Animal > Dog > Poodle"]).toBe(0);
    expect(byPath["Root > Animal > Dog > Labrador"]).toBe(0);
    expect(byPath["Root > Animal > Dog"]).toBe(2);
    expect(byPath["Root > Animal > Cat"]).toBe(0);
    expect(byPath["Root > Animal"]).toBe(4); // Dog(1+2) + Cat(1)
    expect(byPath["Root > Plant"]).toBe(0);
    expect(byPath["Root"]).toBe(6); // Animal(1+4) + Plant(1)
  });

  it("returns correct total count of nodes", () => {
    const result = parseXmlToLinear(SMALL_XML);
    expect(result).toHaveLength(7);
  });

  it("handles single-child synset (not array)", () => {
    const xml = `
    <ImageNetStructure>
      <releaseData>fall2011</releaseData>
      <synset wnid="r" words="Root" gloss="root">
        <synset wnid="a" words="Only Child" gloss="single child"></synset>
      </synset>
    </ImageNetStructure>`;

    const result = parseXmlToLinear(xml);
    expect(result).toHaveLength(2);
    expect(result.find((n) => n.path === "Root > Only Child")).toBeTruthy();
  });
});
