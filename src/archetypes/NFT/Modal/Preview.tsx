import '@google/model-viewer'

import AudioPlaceholder from '@assets/generic-audio.png'
import ImagePlaceholder from '@assets/generic-image.png'
import ModelPlaceholder from '@assets/generic-model.png'
// Placeholders
import PDFPlaceholder from '@assets/generic-pdf.png'
import UnknownPlaceholder from '@assets/generic-unknown.png'
import VideoPlaceholder from '@assets/generic-video.png'
import { Spinner } from '@components'
import styled from '@emotion/styled'
import { getNFTType } from '@libs/@talisman-nft'
import { NFTDetail } from '@libs/@talisman-nft/types'
import { useEffect, useMemo, useState } from 'react'

type PreviewType = {
  className?: string
  nft?: NFTDetail
  loading: boolean
}

const MediaPreview = ({ mediaUri, thumb, type, name, id }: NFTDetail) => {
  const [fetchedType, setFetchedType] = useState<string | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!fetchedType) {
      setIsLoading(true)
      getNFTType(mediaUri).then(type => {
        setFetchedType(type)
      })
      setIsLoading(false)
    }
  }, [fetchedType, mediaUri])

  const effectiveType = useMemo(() => {
    if (type) return type
    if (isLoading) return 'loading'
    return fetchedType ?? null
  }, [type, isLoading, fetchedType])

  switch (effectiveType) {
    case 'image':
      return <img loading="lazy" src={mediaUri || ImagePlaceholder} alt={name || id} />
    case 'video':
      if (!mediaUri) return <img loading="lazy" src={VideoPlaceholder} alt={name || id} />
      return <video src={mediaUri} loop muted playsInline preload="metadata" controls={true} />
    case 'pdf':
    case 'application':
      if (!mediaUri) return <img loading="lazy" alt={name || id} src={PDFPlaceholder} />
      return <embed src={`${mediaUri}#toolbar=0`} />
    case 'audio':
      return (
        <>
          <img loading="lazy" alt={name || id} src={thumb || AudioPlaceholder} />
          <audio
            controls
            style={{
              position: 'absolute',
              bottom: '0px',
              width: '100%',
            }}
          >
            <source src={mediaUri} />
          </audio>
        </>
      )
    case 'model':
      if (!mediaUri) return <img loading="lazy" alt={name || id} src={ModelPlaceholder} />
      const modelProps = {
        'src': mediaUri,
        'alt': name || id,
        'autoplay': 'true',
        'camera-controls': 'true',
        'shadow-intensity': '1',
        'ar-status': 'not-presenting',
      }
      return <model-viewer {...modelProps} />
    default:
      return <img loading="lazy" alt={name || id} src={UnknownPlaceholder} />
  }
}

const Preview = ({ className, nft, loading }: PreviewType) => {
  if (loading) {
    return (
      <section className={className}>
        <Spinner />
      </section>
    )
  }

  return <section className={className}>{!!nft && <MediaPreview {...nft} />}</section>
}

const StyledPreview = styled(Preview)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: transparent;
  background-color: var(--color-dark);

  > * {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

export default StyledPreview
