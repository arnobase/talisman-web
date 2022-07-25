import { useNftById } from '@libs/@talisman-nft/hooks'
import { device } from '@util/breakpoints'
import { Suspense } from 'react'
import styled from 'styled-components'

import Info from './Info'
import Preview from './Preview'

type ModalProps = {
  className?: string
  id: string
}

const Modal = ({ className, id }: ModalProps) => {
  const { nft } = useNftById(id)

  return (
    <div className={className}>
      <Preview nft={nft} />
      <Suspense fallback={null}>
        <Info nft={nft} />
      </Suspense>
    </div>
  )
}

const StyledModal = styled(Modal)`
  display: grid;

  @media ${device.sm} {
    grid-template-columns: 1fr;
    width: 100%;
  }

  @media ${device.lg} {
    grid-template-columns: 1fr 1fr;
    width: 905px;
    max-height: 1500px;
  }
`

export default StyledModal
