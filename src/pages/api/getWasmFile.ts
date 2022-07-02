// THIS IS A WORKING EXAMPLE - IT IS STILL NOT WORKING BUT 
// IT IS HERE FOR FUTURE REFERENCE IF IN THE FUTURE 
// YOU WANT TO USE NEXJS MIDDLEWARE AND NOT A EXPRESS SERVER

import { NextApiRequest, NextApiResponse } from "next";
import { Blob } from 'buffer'
//@ts-ignore
import LitJsSdk from 'lit-js-sdk'

import {baseUrl,unityBuildPath,chain,accessControlConditions,encryptedSymmetricKey} from '../../lib/config';

async function initAndDecrypt(authSig: string | string[]) {
  console.log('STEP 0: INITIALIZE lit SDK')
  const client = new LitJsSdk.LitNodeClient();
  await client.connect();

  console.log('STEP 1:INIT INITIAL PARAMETERS ')
  const url = baseUrl+unityBuildPath+"/myunityapp.wasm.encrypted";


  console.log('STEP 2: GET ENCRYPTED BASE64 OF WASM FILE')

  const encrypted = await fetch(url)
    .then(res => res.text())
    .then(response => { return response });

  console.log('STEP 3: GET THE UINTARRAY OF ENCRYPTED SYMMETRIC KEY')


  const check = LitJsSdk.uint8arrayFromString(
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
  const arrayBuffer: ArrayBuffer = LitJsSdk.uint8arrayFromString(
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

   console.log('DECRYPTED :', decryptedString.substring(0, 20))


}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const {
    query: { authSig },

  } = req;

  await initAndDecrypt(authSig)

  
  return res.status(200).json({ authSig });


};

export default handler;