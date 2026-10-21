"use client";

import { useState, useCallback } from "react";

interface UseCopyToClipboardReturn {
  /** Whether the text was just copied (resets after `resetDelay` ms) */
  copied: boolean;
  /** Call with the text to copy to clipboard */
  copy: (text: string) => Promise<void>;
}

/**
 * Custom hook for copying text to the clipboard.
 * Provides a `copied` flag that auto-resets after a configurable delay.
 *
 * @param resetDelay - How long (ms) to show "copied" feedback. Default: 2200ms
 *
 * @example
 * const { copied, copy } = useCopyToClipboard();
 * <button onClick={() => copy(email)}>
 *   {copied ? "Copied!" : "Copy"}
 * </button>
 */
export function useCopyToClipboard(
  resetDelay = 2200,
): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn("[useCopyToClipboard] Clipboard API not available.");
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      } catch (err) {
        console.error("[useCopyToClipboard] Failed to copy:", err);
        setCopied(false);
      }
    },
    [resetDelay],
  );

  return { copied, copy };
}
