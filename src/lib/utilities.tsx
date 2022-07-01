
const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chan: 'mumbai',
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

  export default accessControlConditions;