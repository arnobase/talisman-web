import { ComponentMeta, Story } from '@storybook/react'

import Identicon, { IdenticonProps } from './Identicon'

export default {
  title: 'Atoms/Identicon',
  component: Identicon,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Identicon>

export const Default: Story<IdenticonProps> = args => <Identicon {...args} />

Default.args = {
  value: '1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS',
}
