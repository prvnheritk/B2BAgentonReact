import { useRef } from 'react';
import { ConversationArea } from '@/components/workspace/ConversationArea';
import { ContextPanel } from '@/components/workspace/ContextPanel';
import { Sidebar } from '@/components/workspace/Sidebar';
import { HeroSection } from '@/components/hero/HeroSection';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';

export function HomePage() {
  const workspaceRef = useRef<HTMLDivElement>(null);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Mobile: focus the composer (if present in DOM).
    const ta = document.querySelector<HTMLTextAreaElement>('textarea');
    setTimeout(() => ta?.focus(), 320);
  };

  return (
    <WorkspaceLayout
      hero={<HeroSection onPrimaryAction={scrollToWorkspace} />}
      sidebar={<Sidebar />}
      main={
        <div ref={workspaceRef} className="h-full">
          <ConversationArea />
        </div>
      }
      context={<ContextPanel />}
    />
  );
}
