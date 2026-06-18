import type { Metadata } from 'next';
import { CreateApplicationView } from '@/components/applications/CreateApplicationView';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const metadata: Metadata = {
  title: 'Add Application',
  description: 'Track a new job application.',
};

export default function NewApplicationPage() {
  return (
    <PageWrapper>
      <CreateApplicationView />
    </PageWrapper>
  );
}
