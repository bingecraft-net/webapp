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
          You are invited to Glizzy's peaceful WAN party! Turn up the lofi,
          grab a hot drink and cozy up with friends for some casual vanilla
          Minecraft. We are swimming in pumpkin spice with an autumn server
          theme.
        </p>
      </div>
      <div>
        <h2 style={{ margin: 0 }}>links</h2>
        <p style={{ margin: '0.5rem 0' }}>
          <Link href="https://pbs.twimg.com/media/FFdKHA7X0AQCkVv?format=jpg&name=4096x4096">
            ore distribution
          </Link>
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
