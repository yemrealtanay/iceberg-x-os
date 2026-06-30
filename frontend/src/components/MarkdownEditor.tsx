import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Heading3, List, Code, Link as LinkIcon, Eye, Edit3 } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  required = false,
  disabled = false,
  id
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const replacement = before + (selectedText || 'text') + after;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    onChange(newValue);

    // Keep focus and select inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selectedText || 'text').length
      );
    }, 0);
  };

  return (
    <div className="w-full border border-gray-150 rounded-xl overflow-hidden bg-white shadow-subtle flex flex-col focus-within:border-magenta focus-within:ring-1 focus-within:ring-magenta/20 transition-all">
      {/* Editor Toolbar Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-3.5 py-1.5 flex items-center justify-between gap-4 flex-wrap">
        
        {/* Formatting Actions (only visible in write tab) */}
        <div className={`flex items-center gap-1 transition-opacity duration-200 ${activeTab === 'write' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <button
            type="button"
            onClick={() => insertMarkdown('**', '**')}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-200/60 rounded text-gray-500 hover:text-gray-900 transition-colors"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={() => insertMarkdown('*', '*')}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-200/60 rounded text-gray-500 hover:text-gray-900 transition-colors"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('### ', '')}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-200/60 rounded text-gray-500 hover:text-gray-900 transition-colors"
            title="Heading (### text)"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-gray-200 mx-1"></div>

          <button
            type="button"
            onClick={() => insertMarkdown('- ', '')}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-200/60 rounded text-gray-500 hover:text-gray-900 transition-colors"
            title="List (- item)"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('`', '`')}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-200/60 rounded text-gray-500 hover:text-gray-900 transition-colors"
            title="Inline Code (`code`)"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertMarkdown('[', '](url)')}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-200/60 rounded text-gray-500 hover:text-gray-900 transition-colors"
            title="Link ([text](url))"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-200/60 p-0.5 rounded-lg text-xs font-bold text-gray-600 self-end">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${
              activeTab === 'write'
                ? 'bg-white text-magenta shadow-sm'
                : 'hover:text-gray-900'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Write</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-magenta shadow-sm'
                : 'hover:text-gray-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative min-h-[140px] bg-white flex flex-col">
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            id={id}
            required={required}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full h-full min-h-[140px] p-4 outline-none resize-y text-xs font-semibold text-gray-800 placeholder-gray-400 border-0 focus:ring-0 focus:outline-none"
          />
        ) : (
          <div className="w-full h-full min-h-[140px] p-4 overflow-y-auto max-h-[400px] border-0 select-text">
            {value.trim() ? (
              <div className="markdown-body text-xs font-semibold text-gray-800">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-400 text-xs italic">Nothing to preview. Start typing in the Write tab.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
