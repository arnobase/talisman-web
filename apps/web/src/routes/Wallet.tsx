import { Wallet } from '@archetypes'
import { Crowdloans } from '@archetypes/Wallet'
import { DesktopRequired } from '@components'
import MainBanner from '@components/recipes/MainBanner'
import styled from '@emotion/styled'
import { device } from '@util/breakpoints'
import { isMobileBrowser } from '@util/helpers'

import OwnPools from '../archetypes/NominationPools/OwnPools'

const _Wallet = styled(({ className }: { className?: string }) => (
  <section className={className}>
    {isMobileBrowser() && <DesktopRequired />}
    <header>
      <div className="account-overview">
        <Wallet.Total />
      </div>
      <div className="banner">
        <MainBanner />
      </div>
    </header>
    <Wallet.Assets />
    <Crowdloans />
    <OwnPools />
  </section>
))`
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  @media ${device.xl} {
    margin: 6rem auto;
  }
  padding: 0 2.4rem;

  > * + * {
    margin-top: 6rem;
  }

  .account-overview {
    display: flex;
    flex-wrap: wrap-reverse;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex: 1;

    @media ${device.xxl} {
      width: auto;
      display: flex;
      flex-direction: column-reverse;
      align-items: start;
    }
  }

  .banner {
    min-width: 70%;
    flex: 5;
  }

  > header {
    display: flex;
    gap: 4rem;
    flex-wrap: wrap-reverse;
    align-items: center;
    margin-bottom: 4rem;
  }
`

export default _Wallet
