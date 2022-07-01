import {useState} from 'react'
import NextLink from 'next/link'
import { UUIDContext } from '../context'
import { useRouter } from 'next/router'
//@ts-ignore
import { v4 as uuid } from 'uuid';
import { ChakraProvider, Box, Link, VStack } from '@chakra-ui/react'
import Layout from '../components/layout/Layout'
const id = uuid()
//@ts-ignore
function MyApp({ Component, pageProps }) {
  const router = useRouter();


const [authSig,setAuthSig] = useState('')

  function navigate() {
    //@ts-ignore
    router.push(`/protected?id=${id}&authSig=${JSON.stringify(authSig)}`)
  }
  return (
    <UUIDContext.Provider value={{
      id
    }}>
      <ChakraProvider>
        <Layout>
          <VStack>



            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
            >
              <NextLink href="/">
                <Link border='1px' borderRadius='xl' p='2' mx='1'>
                  Home
                </Link>
              </NextLink>

              <Link border='1px' borderRadius='xl' p='2' mx='1' onClick={navigate} style={{ cursor: 'pointer' }}>
                Protected
              </Link>
            </Box>

            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
            >


              <Component 
            
           
              setAuthSig={setAuthSig}
              {...pageProps} 
              />


            </Box>

          </VStack>
        </Layout>
      </ChakraProvider >
    </UUIDContext.Provider>

  )
}
//MyApp.getInitialProps = async (appContext:any) => {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
   //}
export default MyApp

