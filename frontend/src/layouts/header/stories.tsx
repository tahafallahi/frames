import type { Meta, StoryObj } from "@storybook/react-vite";
import Header from "./header";
import { mockUser } from "@/testing/mocks/mocks";

const meta = {
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { user: mockUser } };
