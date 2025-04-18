import BaseUnstakeDialog from '@components/recipes/UnstakeDialog'
import { useLockDuration } from '@domains/nominationPools/hooks/useLockDuration'
import { useValidatorUnstakeForm } from '@domains/staking/hooks'
import { formatDistance } from 'date-fns'
import { useCallback, useEffect } from 'react'

const ValidatorUnstakeDialog = (props: { accountAddress: string; open: boolean; onRequestDismiss: () => unknown }) => {
  const lockDuration = useLockDuration()

  const {
    extrinsic: unbondExtrinsic,
    isReady,
    input: { amount, decimalAmount, localizedFiatAmount },
    available,
    resulting,
    setAmount,
    error: inputError,
  } = useValidatorUnstakeForm(props.open ? props.accountAddress : undefined)

  useEffect(
    () => {
      if (unbondExtrinsic.state === 'loading' && unbondExtrinsic.contents?.status.isInBlock) {
        props.onRequestDismiss()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unbondExtrinsic.contents?.status?.isInBlock]
  )

  const isLeaving = available.decimalAmount !== undefined && decimalAmount?.atomics.eq(available.decimalAmount.atomics)

  return (
    <BaseUnstakeDialog
      isError={inputError !== undefined}
      open={props.open}
      availableAmount={available.decimalAmount?.toHuman() ?? '...'}
      amount={amount}
      onChangeAmount={setAmount}
      fiatAmount={localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toHuman() ?? '...'}
      newFiatAmount={resulting.localizedFiatAmount ?? '...'}
      inputSupportingText={inputError?.message}
      lockDuration={lockDuration === undefined ? '...' : formatDistance(0, lockDuration.toNumber())}
      onDismiss={props.onRequestDismiss}
      onConfirm={useCallback(() => {
        if (decimalAmount !== undefined) {
          if (isLeaving) {
            unbondExtrinsic.unbondAll(props.accountAddress).finally(() => props.onRequestDismiss())
          } else {
            unbondExtrinsic
              .signAndSend(props.accountAddress, decimalAmount?.atomics)
              .finally(() => props.onRequestDismiss())
          }
        }
      }, [props, decimalAmount, isLeaving, unbondExtrinsic])}
      onRequestMaxAmount={() => {
        if (available.decimalAmount !== undefined) {
          setAmount(available.decimalAmount?.toString())
        }
      }}
      confirmState={
        !isReady || inputError !== undefined || decimalAmount?.atomics.isZero()
          ? 'disabled'
          : unbondExtrinsic.state === 'loading'
          ? 'pending'
          : undefined
      }
    />
  )
}

export default ValidatorUnstakeDialog
