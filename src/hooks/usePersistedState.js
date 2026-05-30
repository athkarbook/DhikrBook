import { useEffect, useState } from 'react';

// useState that lazy-reads from localStorage and writes back on every change.
//
// Why: the natural pattern of `useState(initial)` + a separate "load on mount"
// effect races against persist effects — they fire with the initial value on
// the first commit, before the load effect's setState lands, so they clobber
// the saved data. Lazy init + co-located persist closes that hole and keeps
// the call-site to one line. Legacy values stored as plain ".toString()"
// (e.g. "5", "true") parse correctly via JSON.parse, so this is drop-in.
export function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full / private mode — give up silently rather than crash UI
    }
  }, [key, value]);

  return [value, setValue];
}
