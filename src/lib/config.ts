//https://nextjs-lit-gating-for-unity.vercel.app
//export const baseUrl = 'http://localhost:3000'; // go to root directory then yarn dev or yarn start
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
export const serverBaseUrl = process.env.NEXT_PUBLIC_EXPRESS_URL; // go to server directory and then yarn start

export const unityBuildPath = 'unitybuild/'+process.env.NEXT_PUBLIC_UNITY_BUILD_FOLDER+'/';
//export const unityBuildDataPath = 'unitybuild/';
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

export const encryptedSymmetricKey = process.env.NEXT_PUBLIC_ENCRYPTED_SYMMETRIC_KEY_OF_WASM_FILE
  
//  import {baseUrl,serverBaseUrl,unityBuildPath,unityBuildDataPath,chain,accessControlConditions,encryptedSymmetricKey} from '../lib/config';

