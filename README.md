# nextjs-lit-gating-for-unity

## setup 

### STEP 1 : frontend next 

The public folder does not contain your public/unitybuild/2022.2/myunityapp.data because github cannot handle files so big. for this reason is gitignored. You have to paste it inside the folder manually only the first time.


then go to src/lib/config.ts

then config the informatoon contained there


then 

    yarn start



### STEP 2 : create an enrypted file

go to localhost:3000/encrypt_wasm

then upload a file and click on encrypt

After some seconds you should see the symmetric encrypted key .

paste the encrypted symmetric key in src/lib/config.ts

then copy paste the encrypted wasm file inside public/unitybuild



#### STEP 3 : server express

go to server folder

check index.js file 

anch change the accessControlCondidtion putting the same as src/lib/config.ts

        ///////////SETUP SERVER/////////////////////////////
        console.log('STEP 1:INIT INITIAL PARAMETERS ')
        const encryptedSymmetricKey = 'XaVTH379owhn8X62DzOcIXaT/kRYevD5RneArVK3ZnSyjw15ElU0ku9Ic4GD/EcBQ+jHwnbSsIlSmsxAQjvnwcGcmVmmuGSP4mVTdYa6sCYbkUtdi0oUKk7IIkuyFHaH6iDdWlYi/rUE7AnpEJvfJ66V9l3fdW9uHk87dnd4BKUAAAAAAAAAIFgFz0fwUPEbYYURVpI1JD5R3311xqsh5myPMXkQE1IM30wxOJ5Q8kQjyVTMXtirrg'
        const baseUrl = 'http://localhost:3000'
        const url = baseUrl+'/unitybuild/2022.2/myunityapp.wasm.encrypted';
        const chain = "mumbai";
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
        ];
        /////////////////////////////////////////////////////

then

    yarn start



please notice . When you will deploy a production environment you will have to use nginx with a proxy to render available localhost:8081, or ngrok, or another tool .  