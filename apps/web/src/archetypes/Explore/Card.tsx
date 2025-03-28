import styled from '@emotion/styled'
import { device } from '@util/breakpoints'
import posthog from 'posthog-js'

type CardProps = {
  className?: string
  dapp: any
  setSelectedTag: (tag: string) => unknown
}

const toExternalDapp = (dapp: any) => {
  const categories = dapp.tags.reduce(
    (acc: any, tag: string) => ({
      ...acc,
      [`category_${tag.replace(/[^\w]/, '')}'`]: true,
    }),
    {}
  )

  posthog.capture('Goto Dapp', { dappName: dapp.name, dappUrl: dapp.url, ...categories })
  window.open(dapp.url, '_blank', 'noopener,noreferrer')
}

const Card = ({ className, dapp, setSelectedTag }: CardProps) => {
  return (
    <div className={className} key={dapp.id} onClick={() => toExternalDapp(dapp)}>
      <div className="card__header">
        <img src={dapp.logoUrl} alt={dapp.name + ' logo'} className="logo" />
        <img src={dapp.logoUrl} alt={dapp.name + ' logo'} className="logoBG" />
      </div>
      <div className="card-body">
        <span>
          <h3>{dapp.name}</h3>
          <p>{dapp.description}</p>
        </span>
        <span>
          {!!dapp.tags &&
            dapp.tags.map((tag: any) => (
              <span
                className="tag"
                key={tag}
                onClick={event => {
                  event.stopPropagation()
                  setSelectedTag(tag)
                }}
              >
                {tag}
              </span>
            ))}
        </span>
      </div>
    </div>
  )
}

const StyledCard = styled(Card)`
  cursor: pointer;
  background: #1e1e1e;
  border-radius: 1rem;
  border: 1px solid transparent;
  overflow: hidden;
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.2s;
  .card__header {
    min-height: 175px;
    max-height: 175px;
    overflow: hidden;
    position: relative;
  }
  .logo {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1.5em;
    z-index: 2;
  }
  .logoBG {
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(150px) saturate(3);
    z-index: 1;
    height: 100%;
    width: 100%;
  }
  .card-body {
    flex-grow: 2;
    justify-content: space-between;

    display: flex;
    flex-direction: column;

    padding: 2rem;
    h3 {
      font-size: 2rem;
    }
    p {
      font-size: 1.5rem;
      color: var(--color-mid);
    }
    a {
      background: #ffbd00;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      color: #1e1e1e;
      font-weight: bold;
      text-decoration: none;
    }
    .tag {
      font-size: 1rem;
      margin: 0.5rem 0.5rem 0 0;
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--color-activeBackground);
      border-radius: 1rem;
      color: var(--color-mid);
      transition: 0.2s;
    }

    display: flex;
    flex-direction: column;

    padding: 2rem;
    h3 {
      font-size: 2rem;
    }
    p {
      font-size: 1.5rem;
      color: var(--color-mid);
    }
    a {
      background: #ffbd00;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      color: #1e1e1e;
      font-weight: bold;
      text-decoration: none;
    }
    .tag {
      font-size: 1rem;
      margin: 0.5rem 0.5rem 0 0;
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--color-activeBackground);
      border-radius: 1rem;
      color: var(--color-mid);
      transition: 0.2s;
    }

    .tag:hover {
      background: var(--color-dim);
      transition: 0.2s;
    }
  }
  height: 450px;

  :nth-child(-n + 3) {
    grid-column: span 3;
    @media ${device.lg} {
      grid-column: span 4;
    }
  }

  :hover {
    border: 1px solid rgb(90, 90, 90);
    transition: 0.2s;
  }
`

export default StyledCard
