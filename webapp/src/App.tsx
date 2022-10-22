import React from 'react'

const darkBlue = '#224'

export default function App() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1
        style={{
          margin: 0,
          fontWeight: 'bold',
          fontSize: '4rem',
          color: darkBlue,
        }}
      >
        bingecraft.net
      </h1>
      <div>
        <h2 style={{ margin: 0 }}>welcome</h2>
        <p style={{ margin: '0.5rem 0' }}>
          Welcome to Glizzy’s Marinade! We like to build and make friends.
          We have a new, very small server with grief response, looting
          prevention, skills, dynmap. We don’t have any warps so the town
          is very intimate. Come join our growing community and help us
          build a cozy autumn town! I’m your server operator Glizzy and I’m
          a big geek who understands running a server. I enforce the rules
          (no griefing, no looting, no being a douchebag). I hope to meet
          you soon!
        </p>
      </div>
      <div>
        <h2 style={{ margin: 0 }}>links</h2>
        <p style={{ margin: '0.5rem 0' }}>
          <Link href="https://map.bingecraft.net/">map</Link>
          <Link href="https://pbs.twimg.com/media/FFdKHA7X0AQCkVv?format=jpg&name=4096x4096">
            ore distribution
          </Link>
          <Link href="https://discord.gg/SShpb4S2wq">discord</Link>
          <Link href="mailto:glizzywort@gmail.com">
            email (glizzywort@gmail.com)
          </Link>
          <Link href="https://www.planetminecraft.com/server/bingecraft-net/">
            our planetminecraft page
          </Link>
        </p>
      </div>
    </div>
  )
}

interface LinkProps extends React.PropsWithChildren {
  href: string
}
function Link({ children, href }: LinkProps) {
  return (
    <a
      style={{
        textDecoration: 'none',
        color: darkBlue,
        fontWeight: 'bold',
        display: 'block',
      }}
      href={href}
    >
      {children}
    </a>
  )
}
