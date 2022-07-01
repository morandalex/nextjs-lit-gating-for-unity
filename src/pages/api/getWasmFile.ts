
import stream from 'stream';
import { promisify } from 'util';
import { NextApiRequest, NextApiResponse } from "next";
import { Blob } from 'buffer'
//@ts-ignore
import LitJsSdk from 'lit-js-sdk'
import { fromString as uint8arrayFromString } from "uint8arrays/from-string";
const pipeline = promisify(stream.pipeline);


async function initAndDecrypt(authSig: string | string[]) {
  console.log('STEP 0: INITIALIZE lit SDK')
  const client = new LitJsSdk.LitNodeClient();
  await client.connect();

  console.log('STEP 1:INIT INITIAL PARAMETERS ')
  //const url = 'http://localhost:3000/unitybuild/2022.2/myunityapp.wasm.encrypted';
  const url = 'https://nextjs-lit-gating-for-unity.vercel.app/unitybuild/2022.2/myunityapp.wasm.encrypted';
  const encryptedSymmetricKey = 'olsU7br0h/ZzOZfPq11x3Vzav7hmk9xX2O21BoXKBwsjdmlCJuo7MUQxR4g8hSUABoadIhPX0uYaoXb+XIM9iQnxUwY84UjtnknTVyPAVLyS8+y9JNUjy+FRKtJTE5mDXbyBoeFBi/M0BeOT89ICEoTj+lWZkeRqv3QBcQ+WziEAAAAAAAAAIE74fLiZzTrJMr67prKY9Js5Egi9rWLhubPch07KD6R2H2KKl78URNEHa5VWTN+ssA'
  const chain = 'mumbai'
  const accessControlConditions = [
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







  console.log('STEP 2: GET ENCRYPTED BASE64 OF WASM FILE')

  const encrypted = await fetch(url)
    .then(res => res.text())
    .then(response => { return response });

  console.log('STEP 3: GET THE UINTARRAY OF ENCRYPTED SYMMETRIC KEY')


  const check = uint8arrayFromString(
    encryptedSymmetricKey,
    "base64"
  );

  console.log('STEP 4: DECRYPT THE SYMMETRIC KEY')

  //@ts-ignore
  console.log(JSON.parse(decodeURI(authSig)))

  const symmetricKey = await client.getEncryptionKey({
    accessControlConditions,
    // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string. 
    // This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" 
    //which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
    toDecrypt: LitJsSdk.uint8arrayToString(check, "base16"),
    chain,
    //@ts-ignore
    authSig: JSON.parse(decodeURI(authSig))
  })

console.log(typeof encrypted)
  const arrayBuffer: ArrayBuffer = uint8arrayFromString(
    encrypted,
    "base64"
  ).buffer;
  //@ts-ignore
  const blob = new Blob([arrayBuffer])

  console.log(blob)

  console.log('CHECK -->> :', arrayBuffer)

  const decryptedString = await LitJsSdk.decryptString(
    blob,
    symmetricKey
  );

//   console.log('DECRYPTED :', decryptedString.substring(0, 20))


}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const {
    query: { authSig },

  } = req;

  await initAndDecrypt(authSig)

  
  return res.status(200).json({ authSig });


};

export default handler;