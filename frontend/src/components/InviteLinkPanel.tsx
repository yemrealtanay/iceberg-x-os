import React, { useState } from 'react';
import { Copy, Check, Link2, Clock } from 'lucide-react';

interface InviteLinkPanelProps {
  url: string;
  expiresAt?: string;
  name?: string;
  onDismiss?: () => void;
}

/**
 * Shows a freshly issued one-time invite link. The backend only ever returns
 * the raw token once, so this is the single opportunity to copy it — the panel
 * says so plainly rather than letting an admin close it and lose the link.
 */
export const InviteLinkPanel: React.FC<InviteLinkPanelProps> = ({ url, expiresAt, name, onDismiss }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable over plain http on some browsers; the input
      // below is selectable so the link can still be copied manually.
    }
  };

  return (
    <div className="bg-magenta/5 border border-magenta/20 rounded-2xl p-4 flex flex-col gap-3 animate-fadeIn">
      <div className="flex items-start gap-2">
        <Link2 className="w-4 h-4 text-magenta shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-gray-900">
            Invite link{name ? ` for ${name}` : ''}
          </p>
          <p className="text-[11px] text-gray-500 font-semibold leading-relaxed mt-0.5">
            Nothing is emailed automatically — copy this link and pass it on yourself.
            They use it to set their own password. It works once and is shown only now.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-mono text-gray-700 outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-magenta text-white text-[11px] font-bold rounded-xl hover:bg-magenta-hover transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        {expiresAt && (
          <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Expires {new Date(expiresAt).toLocaleString('tr-TR')}
          </p>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto text-[10px] font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
