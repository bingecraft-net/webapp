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
          Welcome to Glizzy's peaceful! We are a casual and collaborative
          Minecraft server. The highs are in the sixties so grab a sweater
          and a hot drink before settling in! We are a small new server
          with full rollback protection so you can build at ease with our
          friendly community.
        </p>
      </div>
      <div>
        <h2 style={{ margin: 0 }}>links</h2>
        <p style={{ margin: '0.5rem 0' }}>
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
