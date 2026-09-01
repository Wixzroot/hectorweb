import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Bold, 
  Quote, 
  Table as TableIcon, 
  Eye, 
  Edit3, 
  Columns,
  Info
} from 'lucide-react';

interface MarkdownEditorWithPreviewProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  heightClass?: string;
}

export const MarkdownEditorWithPreview: React.FC<MarkdownEditorWithPreviewProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Type markdown here...',
  heightClass = 'h-96'
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  const insertHelper = (syntax: string, suffix: string = '') => {
    const textarea = document.getElementById(`editor-${label}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = syntax + (selected || suffix) + (suffix ? '' : '');
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    onChange(newValue);

    // Refocus and place cursor
    setTimeout(() => {
      textarea.focus();
      const newPos = start + syntax.length + (selected ? selected.length : suffix.length);
      textarea.setSelectionRange(newPos, newPos);
    }, 50);
  };

  return (
    <div className="bg-[#0e0a1a] border border-purple-900/40 rounded-2xl overflow-hidden flex flex-col">
      {/* Header with control bar */}
      <div className="px-5 py-3.5 bg-[#120d24] border-b border-purple-900/30 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{label}</h4>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Tools */}
          <div className="flex items-center gap-1 bg-[#090614] border border-purple-900/40 rounded-lg p-1">
            <button
              onClick={() => insertHelper('# ', 'Heading 1')}
              title="Add Heading 1"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-purple-950/40 rounded transition-colors"
            >
              <Heading1 size={13} />
            </button>
            <button
              onClick={() => insertHelper('## ', 'Heading 2')}
              title="Add Heading 2"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-purple-950/40 rounded transition-colors"
            >
              <Heading2 size={13} />
            </button>
            <button
              onClick={() => insertHelper('**', '**')}
              title="Make Bold"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-purple-950/40 rounded transition-colors"
            >
              <Bold size={13} />
            </button>
            <button
              onClick={() => insertHelper('* ')}
              title="Bullet List"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-purple-950/40 rounded transition-colors"
            >
              <List size={13} />
            </button>
            <button
              onClick={() => insertHelper('1. ')}
              title="Numbered List"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-purple-950/40 rounded transition-colors"
            >
              <ListOrdered size={13} />
            </button>
            <button
              onClick={() => insertHelper('> ', 'Blockquote')}
              title="Blockquote"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-purple-950/40 rounded transition-colors"
            >
              <Quote size={13} />
            </button>
            <button
              onClick={() => insertHelper('\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Value 1 | Value 2 |\n')}
              title="Insert Table"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-purple-950/40 rounded transition-colors"
            >
              <TableIcon size={13} />
            </button>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-[#090614] border border-purple-900/40 rounded-lg p-1">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === 'edit' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 size={11} /> Editor
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`hidden md:flex px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all items-center gap-1.5 ${
                viewMode === 'split' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns size={11} /> Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === 'preview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye size={11} /> Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-purple-900/30' : 'grid-cols-1'} ${heightClass}`}>
        {/* Editor Screen */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className="relative flex-1 flex flex-col h-full bg-[#0a0714]">
            <textarea
              id={`editor-${label}`}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full flex-1 p-5 text-xs text-slate-100 bg-transparent resize-none outline-none font-mono leading-relaxed select-text"
              style={{ minHeight: '200px' }}
            />
            <div className="px-4 py-1.5 bg-[#090612] text-[9px] font-mono text-slate-500 border-t border-purple-900/20 text-right uppercase">
              Markdown Editor • {value ? value.length : 0} characters
            </div>
          </div>
        )}

        {/* Live Preview Screen */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="flex-1 overflow-y-auto bg-[#07050d] p-5 h-full relative scrollbar-thin">
            {value ? (
              <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-purple-400 prose-strong:text-white text-xs sm:text-sm text-slate-300">
                <div className="markdown-body whitespace-pre-wrap leading-relaxed">
                  <Markdown>{value}</Markdown>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                <Info size={16} className="text-purple-500/50" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Live Preview Output</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
