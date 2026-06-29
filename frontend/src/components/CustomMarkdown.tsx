import React from 'react';
import ReactMarkdown from 'react-markdown';

const formatExternalUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const markdownComponents = {
  a: ({ href, children, ...props }: any) => {
    let targetHref = href || '';
    const text = typeof children === 'string' ? children : String(children || '');

    // Handle common markdown link paste error: [https://some-link.com](url)
    // or when the href is literally 'url'
    if ((!targetHref || targetHref === 'url') && (text.startsWith('http') || text.includes('.'))) {
      targetHref = text;
    }

    const absoluteHref = formatExternalUrl(targetHref);

    return (
      <a
        href={absoluteHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-magenta hover:underline break-all font-bold"
        {...props}
      >
        {children}
      </a>
    );
  }
};

interface CustomMarkdownProps {
  children: string;
  className?: string;
}

export const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ children, className }) => {
  return (
    <ReactMarkdown components={markdownComponents} className={className}>
      {children}
    </ReactMarkdown>
  );
};
