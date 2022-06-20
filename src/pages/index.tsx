import { useState, useContext, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
//@ts-ignore
import LitJsSdk from 'lit-js-sdk'
//@ts-ignore
import JSCookies from 'js-cookie'
import { UUIDContext } from '../context'
//@ts-ignore
import Cookies from 'cookies'
import { Box, Heading, Button, Link, VStack, Text } from '@chakra-ui/react'

import Layout from '../components/layout/Layout'
const chain = 'mumbai';

const accessControlConditions = [
  {
    contractAddress: '',
    standardContractType: '',
    chain,
    method: 'eth_getBalance',
    parameters: [
      ':userAddress',
      'latest'
    ],
    returnValueTest: {
      comparator: '>=',
      value: '100000000'
    }
  }
]


export default function Home(props: any) {
  const [connected, setConnected] = useState(false)
  const { id } = useContext(UUIDContext)
  const [jwt, setJwt] = useState('')
  const [test, setTest] = useState(0)
  const [jwtCookieLoaded, setJwtCookieLoaded] = useState(false)
  useEffect(() => {

    if (props.ifJwtLoaded) {
      setJwtCookieLoaded(true)
      setJwt(props.jwt)

    } else {
      setJwtCookieLoaded(false)
    }

  }, [])
  async function connect() {
    const resourceId = {
      baseUrl: 'http://localhost:3000',
      path: '/protected',
      orgId: "",
      role: "",
      extraData: id
    }

    const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false })
    //@ts-ignore
    await client.connect()
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    //@ts-ignore
    await client.saveSigningCondition({ accessControlConditions, chain, authSig, resourceId })
    try {
      //@ts-ignore
      const litjwt = await client.getSignedToken({
        accessControlConditions, chain, authSig, resourceId: resourceId
      })
      setJwt(litjwt)

      JSCookies.set('lit-auth', litjwt, { expires: 1 })

    } catch (err) {
      console.log('error: ', err)
    }
    setConnected(true)

  }

  return (

    <>
      <VStack>
        <Heading as='h3'>Connect to see unity app</Heading>

        {
          !connected ? <Button variant='solid' onClick={connect}>Connect</Button> : <Text>Now you can click on protected path link at the bottom</Text>
        }<br></br>



      </VStack>


    </>



  )
}





