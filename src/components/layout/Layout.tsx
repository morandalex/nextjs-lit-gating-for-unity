import React from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
} from '@chakra-ui/react'


import Head, { MetaProps } from './Head'
import Navbar from './Navbar'
import Footer from './Footer'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

/**
 * Constants & Helpers
 */

// Title text for the various transaction notifications.
const TRANSACTION_TITLES = {
  transactionStarted: 'Local Transaction Started',
  transactionSucceed: 'Local Transaction Completed',
}

/**
 * Prop Types
 */
interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

/**
 * Component
 */
const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  


  return (
    <>
      <Head customMeta={customMeta} />
      <Navbar />
      <main>
        <Container >
          {children}

        </Container>
      </main>
      
 <Footer />
        

    </>
  )
}

export default Layout
