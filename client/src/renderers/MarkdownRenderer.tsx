import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/cn';
import 'highlight.js/styles/atom-one-dark.css';

interface Props {
  source: string;
  className?: string;
}

// Allow common inline/block tags so Agentforce responses that mix markdown
// with raw HTML render correctly. We use rehype-sanitize to keep this safe.
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'span', 'div', 'br', 'sub', 'sup', 'small', 'mark', 'kbd', 'abbr',
    'details', 'summary', 'figure', 'figcaption',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'style'],
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
  },
};

export function MarkdownRenderer({ source, className }: Props) {
  const safeSource = source ?? '';
  if (!safeSource.trim()) {
    return (
      <span className="text-muted-foreground italic">
        (Agentforce returned an empty response.)
      </span>
    );
  }

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        'prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-h1:text-xl prose-h2:text-lg prose-h3:text-base',
        'prose-p:my-2 prose-p:leading-relaxed',
        'prose-strong:text-foreground prose-em:text-foreground',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5',
        'prose-code:text-[0.85em] prose-code:before:hidden prose-code:after:hidden',
        'prose-pre:bg-muted/60 prose-pre:border prose-pre:border-border prose-pre:rounded-lg',
        'prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-3',
        'prose-blockquote:text-muted-foreground prose-blockquote:not-italic',
        'prose-ul:my-2 prose-ol:my-2 prose-li:my-0',
        'prose-table:text-sm prose-th:bg-muted/50',
        'dark:prose-invert text-foreground',
        'whitespace-pre-wrap break-words',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={{
          a: ({ node: _n, ...p }) => <a {...p} target="_blank" rel="noreferrer noopener" />,
        }}
      >
        {safeSource}
      </ReactMarkdown>
    </div>
  );
}
