//https://nextjs-lit-gating-for-unity.vercel.app
export const baseUrl = 'http://localhost:3000'; // go to root directory then yarn dev or yarn start

export const serverBaseUrl = 'http://localhost:8081'; // go to server directory and then yarn start

export const unityBuildPath = 'unitybuild/2022.2/';
export const unityBuildDataPath = 'unitybuild/2022.2/';
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

export const encryptedSymmetricKey = 'olsU7br0h/ZzOZfPq11x3Vzav7hmk9xX2O21BoXKBwsjdmlCJuo7MUQxR4g8hSUABoadIhPX0uYaoXb+XIM9iQnxUwY84UjtnknTVyPAVLyS8+y9JNUjy+FRKtJTE5mDXbyBoeFBi/M0BeOT89ICEoTj+lWZkeRqv3QBcQ+WziEAAAAAAAAAIE74fLiZzTrJMr67prKY9Js5Egi9rWLhubPch07KD6R2H2KKl78URNEHa5VWTN+ssA'
  
//  import {baseUrl,serverBaseUrl,unityBuildPath,unityBuildDataPath,chain,accessControlConditions,encryptedSymmetricKey} from '../lib/config';

