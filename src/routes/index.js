import { Redirect, Route, Switch } from 'react-router-dom'

import Layout from '../layout'
import Buy from './Buy'
import Home from './Home'
import NFTsPage from './NFTsPage'
import Wallet from './Wallet'

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route exact path="/portfolio">
      <Layout>
        <Wallet />
      </Layout>
    </Route>
    <Route exact path="/nfts">
      <Layout>
        <NFTsPage />
      </Layout>
    </Route>
    <Route
      path="/spiritkeys"
      component={() => {
        window.location.replace('https://talisman.xyz/download')
        return null
      }}
    />
    <Route exact path="/buy">
      <Layout>
        <Buy />
      </Layout>
    </Route>
    <Route path="*">
      <Redirect to="/" />
    </Route>
  </Switch>
)

export default Routes
