

//@ts-ignore
import Cookies from 'cookies'
//@ts-ignore
import LitJsSdk from 'lit-js-sdk'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, VStack, Button, Text, Heading } from '@chakra-ui/react'

import { Unity, useUnityContext } from "react-unity-webgl";
import { baseUrl, serverBaseUrl, unityBuildPath } from '../lib/config';

export default function Protected(props: any) {
  const unityFileName = 'myunityapp';

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    productName: "Unity WebGL Tests",
    companyName: "",

    dataUrl: unityBuildPath + "/myunityapp.data",
    loaderUrl: unityBuildPath + "/myunityapp.loader.js",
    frameworkUrl: unityBuildPath + "myunityapp.framework.js",

    codeUrl: serverBaseUrl + "/decrypt?authSig=" + JSON.stringify(props.authSig), // wasm file firectory

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

        <Heading as="h2">Unity Game</Heading>
        <Text>{props.encryptedSymmetricString}</Text>
        <Text>Your connected address: {props.authSig.address}</Text>

        <Box
          border='2px'
          borderColor='gray.200'
          rounded='lg'
          alignContent={'center'}
        >
          {!isLoaded && (
            <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
          )}
          <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} />

        </Box>





      </VStack>
    )
  }

}
//@ts-ignore
export async function getServerSideProps({ req, res, query }) {
  const { id, encryptedSymmetricString, authSig } = query
  console.log('---->ID:', id)

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
    payload.baseUrl !== baseUrl
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

      authSig: verified ? JSON.parse(authSig) : '{}',
    },
  }
}