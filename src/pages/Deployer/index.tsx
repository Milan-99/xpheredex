import React, { useState } from 'react'
import { AutoColumn } from '../../components/Column/index'
import styled from 'styled-components'
import { RowBetween } from '../../components/Row/index'
import { ButtonError } from '../../components/Button/index'
import { useActiveWeb3React } from '../../hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { ethers } from 'ethers'
// import banner from './Meme.webp'
// import styled from 'styled-components';

// interface OptionButtonProps {
//   selected: boolean;
// }

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`
// const BannerImage = styled.img`
//   height: 200px;
//   width: 800px;
//   object-fit: cover;
//   border-radius: 10px;
//   margin-top: -60px;
// `
const Text = styled.span`
  color: #FFFFFF;
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

const FormContainer = styled(AutoColumn)`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  gap: 1rem;
`

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`

// const CheckboxLabel = styled.label`
//   display: flex;
//   align-items: center;
//   font-size: 16px;
//   color: red;
// `

// const CheckboxInput = styled.input`
//   margin-right: 10px;
// `

// const OptionButton = styled.button<OptionButtonProps>`
//   background-color: ${(props) => (props.selected ? '#ff9800' : '#4CAF50')};
//   color: white;
//   border: none;
//   padding: 10px;
// `;

// const Text = styled.div`
//   color: red; // Set text color to red
// `;

const contractAddress = "0x76e116a7F2d8C06E0966612FD2F48b1Cb1065e74";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol_",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isBurnable_",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "initialSupply_",
				"type": "uint256"
			}
		],
		"name": "create",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ISwanRouter",
				"name": "_router",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_tokenType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			}
		],
		"name": "Created",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAll",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "symbol",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "tokenType",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isBurnable",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isMintable",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "tokenAddress",
						"type": "address"
					}
				],
				"internalType": "struct Token[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "router",
		"outputs": [
			{
				"internalType": "contract ISwanRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "time",
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
]

export default function CreateTokenModal() {
	const { account, library } = useActiveWeb3React()
	const addTransaction = useTransactionAdder()
  
	const [name, setName] = useState('')
	const [symbol, setSymbol] = useState('')
	// const [isBurnable, setIsBurnable] = useState(false)
	const [initialSupply, setInitialSupply] = useState('')
	const [ethAmount, setEthAmount] = useState('')
	// const [option, setOption] = useState<'liquidity' | 'bondingCurve'>('liquidity')
	const [hash, setHash] = useState<string | undefined>()
	const [attempting, setAttempting] = useState(false)
	const [tokenAddress, setTokenAddress] = useState<string | undefined>()
	// const [ setAddLiquiditySelected] = useState(false) // Track if "Add Liquidity" is selected

  
	const handleSubmit = async () => {
	  if (!library || !account) return
  
	  const signer = library.getSigner(account)
	  const contract = new ethers.Contract(contractAddress, contractABI, signer)

	  const isBurnable = true
  
	  try {
		setAttempting(true)
  
		const trimmedEthAmount = ethAmount.replace(' eth', '').trim()
		const weiAmount = ethers.utils.parseUnits(trimmedEthAmount, 18)
  
		// Assuming different logic for bonding curve vs adding liquidity
		// if (option === 'liquidity') {
		  const response: TransactionResponse = await contract.create(
			name,
			symbol,
			isBurnable,
			initialSupply,
			{ value: weiAmount }
		  )
		  addTransaction(response, { summary: `Created ${name} (${symbol})` })
		  setHash(response.hash)
  
		  const receipt = await response.wait()
		  const eventInterface = new ethers.utils.Interface(contractABI)
		  const log = receipt.logs.find(log => log.topics[0] === eventInterface.getEventTopic('Created'))
  
		  if (log) {
			const parsedLog = eventInterface.parseLog(log)
			const _tokenAddress = parsedLog.args._tokenAddress
			setTokenAddress(_tokenAddress)
		  }
		// } else if (option === 'bondingCurve') {
		//   // Add logic for starting bonding curve here
		//   console.log('Starting bonding curve raising...')
		//   // Call a different contract function or handle bonding curve logic
		// }
	  } catch (error) {
		console.error(error)
		setAttempting(false)
	  }
	}

	// const handleOptionChange = (option: string) => {
	// 	if (option === 'addLiquidity') {
	// 	  setAddLiquiditySelected(true);
	// 	} else {
	// 	  setAddLiquiditySelected(false);
	// 	}
	//   };
  
	  return (
		<div>
		  {/* <BannerImage src={banner} alt="Banner" /> */}
		  <StyledBox>
			{!attempting && !hash && (
			  <ContentWrapper gap="lg">
				<RowBetween>
				  <Text>One-click Deployer</Text>
				</RowBetween>
	  
				<FormContainer gap="md">
				  {/* Token name and symbol input fields */}
				  <InputField value={name} onChange={(e) => setName(e.target.value)} placeholder=" Name" />
				  <InputField value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder=" Symbol" />
				  <InputField value={initialSupply} onChange={(e) => setInitialSupply(e.target.value)} placeholder="Total Supply" />
				  <InputField
					  type="text"
					  value={ethAmount}
					  onChange={(e) => setEthAmount(e.target.value)}
					  placeholder="Initial Liquidity (e.g., 1 ETH)"
					/>
				  {/* Burnable checkbox */}
				  {/* <CheckboxLabel>
					<CheckboxInput type="checkbox" checked={isBurnable} onChange={(e) => setIsBurnable(e.target.checked)} />
					<Text>Burnable</Text>
				  </CheckboxLabel> */}
	  
				  {/* Option buttons for Add Liquidity and Start Bonding Curve */}
				  {/* <div>
					<OptionButton 
					  selected={option === 'liquidity'} 
					  onClick={() => setOption('liquidity')}
					>
					  Add Liquidity
					</OptionButton>
					<OptionButton 
					  selected={option === 'bondingCurve'} 
					  onClick={() => setOption('bondingCurve')}
					>
					  Start Bonding Curve
					</OptionButton>
				  </div> */}
	  
				  {/* Conditionally render the ETH Amount input field if "Add Liquidity" is selected */}
				  {/* {option === 'liquidity' && ( */}
					
				  {/* )} */}
				</FormContainer>
	  
				<ButtonError onClick={handleSubmit}>
				  <Text>Create Token</Text>
				</ButtonError>
			  </ContentWrapper>
			)}
	  
			{/* Show progress if attempting */}
			{attempting && !hash && (
			  <AutoColumn gap="12px" justify={'center'}>
				<Text>Creating Token...</Text>
			  </AutoColumn>
			)}
	  
			{/* Show success message if transaction is submitted */}
			{hash && (
			  <AutoColumn gap="12px" justify={'center'}>
				<Text>Transaction Submitted</Text>
				<Text>Token Created!</Text>
				{tokenAddress && <Text>Token Address: {tokenAddress}</Text>}
			  </AutoColumn>
			)}
		  </StyledBox>
		</div>
	  )
			}	  