import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { IReduxState } from '../store/slices/state.interface';

export const makeBondsArray = (daiBondDiscount?: string | number, daiAxeBondDiscount?: string | number) => {
  return [
    {
      name: 'DAI',
      value: 'dai',
      discount: Number(daiBondDiscount),
    },
    {
      name: 'AXE-DAI LP',
      value: 'dai_axe_lp',
      discount: Number(daiAxeBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();

export const useBonds = () => {
  const daiBondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['dai'] && state.bonding['dai'].bondDiscount;
  });

  const daiAxeDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['dai_axe_lp'] && state.bonding['dai_axe_lp'].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(daiBondDiscount, daiAxeDiscount);
    const mostProfitableBonds = orderBy(bondValues, 'discount', 'desc');
    setBonds(mostProfitableBonds);
  }, [daiBondDiscount, daiAxeDiscount]);

  return bonds;
};
