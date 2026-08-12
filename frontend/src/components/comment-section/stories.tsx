import type { Meta, StoryObj } from '@storybook/react-vite';
import { mockComments } from '@/testing/mocks/comments';
import CommentSection from './comment-section';



const meta = {
  component: CommentSection,
} satisfies Meta<typeof CommentSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {args: {
  comments: mockComments
}};