import type { Meta, StoryObj } from '@storybook/react-vite';
import ProfileCard from './profile-card';
import { mockUsers } from '@/testing/mocks/users';



const meta = {
  component: ProfileCard,
} satisfies Meta<typeof ProfileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Detailed: Story = {args: {
  user: mockUsers[1],
  variant: "detailed"
}};

export const Full: Story = {args: {
  user: mockUsers[1],
  variant: "full"
}};

export const Compact: Story = {args: {
  user: mockUsers[1],
  variant: "compact"
}};
