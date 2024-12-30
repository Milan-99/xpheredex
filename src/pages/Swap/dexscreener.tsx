import React from 'react';

export default function DexScreenerEmbed() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '125%',
        borderRadius: '25px',  // Fixed the comma here
        overflow: 'hidden', // Ensures the iframe respects the border-radius
      }}
    >
      <iframe
        src="https://dexscreener.com/ethereum/0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640?embed=1&theme=dark&trades=0&info=0"
        style={{
          position: 'absolute',
          width: '100%',
          height: '50%', // Adjusted to match the parent div
          top: 0,
          left: 0,
          border: 0,
        }}
        allowFullScreen
        title="DexScreener"
      />
    </div>
  );
}
