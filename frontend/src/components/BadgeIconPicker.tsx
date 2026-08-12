import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { BADGE_ICONS, BADGE_ICON_GROUPS } from '../utils/badgeIcons';
import { getRarityMeta } from '../utils/badgeRarity';

/**
 * Grid picker over the badge icon catalogue, with search and group filtering.
 * The selected icon is previewed in the badge's own rarity treatment so the
 * choice is judged in context rather than as a grey glyph.
 */
export const BadgeIconPicker: React.FC<{
  value: string;
  rarity: string;
  onChange: (iconKey: string) => void;
}> = ({ value, rarity, onChange }) => {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('');

  const meta = getRarityMeta(rarity);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BADGE_ICONS.filter(icon => {
      const matchesGroup = group ? icon.group === group : true;
      const matchesQuery = q
        ? icon.label.toLowerCase().includes(q) ||
          icon.key.includes(q) ||
          icon.group.toLowerCase().includes(q)
        : true;
      return matchesGroup && matchesQuery;
    });
  }, [query, group]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${BADGE_ICONS.length} icons…`}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none focus:border-magenta"
          />
        </div>
        <select
          value={group}
          onChange={e => setGroup(e.target.value)}
          className="px-2.5 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none cursor-pointer"
        >
          <option value="">All groups</option>
          {BADGE_ICON_GROUPS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/60 p-2">
        {results.length > 0 ? (
          <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
            {results.map(({ key, label, Icon }) => {
              const isSelected = key === value;
              return (
                <button
                  key={key}
                  type="button"
                  title={label}
                  onClick={() => onChange(key)}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                    isSelected
                      ? `${meta.disc} ${meta.iconClass} scale-105`
                      : 'bg-white border border-gray-100 text-gray-500 hover:border-magenta/40 hover:text-magenta'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 font-semibold text-center py-6">
            No icons match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
};
