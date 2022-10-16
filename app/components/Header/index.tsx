import Link from 'next/link'
import Image from 'next/image'
import { useSession } from "next-auth/react"

export const Header: React.FC = () => {
    const session = useSession()

    console.log(session)

    if (session.status === 'authenticated' && session.data.user) {
      return (
        <header>
          <div className="logo">
            <Link href="/" passHref>
              <a>
                <Image src="/images/logo.png" alt="ask.io" height={32} width={100} layout="fixed" />
              </a>
            </Link>
          </div>
          <Link href={`/ask/${session.data.user.id}`} passHref>
            <a>
              Your Wall
            </a>
          </Link>
        </header>
      )
    }
    return (
      <header>
        <Link href="/" passHref>
          <a>
            Home
          </a>
        </Link>
        <Link href="/continue" passHref>
          <a>
            Sign In
          </a>
        </Link>
        <Link href="/continue" passHref>
          <a>
            Sign Up
          </a>
        </Link>
      </header>
    )
}

