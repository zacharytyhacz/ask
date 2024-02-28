import type { NextPage, NextPageContext } from 'next'
import { getCsrfToken } from "next-auth/react"
import Head from 'next/head'
import { Page } from '../components/Page'

type Props = {
    csrfToken: string
    callbackUrl: string
}

const Continue: NextPage<Props> = ({ csrfToken, callbackUrl }) => {
    return (
        <>
            <Head>
                <title>Sign In</title>
            </Head>
            <Page>
                <form method="post" action={`/api/auth/signin/email?callbackUrl=${encodeURI(callbackUrl)}`}>
                    <h2>Let&apos;s Get Started</h2>
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <label>
                        Email address
                        <input type="email" id="email" name="email" />
                    </label>

                    <br />
                    <br />
                    <button type="submit">Continue with email</button>
                </form>
            </Page>
        </>
    )
}

export async function getServerSideProps(context: NextPageContext) {
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            callbackUrl: decodeURI(context.query?.callbackUrl?.toString() || ''),
            csrfToken,
        },
    }
}

export default Continue
