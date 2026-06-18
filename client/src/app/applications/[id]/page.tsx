import type { Metadata } from 'next';
import { ApplicationDetail } from '@/components/applications/ApplicationDetail';
import { PageWrapper } from '@/components/layout/PageWrapper';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Application #${id}`,
    description: `View and manage application #${id}.`,
  };
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  return (
    <PageWrapper>
      <ApplicationDetail id={numId} />
    </PageWrapper>
  );
}
