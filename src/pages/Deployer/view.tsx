import React from 'react'
// import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { TYPE } from '../../theme'

const LoadingWrapper = styled.div`
  padding: 2rem;
  text-align: center;
`

const SuccessWrapper = styled.div`
  padding: 2rem;
  text-align: center;
`

// Simple Loading View
export function LoadingView({ onDismiss }: { onDismiss: () => void }) {
  return (
    <LoadingWrapper>
      <TYPE.body fontSize={20}>Loading...</TYPE.body>
    </LoadingWrapper>
  )
}

// Simple Submitted View
export function SubmittedView({ onDismiss, hash }: { onDismiss: () => void; hash: string }) {
  return (
    <SuccessWrapper>
      <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
      <TYPE.body fontSize={20}>
        Hash: <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a>
      </TYPE.body>
    </SuccessWrapper>
  )
}
