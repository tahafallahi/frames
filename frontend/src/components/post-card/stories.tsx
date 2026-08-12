import type { Meta, StoryObj } from '@storybook/react-vite';
import PostCard from './post-card';
import mockPosts from '@/testing/mocks/mock-posts';



const meta = {
  component: PostCard,
} satisfies Meta<typeof PostCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {args: {
  post: mockPosts[1]
}};