import React from 'react'

export default function App() {
  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridAutoRows: '30% auto',
      }}
    >
      <div
        style={{
          backgroundImage: `url('spooky-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          padding: '0.5rem',
          background: 'linear-gradient(#87a4aa,#56453c)',
        }}
      >
        <h1>glizzy's marinade smp</h1>
        <h3>cute town, harsh wilderness, easy-going community</h3>
        <p>
          Welcome to Glizzy’s Marinade SMP! We are a small LGBT+ friendly
          community with grief response, looting prevention, skills, and
          dynmap. Every third night a bloodmoon will raise the difficulty
          in the spawn region from peaceful to hard. The nether, the end,
          and the highlands are permanently hard difficulty. We have a few
          custom recipes including cheaper netherite repair and magma cream
          smelting. Come join our growing community and build your house in
          the cozy autumn town.
        </p>
        <p>
          I’m your server operator, Glizzy. I’m a big geek and I enjoy
          writing code, running servers, and building towns. I enforce the
          rules (no griefing, no looting, no being a douchebag). Find me
          in-game!
        </p>
        <h2>how to connect</h2>
        <p>
          We require Minecraft: Java Edition version 1.19.2. In the
          multiplayer menu, enter <code>bingecraft.net</code> into the
          server address field and connect.
        </p>
        <h2>links</h2>
        <p>
          <Link href="https://map.bingecraft.net/">map</Link>
          <Link href="https://pbs.twimg.com/media/FFdKHA7X0AQCkVv?format=jpg&name=4096x4096">
            ore distribution
          </Link>
          <Link href="https://discord.gg/j8UyKuDeBf">discord</Link>
          <Link href="mailto:glizzywort@gmail.com">
            email (glizzywort@gmail.com)
          </Link>
          <Link href="https://www.planetminecraft.com/server/bingecraft-net/">
            our planetminecraft page
          </Link>
          <Link href="https://github.com/bingecraft-net">
            github
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
        color: 'inherit',
        fontWeight: 'bold',
        display: 'block',
      }}
      href={href}
    >
      {children}
    </a>
  )
}
