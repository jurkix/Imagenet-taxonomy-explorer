import { describe, it, expect } from "vitest";
import { buildTree } from "./treeBuilder";

describe("buildTree", () => {
  it("returns null for empty input", () => {
    expect(buildTree([])).toBeNull();
  });

  it("builds a single root node", () => {
    const tree = buildTree([
      { path: "Root", name: "Root", size: 0, parentPath: null },
    ]);
    expect(tree).toEqual({ name: "Root", size: 0, children: [] });
  });

  it("builds a tree using parentPath lookups", () => {
    const tree = buildTree([
      { path: "Root", name: "Root", size: 4, parentPath: null },
      { path: "Root > Animal", name: "Animal", size: 2, parentPath: "Root" },
      { path: "Root > Plant", name: "Plant", size: 0, parentPath: "Root" },
      { path: "Root > Animal > Dog", name: "Dog", size: 0, parentPath: "Root > Animal" },
      { path: "Root > Animal > Cat", name: "Cat", size: 0, parentPath: "Root > Animal" },
    ]);

    expect(tree!.name).toBe("Root");
    expect(tree!.size).toBe(4);
    expect(tree!.children).toHaveLength(2);

    const animal = tree!.children.find((c) => c.name === "Animal");
    expect(animal!.children).toHaveLength(2);
    expect(animal!.children.map((c) => c.name).sort()).toEqual(["Cat", "Dog"]);

    const plant = tree!.children.find((c) => c.name === "Plant");
    expect(plant!.children).toHaveLength(0);
  });

  it("preserves size values correctly", () => {
    const tree = buildTree([
      { path: "Root", name: "Root", size: 60941, parentPath: null },
      { path: "Root > Plants", name: "Plants", size: 4699, parentPath: "Root" },
      { path: "Root > Plants > Fern", name: "Fern", size: 0, parentPath: "Root > Plants" },
    ]);

    expect(tree!.size).toBe(60941);
    expect(tree!.children[0].size).toBe(4699);
    expect(tree!.children[0].children[0].size).toBe(0);
  });
});
