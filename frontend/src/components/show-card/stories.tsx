import type { Meta, StoryObj } from "@storybook/react-vite";
import mockShows from "@/testing/mocks/shows";
import ShowCard from "./show-card";

const meta = {
  component: ShowCard,
} satisfies Meta<typeof ShowCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: {
    show: mockShows[0],
    variant: "full",
  },
};

export const Full2: Story = {
  args: {
    show: mockShows[0],
    variant: "full2",
  },
};

export const Compact: Story = {
  args: {
    show: mockShows[0],
    variant: "compact",
  },
};

