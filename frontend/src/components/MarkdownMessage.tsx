import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-lg font-bold text-text-primary mt-3 mb-1 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold text-text-primary mt-3 mb-1 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-text-primary mt-2 mb-1 first:mt-0">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-0.5 mb-2 text-sm pl-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-0.5 mb-2 text-sm pl-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    return isBlock ? (
      <code className="block bg-gray-100 rounded-md px-3 py-2 text-xs font-mono overflow-x-auto mb-2">
        {children}
      </code>
    ) : (
      <code className="bg-gray-100 rounded px-1 py-0.5 text-xs font-mono">{children}</code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-gray-100 rounded-md px-3 py-2 text-xs font-mono overflow-x-auto mb-2 whitespace-pre-wrap">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/40 pl-3 italic text-text-secondary text-sm mb-2">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left text-xs font-semibold text-text-secondary px-3 py-2 border-b border-gray-200">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-b border-gray-100 text-text-primary">{children}</td>
  ),
  hr: () => <hr className="border-gray-200 my-2" />,
};

interface MarkdownMessageProps {
  content: string;
  streaming?: boolean;
}

export default function MarkdownMessage({ content, streaming = false }: MarkdownMessageProps) {
  return (
    <div className="min-w-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
      {streaming && (
        <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
      )}
    </div>
  );
}
