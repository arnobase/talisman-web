import Text from '@components/atoms/Text'

export type DescriptionListProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>

const Term = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <Text.Body as="dt" alpha="high" {...props} />
)

const Details = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <dd css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} {...props} />
)

const Description = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <div css={{ display: 'flex', justifyContent: 'space-between' }} {...props} />
)

const DescriptionList = Object.assign(
  (props: DescriptionListProps) => {
    return <dl {...props} />
  },
  { Description, Term, Details }
)

export default DescriptionList
