import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`markdown-content font-sans text-xs leading-relaxed text-slate-200 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({ children }) => (
            <strong className="font-bold text-cyan-200 tracking-wide bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-800/40">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-cyan-100/90">{children}</em>
          ),
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed text-slate-200">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-sm font-bold text-cyan-300 border-b border-cyan-800/40 pb-1 mt-3 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-cyan-500 rounded-sm inline-block"></span>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs font-bold text-cyan-300 mt-2.5 mb-1.5 flex items-center gap-1.5">
              <span className="w-1 h-3 bg-cyan-500/80 rounded-sm inline-block"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-semibold text-cyan-200 mt-2 mb-1">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1 pl-1 list-none">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1 pl-4 list-decimal text-slate-300 marker:text-cyan-400">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-slate-200 leading-relaxed">
              <span className="text-cyan-400 select-none mt-0.5">•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          hr: () => (
            <hr className="border-t border-cyan-800/40 my-3" />
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-cyan-500/80 bg-cyan-950/30 px-3 py-1.5 my-2 text-cyan-200/90 rounded-r text-[11px] italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-2.5 overflow-x-auto rounded-lg border border-cyan-800/50 bg-[#060b18] shadow-lg shadow-cyan-950/20">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-cyan-950/60 border-b border-cyan-800/60 text-cyan-300 uppercase tracking-wider text-[10px]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-cyan-900/30">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold border-r border-cyan-900/30 last:border-r-0 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-1.5 text-slate-200 border-r border-cyan-900/20 last:border-r-0">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-cyan-900/20 transition-colors">
              {children}
            </tr>
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || '');
            const rawString = String(children);
            const isInline = !match && !rawString.includes('\n');

            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 font-mono text-[11px]">
                  {children}
                </code>
              );
            }

            const codeString = rawString.replace(/\n$/, '');

            return (
              <div className="relative group my-2.5 rounded-lg border border-cyan-900/60 bg-[#040812] overflow-hidden shadow-inner">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-cyan-900/40 text-[10px] text-cyan-400 font-mono">
                  <span className="uppercase tracking-wider">{match ? match[1] : 'code'}</span>
                  <button
                    onClick={() => handleCopy(codeString)}
                    type="button"
                    className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition"
                    title="Copy code"
                  >
                    {copiedCode === codeString ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-mono">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="font-mono">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed bg-black/40">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
