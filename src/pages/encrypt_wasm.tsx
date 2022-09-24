
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useClipboard,
  Heading,
  Box,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/react'
//@ts-ignore
import { saveAs } from 'file-saver';
import { chain, accessControlConditions, baseUrl } from '../lib/config';

//@ts-ignore
import LitJsSdk from 'lit-js-sdk'
import { toString as uint8arrayToString } from "uint8arrays/to-string";
import { fromString as uint8arrayFromString } from "uint8arrays/from-string";


export default function DoctorAdd() {
  const unityFileName = 'myunityapp';
  const [docString, setDocString] = useState("");

  const [loading, setLoading] = useState(false)

  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState("");

  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [fileExtension, setFileExtension] = useState("");
  const { hasCopied, onCopy } = useClipboard(encryptedSymmetricKey)

  useEffect(() => {

    async function init() {
      //INIT LIT CLIENT
      const client = new LitJsSdk.LitNodeClient()
      await client.connect()
      //@ts-ignore
      window.litNodeClient = client
    }

    init()


  }, [])


  const encrypt = async () => {

    setLoading(true)

    try {





      const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain })


      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        docString
      );
      console.log(symmetricKey)

      const encryptedStringBase64 = uint8arrayToString(
        new Uint8Array(await encryptedString.arrayBuffer()),
        "base64"
      );

      console.log('encryptedStringBase64----|||||||||', encryptedStringBase64)


      //@ts-ignore
      const encSymmetricKey = await window.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain,
      });
      console.log('encSymmetricKey', encSymmetricKey)
      const encSymmetricStringBase64 = uint8arrayToString(
        encSymmetricKey,
        "base64"
      );
      console.log('encSymmetricStringBase64', encSymmetricStringBase64)
      console.log(' encryptedStringBase64', encryptedStringBase64)

      await setEncryptedSymmetricKey(encSymmetricStringBase64)
      await setEncrypted(encryptedStringBase64)
      setLoading(false);



    }
    catch (e) { console.log(e); setLoading(false); }
    setLoading(false);
    return ''
  }

  const decrypt = async () => {

   // const chain = 'mumbai';



    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain })

    const check = uint8arrayFromString(
      encryptedSymmetricKey,
      "base64"
    );

    // console.log('---------->symmetricKey base 16', LitJsSdk.uint8arrayToString(check, "base16"))
    //@ts-ignore
    const symmetricKey = await window.litNodeClient.getEncryptionKey({
      accessControlConditions,
      // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.  This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
      toDecrypt: LitJsSdk.uint8arrayToString(check, "base16"),
      chain,
      authSig
    })
    //console.log('---------->symmetricKey', symmetricKey)

    // console.log( encrypted)
    const arrayBuffer = uint8arrayFromString(
      encrypted,
      "base64"
    ).buffer;
    const blob = new Blob([arrayBuffer])


    const decryptedString = await LitJsSdk.decryptString(
      blob,
      symmetricKey
    );

    // console.log('-------->decryptedString', decryptedString);

    setDecrypted(decryptedString)

    return decryptedString;

  }




  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const retrieveFile = async (e: any) => {
    const data = e.target.files[0];
    let file = e.target.files[0].name;

    let ext = file.split(".").pop();
    console.log("extension:" + ext);
    setFileExtension(ext);
    console.log(data);
    let str: any = await getBase64(data);


    //@ts-ignore
    setDocString(str);
    return str;
    e.preventDefault();
  };


  const handleDocInputString = (e: ChangeEvent<HTMLInputElement>) => {
    setDocString(e.target.value);
  };
  function dataURLtoFile(dataurl: any, filename: string) {
    console.log(dataurl.substring(1, 40))
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    console.log('MIME', mime)
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
    console.log(mime)
  }
  const downloadDecrypted = async () => {
    const base64 = await decrypt();
    console.log('---->base64', base64)
    const file = dataURLtoFile(base64, unityFileName)
    saveAs(file)
  };

  const downloadEncrypted = async () => {

    var blob = new Blob([encrypted], { type: 'text/plain' });
    var file = new File([blob], unityFileName + ".wasm.encrypted", { type: "text/plain" });

    saveAs(file)
  };
  return (
    <Box
      alignItems="center"
      justifyContent="space-around"
      display="flex"
      flexDirection="column"
      textAlign="center"
      h='700'
    >
      <Heading as="h1">Encrypt wasm file</Heading>


      <VStack p='2' border='1px' w='500px' >
        <Text> Step 1: upload a file</Text>
        <FormControl>

          <FormLabel mt={5}>
            File to upload
          </FormLabel>
          <Input m="1" p="1" type="file" name="data" onChange={retrieveFile} />
          <Text>{docString.substring(0, 40)}</Text>
        </FormControl>
      </VStack>
      <VStack p='2' border='1px' w='500px' >
        <Text> Step 2: encrypt the wasm file</Text>
        <Box>
          <Button onClick={() => encrypt()}>Encrypt</Button>
          {loading && <Spinner mx= '2' />}

        </Box>

      </VStack>
      <VStack p='2' border='1px' w='500px' noOfLines={150} >
        <Text> Step 3 : Download the encrypted  file .wasm.encrypted</Text>
        <Button onClick={downloadEncrypted} ml={2}>
          Download encrypted file
        </Button>
      </VStack>


      <VStack p='2' border='1px' w='500px' >
        <Text> Step 4: Grab the encrypted symmetric key if you need it somewhere</Text>
        <Input value={encryptedSymmetricKey} isReadOnly placeholder='copy encryptedSymmetricKey' />
        <Button onClick={onCopy} ml={2}>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>

      </VStack>

      <VStack p='2' border='1px' w='500px' noOfLines={150} >
        <Text> Step 5 : Download the decrypted file</Text>
        <Button onClick={downloadDecrypted} ml={2}>
          Download decrypted file
        </Button>
      </VStack>


    </Box>
  )



}

