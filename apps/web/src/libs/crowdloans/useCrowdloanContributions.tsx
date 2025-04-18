import { polkadotAccountsState } from '@domains/accounts/recoils'
import { chainApiState } from '@domains/chains/recoils'
import { SupportedRelaychains } from '@libs/talisman/util/_config'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

export type CrowdloanContribution = {
  id: string
  account: string
  amount: string

  // the associated parachain
  parachain: { paraId: string }

  // the associated crowdloan
  fund: { id: string }
}

export function useCrowdloanContributions({
  accounts,
  crowdloans,
}: { accounts?: string[]; crowdloans?: string[] } = {}): {
  contributions: CrowdloanContribution[]
  hydrated: boolean
} {
  // TODO: clean me or kill me
  const apiLoadable = useRecoilValueLoadable(waitForAll([chainApiState('polkadot'), chainApiState('kusama')]))

  const allAccounts = useRecoilValue(polkadotAccountsState)
  const [contributions, setContributions] = useState<CrowdloanContribution[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(
    () => {
      ;(async () => {
        setHydrated(false)
        const results = await Promise.all(
          Object.values(SupportedRelaychains).map(async relayChain => {
            const apis = await apiLoadable.toPromise()
            const api = relayChain.id === 0 ? apis[0] : apis[1]

            const paraIds =
              crowdloans?.map(x => Maybe.of(x.split('-')[1]).mapOr(0, x => parseInt(x))) ??
              (await api.query.crowdloan.funds.keys().then(x => x.map(y => y.args[0].toNumber()))) ??
              []

            const accountsHex = (accounts ?? allAccounts.map(x => x.address)).map(a => u8aToHex(decodeAddress(a))) ?? []

            const contributions = await Promise.all(
              paraIds.map(id => api.derive.crowdloan.ownContributions(id, accountsHex))
            )

            // TODO: axe everything this is only to support legacy UI
            return contributions
              .flatMap((x, index) =>
                Object.entries(x).map(([account, contributed]) => ({
                  id: `${relayChain.id}-${paraIds[index]}`,
                  account: account.toString(),
                  amount: contributed.toString(),
                  parachain: {
                    paraId: `${relayChain.id}-${paraIds[index]}`,
                  },
                  fundId: `${relayChain.id}-${paraIds[index]}`,
                  fund: {
                    id: `${relayChain.id}-${paraIds[index]}`,
                  },
                }))
              )
              .filter(x => x.amount !== '0')
          })
        )

        setContributions(results.flat())
        setHydrated(true)
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(accounts), JSON.stringify(crowdloans), JSON.stringify(allAccounts)]
  )

  return {
    contributions,
    hydrated,
  }
}

//
// Helpers (exported)
//

export function groupTotalContributionsByCrowdloan(contributions: CrowdloanContribution[]) {
  return contributions.reduce((perCrowdloan, contribution) => {
    if (!perCrowdloan[contribution.fund.id]) perCrowdloan[contribution.fund.id] = '0'
    perCrowdloan[contribution.fund.id] =
      new BigNumber(perCrowdloan[contribution.fund.id] ?? 0).plus(contribution.amount).toString() ??
      perCrowdloan[contribution.fund.id]
    return perCrowdloan
  }, {} as { [key: string]: string })
}

export function getTotalContributionForCrowdloan(crowdloan: string, contributions: CrowdloanContribution[]) {
  return contributions
    .filter(contribution => contribution.fund.id === crowdloan)
    .map(contribution => contribution.amount)
    .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
    .toString()
}
