var express = require("express");
var LitJsSdk = require("lit-js-sdk/build/index.node.js");
var cors = require('cors')
var app = express();
const whiteList = ["http://localhost:3000"];
const corsOptions = {
  credentials: true,
  origin: whiteList
};

///////////SETUP SERVER/////////////////////////////
console.log('STEP 1:INIT INITIAL PARAMETERS ')
const encryptedSymmetricKey = '4/FIlIsYvrfZ80vO2msUjHl10+FAxxcUMEj8IRAfaJLdR6d4MSkQvHRxqnkbn04F1dKiut8fjHrDthC7EJ/Ahdy9S4KClESrlYypbhThRaJK+BhE+suEzEIGYUo/QuKZ3UNKF7Y+jsD0+ufkvNmMc3Q1uqYsd2a5H5kqs6DuCFEAAAAAAAAAIDHLkrMF84egvkmQpSQ1ypLTarRaothUkSVISCeap/3zklNCsGx3Q3WRm/lI11jSkA'
const baseUrl = 'http://localhost:3000'
const url = baseUrl+'/unitybuild/2022.10/myunityapp.wasm.encrypted';
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



app.use(cors(corsOptions));


var randomUrlPath = null;



// get the authSig from some wallet
/*const authSig = {
  sig: "0xe0037ecb2be8f3bf7789e657daf2f11970778c909a526c64bf0c477ee472f7484fae08ef791af26194d1164932147cf01396a4be6e61291e42f144c3c51842a91c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage: "localhost:3000 wants you to sign in with your Ethereum account:\n0xB91bC2a105C03667930b5eBE639e7914c5763BDB\n\n\nURI: http://localhost:3000\nVersion: 1\nChain ID: 80001\nNonce: aR5abNAbD8XSIyAHu\nIssued At: 2022-06-28T10:57:26.912Z",
  address: "0xb91bc2a105c03667930b5ebe639e7914c5763bdb"
}*/

async function initAndDecrypt(authSig) {
  /*console.log('STEP 0: INITIALIZE lit SDK')
  const client = new LitJsSdk.LitNodeClient();
  await client.connect();
*/





  console.log('STEP 2: GET ENCRYPTED BASE64 OF WASM FILE')

  const encrypted = await fetch(url)
    .then(res => res.text())
    .then(response => { return response });

  //console.log(encrypted)
  console.log('STEP 3: GET THE UINTARRAY OF ENCRYPTED SYMMETRIC KEY')


  const check = LitJsSdk.uint8arrayFromString(
    encryptedSymmetricKey,
    "base64"
  );
  console.log(check)

  console.log('STEP 4: DECRYPT THE SYMMETRIC KEY')

  //@ts-ignore
  //console.log(decodeURI(authSig))

  const symmetricKey = await app.locals.litNodeClient.getEncryptionKey({
    accessControlConditions,
    // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string. 
    // This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" 
    //which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
    toDecrypt: LitJsSdk.uint8arrayToString(check, "base16"),
    chain,
    //@ts-ignore
    //  authSig: JSON.parse(decodeURI(authSig))
    authSig
  })

  console.log(typeof encrypted)
  const arrayBuffer = LitJsSdk.uint8arrayFromString(
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
  // console.log(decryptedString)
  return decryptedString

}




app.get("/decrypt", async function (req, res) {


  try {
    let authSig = JSON.parse(req.query.authSig)


    const decrypted = await initAndDecrypt(authSig)

    var buffer = Buffer.from(decrypted.split(',')[1], 'base64');

    res.writeHead(200, {
      'Content-Type': 'application/wasm',
      'Content-Length': buffer.length
    });
    res.end(buffer);
  } catch (e) {
    console.log(e)
    res.send('error');
  }
  console.log(req.query.authSig)

  //  res.send(decrypted);
});

// BEGIN with server setup
var server = app.listen(8091, async function () {
  var host = server.address().address;
  var port = server.address().port;

  // You must store litNodeClient in some kind of global variable that
  // is accessible to all your endpoints that will interact with the Lit Network.
  // It's best to initialize it just once per server.
  app.locals.litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
  });
  await app.locals.litNodeClient.connect();

  console.log("Example app listening at http://%s:%s", host, port);
});
//ciao