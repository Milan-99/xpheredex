import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useActiveWeb3React } from '../../hooks'
import { ButtonError } from '../../components/Button/index'
import { AutoColumn } from '../../components/Column/index'
import { useTransactionAdder } from '../../state/transactions/hooks'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

const StyledBox = styled.div`
  background-color: black;
  color: white;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  margin: 100px auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center; /* Centers the content horizontally */
  align-items: center; /* Centers the content vertically */
  text-align: center; /* Aligns the text within the element */
  width: 100%; /* Ensures the flex container takes up the full width of its parent */
  margin-bottom: 1rem;
`

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
`

const Text = styled.span`
  color: #FFFFFF;
`

const contractAddress = "0x45B88e20b993299Dd8100485e0D295EDA298B94C";
const contractABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getDeposit",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDeposited",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function PresalePage() {
  const { account, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const [ethAmount, setEthAmount] = useState('')
  const [tokensToReceive, setTokensToReceive] = useState<number>(0)
  const [attempting, setAttempting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hash, setHash] = useState<string | undefined>()
  const [totalRaised, setTotalRaised] = useState<string>('0')
  const [userContribution, setUserContribution] = useState<string>('0')

  const TOKEN_RATE_PER_ETH = 1500000; // 1,500,000 tokens per 1 ETH

  useEffect(() => {
    if (library && account) {
      fetchTotalRaised()
      fetchUserContribution()
    }
  }, [library, account])

  const fetchTotalRaised = async () => {
    if (!library) return
    const contract = new ethers.Contract(contractAddress, contractABI, library)
    try {
      const total = await contract.totalDeposited()
      setTotalRaised(ethers.utils.formatEther(total))
    } catch (error) {
      console.error('Error fetching total raised:', error)
    }
  }

  const fetchUserContribution = async () => {
    if (!library || !account) return
    const contract = new ethers.Contract(contractAddress, contractABI, library)
    try {
      const contribution = await contract.getDeposit(account)
      setUserContribution(ethers.utils.formatEther(contribution))
    } catch (error) {
      console.error('Error fetching user contribution:', error)
    }
  }

  const handleEthAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setEthAmount(amount);

    // Calculate tokens to receive based on the entered ETH amount
    if (amount && !isNaN(Number(amount))) {
      const tokenAmount = Number(amount) * TOKEN_RATE_PER_ETH;
      setTokensToReceive(tokenAmount);
    } else {
      setTokensToReceive(0);
    }
  }

  const handleBuyTokens = async () => {
    if (!library || !account) return

    const signer = library.getSigner(account)
    const contract = new ethers.Contract(contractAddress, contractABI, signer)

    try {
      setAttempting(true)
      setSuccess(false)
      const weiAmount = ethers.utils.parseEther(ethAmount)
      const tx = await contract.deposit({ value: weiAmount }) // Calling the deposit function of the contract

      addTransaction(tx, { summary: `Deposited ${ethAmount} ETH` })
      setHash(tx.hash)
      await tx.wait()
      fetchTotalRaised()
      fetchUserContribution()
      setAttempting(false)
      setSuccess(true) // Mark the transaction as successful
    } catch (error) {
      console.error('Error depositing ETH:', error)
      setAttempting(false)
    }
  }

  return (
    <StyledBox>
      <ContentWrapper gap="lg">
        <HeaderWrapper>
          <Text>SWAN Token Presale</Text>
        </HeaderWrapper>

        <Text>SoftCap: 5 ETH</Text>
        <Text>HardCap: 10 ETH</Text> 

        <Text>Total Raised: {totalRaised} ETH</Text>
        <Text>Your Contribution: {userContribution} ETH</Text>

        <InputField
          type="text"
          value={ethAmount}
          onChange={handleEthAmountChange}
          placeholder="Enter amount in ETH"
        />

        <Text>Allocation: {tokensToReceive.toLocaleString()} SWAN </Text>

        <ButtonError onClick={handleBuyTokens} disabled={attempting || !ethAmount}>
          <Text>{attempting ? 'Processing...' : 'Buy Tokens'}</Text>
        </ButtonError>

        {success && hash && (
          <AutoColumn gap="12px" justify={'center'}>
            <Text>Transaction Submitted</Text>
            {/* <Text>
              View on Explorer: <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a>
            </Text> */}
          </AutoColumn>
        )}
      </ContentWrapper>
    </StyledBox>
  )
}
