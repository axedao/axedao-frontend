import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { IReduxState } from '../store/slices/state.interface';

export const makeBondsArray = (usdcBondDiscount?: string | number, usdcAxeBondDiscount?: string | number) => {
  return [
    {
      name: 'USDC',
      value: 'usdc',
      discount: Number(usdcBondDiscount),
    },
    {
      name: 'AXE-USDC LP',
      value: 'usdc_axe_lp',
      discount: Number(usdcAxeBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();

export const useBonds = () => {
  const usdcBondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['usdc'] && state.bonding['usdc'].bondDiscount;
  });

  const usdcAxeDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['usdc_axe_lp'] && state.bonding['usdc_axe_lp'].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(usdcBondDiscount, usdcAxeDiscount);
    const mostProfitableBonds = orderBy(bondValues, 'discount', 'desc');
    setBonds(mostProfitableBonds);
  }, [usdcBondDiscount, usdcAxeDiscount]);

  return bonds;
};
