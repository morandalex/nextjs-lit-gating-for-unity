

//@ts-ignore
import Cookies from 'cookies'
//@ts-ignore
import LitJsSdk from 'lit-js-sdk'
import type { NextPage } from 'next'
import Head from 'next/head'
import { VStack, Button, Text, Heading } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

import { Unity, useUnityContext } from "react-unity-webgl";


export default function Protected(props: any) {
  const unityFileName = 'myunityapp';
  /*useEffect(() => {

    async function init() {
      const encryptedWasm = await fetch('public/unitybuild/2022.2/myunityapp.wasm.encrypted')
        .then(response => response.text())
        .then(encryptedWasm => {
          return encryptedWasm
        })

      var blob = new Blob([encryptedWasm], { type: 'text/plain' });
      var file = new File([blob], unityFileName + ".wasm.encrypted", { type: "text/plain" });
      const url = window.URL.createObjectURL(file);

      console.log('URL--->', url)

    }

    init();

  }, [])*/



  const { unityProvider } = useUnityContext({
    productName: "Christian O Connor - Unity WebGL Tests",
    companyName: "Christian O Connor",
    // The url's of the Unity WebGL runtime, these paths are public and should be
    // accessible from the internet and relative to the index.html.
    loaderUrl: "unitybuild/2022.2/myunityapp.loader.js",
    dataUrl: "https://metaversodesign.com/12345test/myunityapp.data",
    frameworkUrl: "unitybuild/2022.2/myunityapp.framework.js",

    //codeUrl: "http://localhost:8081/decrypt?authSig="+JSON.stringify(props.authSig),
    codeUrl: "https://13ee-2a03-b0c0-3-d0-00-1442-8001.eu.ngrok.io/decrypt?authSig="+JSON.stringify(props.authSig),
    

    //codeUrl:"unitybuild/2022.2/myunityapp.wasm",
    streamingAssetsUrl: "unitybuild/2022.2/streamingassets",
    // Additional configuration options.
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });


  if (!props.authorized) {
    return (
      <h2>Unauthorized</h2>
    )
  } else {
    return (
      <VStack>

        <h2>Unity Game</h2>
        <Text>{props.encryptedSymmetricString}</Text>
        <Text>{props.authSig.address}</Text>
        <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} />




      </VStack>
    )
  }

}
//@ts-ignore
export async function getServerSideProps({ req, res, query }) {
  const { id, encryptedSymmetricString,authSig} = query
  console.log('---->ID:',id)
 
  console.log(JSON.parse(authSig))
  
  const cookies = Cookies(req, res)
  const jwt = cookies.get('lit-auth')
  if (!jwt) {
    return {
      props: {
        authorized: false
      },
    }
  }

  const { verified, payload } = LitJsSdk.verifyJwt({ jwt })
  console.log(verified)
  console.log(payload)
  if (
    payload.baseUrl !== "http://localhost:3000"
    //payload.baseUrl !== "https://nextjs-lit-gating-for-unity.vercel.app"
    || payload.path !== '/protected'
    || payload.extraData !== id
  ) {
    return {
      props: {
        authorized: false
      },
    }
  }
  return {
    props: {
      authorized: verified ? true : false,
     
      authSig: verified ? JSON.parse(authSig): '{}',
    },
  }
}