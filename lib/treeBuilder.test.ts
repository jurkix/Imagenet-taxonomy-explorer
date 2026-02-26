import { describe, it, expect } from "vitest";
import { buildTree } from "./treeBuilder";
import type { LinearNode } from "./types";

describe("buildTree", () => {
  it("returns null for empty input", () => {
    expect(buildTree([])).toBeNull();
  });

  it("builds a single root node", () => {
    const tuples: LinearNode[] = [{ path: "Root", size: 0 }];
    const tree = buildTree(tuples);
    expect(tree).toEqual({ name: "Root", size: 0, children: [] });
  });

  it("builds a simple tree from linear tuples", () => {
    const tuples: LinearNode[] = [
      { path: "Root", size: 4 },
      { path: "Root > Animal", size: 2 },
      { path: "Root > Animal > Dog", size: 0 },
      { path: "Root > Animal > Cat", size: 0 },
      { path: "Root > Plant", size: 0 },
    ];

    const tree = buildTree(tuples);

    expect(tree!.name).toBe("Root");
    expect(tree!.size).toBe(4);
    expect(tree!.children).toHaveLength(2);

    const animal = tree!.children.find((c) => c.name === "Animal");
    expect(animal!.children).toHaveLength(2);
    expect(animal!.children.map((c) => c.name).sort()).toEqual(["Cat", "Dog"]);

    const plant = tree!.children.find((c) => c.name === "Plant");
    expect(plant!.children).toHaveLength(0);
  });

  it("handles unordered input (sorts by depth internally)", () => {
    const tuples: LinearNode[] = [
      { path: "Root > A > B", size: 0 },
      { path: "Root", size: 2 },
      { path: "Root > A", size: 1 },
    ];

    const tree = buildTree(tuples);
    expect(tree!.name).toBe("Root");
    expect(tree!.children[0].name).toBe("A");
    expect(tree!.children[0].children[0].name).toBe("B");
  });

  it("preserves size values correctly", () => {
    const tuples: LinearNode[] = [
      { path: "Root", size: 60941 },
      { path: "Root > Plants", size: 4699 },
      { path: "Root > Plants > Fern", size: 0 },
    ];

    const tree = buildTree(tuples);
    expect(tree!.size).toBe(60941);
    expect(tree!.children[0].size).toBe(4699);
    expect(tree!.children[0].children[0].size).toBe(0);
  });
});
