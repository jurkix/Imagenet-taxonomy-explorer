import type { Meta, StoryObj } from "@storybook/react";
import { SearchResults } from "./SearchResults";
import type { SearchResult } from "@lib/types";

const meta: Meta<typeof SearchResults> = {
  title: "Components/SearchResults",
  component: SearchResults,
};

export default meta;
type Story = StoryObj<typeof SearchResults>;

const mockResults: SearchResult[] = [
  {
    id: 1,
    path: "ImageNet 2011 Fall Release > plant, flora, plant life",
    name: "plant, flora, plant life",
    size: 4699,
    depth: 2,
    hasChildren: true,
    breadcrumbs: ["ImageNet 2011 Fall Release", "plant, flora, plant life"],
  },
  {
    id: 2,
    path: "ImageNet 2011 Fall Release > plant > houseplant",
    name: "houseplant",
    size: 15,
    depth: 3,
    hasChildren: true,
    breadcrumbs: ["ImageNet 2011 Fall Release", "plant", "houseplant"],
  },
];

const defaultProps = {
  hasNextPage: false,
  isFetchingNextPage: false,
  onFetchNextPage: () => {},
  onSelect: () => {},
};

export const WithResults: Story = {
  args: {
    results: mockResults,
    total: 2,
    isLoading: false,
    ...defaultProps,
  },
};

export const Loading: Story = {
  args: {
    results: [],
    total: 0,
    isLoading: true,
    ...defaultProps,
  },
};

export const NoResults: Story = {
  args: {
    results: [],
    total: 0,
    isLoading: false,
    ...defaultProps,
  },
};
