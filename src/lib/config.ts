//https://nextjs-lit-gating-for-unity.vercel.app
export const baseUrl = 'http://localhost:3000'; // go to root directory then yarn dev or yarn start

export const serverBaseUrl = 'http://localhost:8091'; // go to server directory and then yarn start

export const unityBuildPath = 'unitybuild/2022.10/';
export const unityBuildDataPath = 'unitybuild/2022.10/';
export const chain = 'mumbai'
export const accessControlConditions = [
    {
        contractAddress: '',
        standardContractType: '',
        chain,
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
            comparator: '>=',
            value: '100000000',  // 0.000001 ETH
        },
    },
]
/* export const accessControlConditions = [
  {
    contractAddress: '0x25ed58c027921E14D86380eA2646E3a1B5C55A8b',
    standardContractType: 'ERC721',
    chain: 'mumbai',
    method: 'balanceOf',
    parameters: [
      ':userAddress'
    ],
    returnValueTest: {
      comparator: '>',
      value: '0'
    }
  }
]
*/

export const encryptedSymmetricKey = '4/FIlIsYvrfZ80vO2msUjHl10+FAxxcUMEj8IRAfaJLdR6d4MSkQvHRxqnkbn04F1dKiut8fjHrDthC7EJ/Ahdy9S4KClESrlYypbhThRaJK+BhE+suEzEIGYUo/QuKZ3UNKF7Y+jsD0+ufkvNmMc3Q1uqYsd2a5H5kqs6DuCFEAAAAAAAAAIDHLkrMF84egvkmQpSQ1ypLTarRaothUkSVISCeap/3zklNCsGx3Q3WRm/lI11jSkA'
  
//  import {baseUrl,serverBaseUrl,unityBuildPath,unityBuildDataPath,chain,accessControlConditions,encryptedSymmetricKey} from '../lib/config';

