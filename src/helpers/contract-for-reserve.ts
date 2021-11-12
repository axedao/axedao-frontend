import { ethers } from 'ethers';
import { getAddresses, BONDS } from 'src/constants';
import { DaiContract, AxeDaiContract } from '../abi';

export const contractForReserve = (
  bond: string,
  networkID: number,
  provider: ethers.Signer | ethers.providers.Provider,
) => {
  const addresses = getAddresses(networkID);
  if (bond === BONDS.dai) {
    return new ethers.Contract(addresses.RESERVES.DAI, DaiContract, provider);
  }

  if (bond === BONDS.dai_axe) {
    return new ethers.Contract(addresses.RESERVES.DAI_AXE, AxeDaiContract, provider);
  }

  throw Error(`Contract for reserve doesn't support: ${bond}`);
};
