import { useEffect } from 'react'

export default function HudCorners() {
  return (
    <>
      <div style={cornerStyle('top-left')} />
      <div style={cornerStyle('top-right')} />
      <div style={cornerStyle('bottom-left')} />
      <div style={cornerStyle('bottom-right')} />
    </>
  )
}

function cornerStyle(pos) {
  const base = {
    position: 'fixed',
    width: '40px',
    height: '40px',
    border: '2px solid rgba(0, 212, 255, 0.15)',
    pointerEvents: 'none',
    zIndex: 1000,
  }

  if (pos.includes('top')) base.top = '20px'
  if (pos.includes('bottom')) base.bottom = '20px'
  if (pos.includes('left')) base.left = '20px'
  if (pos.includes('right')) base.right = '20px'

  if (pos === 'top-left') { base.borderRight = 'none'; base.borderBottom = 'none' }
  if (pos === 'top-right') { base.borderLeft = 'none'; base.borderBottom = 'none' }
  if (pos === 'bottom-left') { base.borderRight = 'none'; base.borderTop = 'none' }
  if (pos === 'bottom-right') { base.borderLeft = 'none'; base.borderTop = 'none' }

  return base
}
