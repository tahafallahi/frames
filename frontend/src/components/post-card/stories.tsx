import type { Meta, StoryObj } from '@storybook/react-vite';
import PostCard from './post-card';
import mockPosts from '@/testing/mocks/mock-posts';



const meta = {
  component: PostCard,
} satisfies Meta<typeof PostCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Compact: Story = {args: {
  post: mockPosts[1],
  variant: "compact"
}};

export const Full: Story = {args: {
  post: mockPosts[1],
  variant: "full"
}};