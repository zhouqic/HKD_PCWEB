import _ from 'lodash';

import MainRoute from './main';
import MarketRoute from './markets';

const asyncRouterMap = [{ path: '*', redirect: '/404', hidden: true, noMenu: true }]

export default _.concat(asyncRouterMap, MainRoute, MarketRoute)