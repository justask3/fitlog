import { useRef, useCallback, useEffect } from "react";
import type { ScrollView, LayoutChangeEvent } from "react-native";

/**
 * Scrolls a ScrollView of stacked month sections to the current month once
 * its layout is known. `active` should be true whenever the scroll surface
 * is actually visible (e.g. a modal's `visible` prop) so re-opening jumps
 * back to today instead of wherever the user last scrolled to.
 */
export function useScrollToCurrentMonth(active: boolean) {
  const scrollRef = useRef<ScrollView>(null);
  const offsetsRef = useRef<Map<string, number>>(new Map());
  const scrolledRef = useRef(false);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  useEffect(() => {
    if (!active) return;
    scrolledRef.current = false;
    const offset = offsetsRef.current.get(currentMonthKey);
    if (offset != null) {
      scrolledRef.current = true;
      scrollRef.current?.scrollTo({ y: offset, animated: false });
    }
    // currentMonthKey is derived fresh each render from Date.now(), not a stable dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const registerMonthLayout = useCallback(
    (key: string) => (e: LayoutChangeEvent) => {
      const y = e.nativeEvent.layout.y;
      offsetsRef.current.set(key, y);
      if (active && !scrolledRef.current && key === currentMonthKey) {
        scrolledRef.current = true;
        scrollRef.current?.scrollTo({ y, animated: false });
      }
    },
    [active, currentMonthKey]
  );

  return { scrollRef, registerMonthLayout, currentMonthKey };
}
