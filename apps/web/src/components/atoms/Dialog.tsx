import useMergedRef from '@react-hook/merged-ref'
import React, { useEffect, useMemo, useRef } from 'react'

export type DialogProps = Omit<
  React.DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>,
  'ref'
> & {
  isModal?: boolean
  onClickBackdrop?: () => unknown
}

export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  { open, isModal = true, onClickBackdrop, ...props },
  ref
) {
  const innerRef = useRef<HTMLDialogElement>()
  const mergedRef = useMergedRef(ref, innerRef)

  useEffect(() => {
    if (open) {
      if (innerRef.current?.open === false) {
        if (isModal) {
          innerRef.current?.showModal()
        } else {
          innerRef.current?.show()
        }
      }
    } else {
      if (innerRef.current?.open) {
        innerRef.current?.close()
      }
    }
  }, [isModal, open])

  useEffect(() => {
    const listener = function (this: HTMLDialogElement, event: MouseEvent) {
      const rect = this.getBoundingClientRect()
      if (
        event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < rect.left ||
        event.clientX > rect.right
      ) {
        onClickBackdrop?.()
      }
    }

    const dialog = innerRef.current

    dialog?.addEventListener('click', listener)

    return () => dialog?.removeEventListener('click', listener)
  }, [onClickBackdrop])

  return useMemo(() => {
    return <dialog ref={mergedRef} {...props} />
  }, [mergedRef, props])
})

export default Dialog
