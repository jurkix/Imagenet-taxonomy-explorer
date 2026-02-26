import type { Meta, StoryObj } from "@storybook/react";
import { TreeNodeRow } from "./TreeNodeRow";
import type { ApiTreeNode } from "@lib/types";

const meta: Meta<typeof TreeNodeRow> = {
  title: "Components/TreeNodeRow",
  component: TreeNodeRow,
};

export default meta;
type Story = StoryObj<typeof TreeNodeRow>;

const mockNode: ApiTreeNode = {
  id: 1,
  path: "ImageNet 2011 Fall Release > plant, flora, plant life",
  name: "plant, flora, plant life",
  size: 4699,
  depth: 2,
  hasChildren: true,
};

const leafNode: ApiTreeNode = {
  id: 2,
  path: "ImageNet 2011 Fall Release > plant > diatom",
  name: "diatom",
  size: 0,
  depth: 3,
  hasChildren: false,
};

export const Collapsed: Story = {
  args: {
    node: mockNode,
    depth: 1,
    isExpanded: false,
    isLoading: false,
    onToggle: () => {},
    onSelect: () => {},
  },
};

export const Expanded: Story = {
  args: {
    node: mockNode,
    depth: 1,
    isExpanded: true,
    isLoading: false,
    onToggle: () => {},
    onSelect: () => {},
  },
};

export const Loading: Story = {
  args: {
    node: mockNode,
    depth: 1,
    isExpanded: true,
    isLoading: true,
    onToggle: () => {},
    onSelect: () => {},
  },
};

export const Leaf: Story = {
  args: {
    node: leafNode,
    depth: 2,
    isExpanded: false,
    isLoading: false,
    onToggle: () => {},
    onSelect: () => {},
  },
};

export const DeeplyNested: Story = {
  args: {
    node: { ...leafNode, name: "Deeply nested node" },
    depth: 6,
    isExpanded: false,
    isLoading: false,
    onToggle: () => {},
    onSelect: () => {},
  },
};
