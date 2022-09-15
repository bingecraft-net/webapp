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
          Welcome to Glizzy's collaborative harvest server! The highs are
          in the sixties so grab a sweater and a hot drink before you cozy
          up with friends for a fall-inspired gather & build. You’ll wake
          up in Spruce Hollow where you can pick up some supplies and help
          out around town or hit the road. The server is themed around
          working together and carving out homey spot to share the autumn
          vibe.
        </p>
      </div>
      <div>
        <h2 style={{ margin: 0 }}>links</h2>
        <p style={{ margin: '0.5rem 0' }}>
          <Link href="https://pbs.twimg.com/media/FFdKHA7X0AQCkVv?format=jpg&name=4096x4096">
            ore distribution
          </Link>
          <Link href="https://discord.gg/FP426KQ8k9">discord</Link>
          <Link href="https://sordid-nightshade-1c3.notion.site/bingecraft-net-3a044ab1b24949e2a5058f025cb63152">
            notion.so
          </Link>
          <Link href="mailto:glizzywort@gmail.com">
            email (glizzywort@gmail.com)
          </Link>
        </p>
      </div>
      <div>
        <h2 style={{ margin: 0 }}>server lists</h2>
        <p style={{ margin: '0.5rem 0' }}>
          <Link href="https://minecraftservers.biz/servers/151664/">
            MinecraftServers.biz
          </Link>
          <Link href="https://mclike.com/minecraft-server-192073">
            mclike.com
          </Link>
          <Link href="https://servers-minecraft.net/server-bingecraft-net.22146">
            servers-minecraft.net
          </Link>
          <Link href="https://minecraftservers.org/server/641560">
            minecraftservers.org
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
