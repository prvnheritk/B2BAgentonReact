import { useMemo } from 'react';
import { ActionsRenderer, type ActionDef } from './ActionsRenderer';
import { ChartRenderer } from './ChartRenderer';
import { CitationRenderer } from './CitationRenderer';
import { KPIWidgetRenderer, type KPI } from './KPIWidgetRenderer';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TimelineRenderer, type TimelineEntry } from './TimelineRenderer';
import type { Citation } from '@/types/conversation';

interface Props {
  source: string;
  onPrompt?: (text: string) => void;
}

/**
 * Splits the assistant response into fenced "smart" blocks
 * (```kpi, ```chart, ```timeline, ```citations, ```actions)
 * and renders each segment with the right component.
 */
export function SmartResponseRenderer({ source, onPrompt }: Props) {
  const segments = useMemo(() => parseSegments(source), [source]);

  return (
    <div className="space-y-2">
      {segments.map((seg, i) => {
        switch (seg.kind) {
          case 'kpi':
            return <KPIWidgetRenderer key={i} data={seg.data as KPI[]} />;
          case 'chart': {
            const c = seg.data as { type: 'bar' | 'line'; data: { label: string; value: number }[]; title?: string };
            return <ChartRenderer key={i} type={c.type} data={c.data} title={c.title} />;
          }
          case 'timeline':
            return <TimelineRenderer key={i} entries={seg.data as TimelineEntry[]} />;
          case 'citations':
            return <CitationRenderer key={i} citations={seg.data as Citation[]} />;
          case 'actions':
            return <ActionsRenderer key={i} actions={seg.data as ActionDef[]} onPrompt={onPrompt} />;
          case 'markdown':
          default:
            return <MarkdownRenderer key={i} source={seg.raw} />;
        }
      })}
    </div>
  );
}

type SegmentKind = 'markdown' | 'kpi' | 'chart' | 'timeline' | 'citations' | 'actions';

interface Segment {
  kind: SegmentKind;
  raw: string;
  data?: unknown;
}

const KNOWN = new Set(['kpi', 'chart', 'timeline', 'citations', 'actions']);
const fence = /```(\w+)?\n([\s\S]*?)```/g;

function parseSegments(src: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = fence.exec(src)) !== null) {
    const lang = (m[1] || '').toLowerCase();
    if (!KNOWN.has(lang)) continue;

    if (m.index > last) {
      const head = src.slice(last, m.index).trim();
      if (head) out.push({ kind: 'markdown', raw: head });
    }
    try {
      const data = JSON.parse(m[2]);
      out.push({ kind: lang as SegmentKind, raw: m[0], data });
    } catch {
      // fall back to rendering as a code block in markdown
      out.push({ kind: 'markdown', raw: m[0] });
    }
    last = fence.lastIndex;
  }
  if (last < src.length) {
    const tail = src.slice(last).trim();
    if (tail) out.push({ kind: 'markdown', raw: tail });
  }
  if (!out.length) out.push({ kind: 'markdown', raw: src });
  return out;
}
