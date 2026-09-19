import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy } from 'lucide-react'
import { DURATION, EASE } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  Ghost icon button that copies the email address, then confirms it twice:   */
/*  the icon swaps Copy → Check, and a toast slides up at the bottom of the    */
/*  screen (the toast is also what a screen reader announces).                 */
/* -------------------------------------------------------------------------- */

const TOAST_DURATION_MS = 4000

type CopyResult = 'copied' | 'failed'

const TOAST_MESSAGE: Record<CopyResult, string> = {
  copied: 'Email copied',
  // Kept short: the toast is a one-line pill, also on a 360px screen
  failed: 'Couldn’t copy — select the address',
}

/**
 * Fallback for browsers / pages without the async Clipboard API (it only exists on
 * https and localhost): select the text inside an invisible field and ask the
 * browser to copy the selection.
 */
function copyViaSelection(text: string): boolean {
  const previousFocus = document.activeElement

  const field = document.createElement('textarea')
  field.value = text
  field.readOnly = true
  // Fixed + transparent: the page neither jumps nor flashes while the field exists
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()

  let succeeded: boolean
  try {
    succeeded = document.execCommand('copy')
  } catch {
    succeeded = false
  }

  field.remove()
  // Selecting the field stole the keyboard focus: hand it back to the button
  if (previousFocus instanceof HTMLElement) previousFocus.focus()
  return succeeded
}

async function copyText(text: string): Promise<CopyResult> {
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    // Clipboard API missing or blocked by the browser → try the old way
    return copyViaSelection(text) ? 'copied' : 'failed'
  }
}

interface CopyEmailButtonProps {
  email: string
}

export function CopyEmailButton({ email }: CopyEmailButtonProps) {
  // A NEW object on every click, so the effect below restarts its timer each time
  const [toast, setToast] = useState<{ result: CopyResult } | null>(null)
  const justCopied = toast?.result === 'copied'

  // Auto-dismiss. The cleanup cancels the timer on a second click and on unmount.
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  const handleClick = async () => {
    const result = await copyText(email)
    setToast({ result })
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Copy email address"
        // 44px touch target. white/40 (not lower) keeps the ring at 3:1 against the panel.
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-[background-color,border-color,transform] duration-300 ease-soft hover:border-white hover:bg-white/10 active:scale-[0.94]"
      >
        {/* mode="wait": the old icon shrinks away BEFORE the new one grows in */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={justCopied ? 'check' : 'copy'}
            aria-hidden="true"
            className="inline-flex"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: DURATION.micro, ease: EASE.outExpo }}
          >
            {justCopied ? <Check size={18} strokeWidth={1.5} /> : <Copy size={18} strokeWidth={1.5} />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/*
        The toast is rendered straight into <body> (a portal) for two reasons:
        1. the Contact panel is scaled with a CSS transform, and `position: fixed`
           inside a transformed element is no longer relative to the screen;
        2. the panel clips its overflow.
        It therefore lives OUTSIDE the always-dark panel → normal theme colours.
      */}
      {createPortal(
        // The status region stays mounted: screen readers only announce changes
        // inside a live region that already existed before the text appeared.
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
        >
          <AnimatePresence>
            {toast ? (
              <motion.p
                key="toast"
                className="flex items-center gap-2.5 rounded-full bg-fg py-3 ps-4 pe-5 text-[0.875rem] font-medium text-bg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: DURATION.small, ease: EASE.outExpo }}
              >
                {toast.result === 'copied' ? (
                  <Check aria-hidden="true" size={16} strokeWidth={2} className="shrink-0" />
                ) : null}
                {TOAST_MESSAGE[toast.result]}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  )
}
