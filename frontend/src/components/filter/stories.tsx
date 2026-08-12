import type { Meta, StoryObj } from '@storybook/react-vite';
import Filter from './filter';
import { mockFilters } from '@/testing/mocks/mocks';



const meta = {
  component: Filter,
} satisfies Meta<typeof Filter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {args: {
  filters: mockFilters
}};