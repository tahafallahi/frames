import type { Meta, StoryObj } from "@storybook/react-vite";
import SignupForm from "./register-form";

const meta = {
  component: SignupForm,
} satisfies Meta<typeof SignupForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
