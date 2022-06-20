import {
    Button,
    Container,
    Flex,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    SimpleGrid,
} from '@chakra-ui/react'
import { UUIDContext } from '../../context'

import NextLink from 'next/link'


function Nav() {




    return (
        <header>
        <Container maxWidth="container.xl">
          <SimpleGrid
            columns={[1, 1, 1, 2]}
            alignItems="center"
            justifyContent="space-between"
            py="8"
          >
            <Flex py={[4, null, null, 0]}>
              <NextLink href="/" passHref>
                <Link px="4" py="1">
                  Home
                </Link>
              </NextLink>
        
            
            </Flex>

          </SimpleGrid>
        </Container>
      </header>
    )
}

export default Nav