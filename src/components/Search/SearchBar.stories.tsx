import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Empty: Story = {
  args: {
    value: "",
    onChange: () => {},
  },
};

export const WithQuery: Story = {
  args: {
    value: "plant",
    onChange: () => {},
  },
};
