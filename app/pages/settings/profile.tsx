import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { NextPage } from 'next'
import { ProfileType } from 'ask.io'
import { getSession } from "next-auth/react"
import Profile from '../../models/Profile'
import { Page } from '../../components/Page'

type Props = {
  profile: ProfileType
}

const ProfileSettings: NextPage<Props> = ({ profile }) => {
    return (
      <Page>
        <h1>Profile Settings</h1>
        <form method="POST" action={`/api/profile/${profile._id}`}>
          <label htmlFor="name">Name</label>
          <br />
          <input type="text" name="name" required defaultValue={profile.name} />

          <br />
          <br />

          <label htmlFor="bio">Bio</label>
          <br />
          <textarea name="bio" required defaultValue={profile.bio} />

          <br />
          <br />

          <button type="submit">
            Save Changes
          </button>
        </form>
      </Page>
    )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const session = await getSession(context)

  if (!session?.user?.id) {
    return {
      redirect: {
        permanent: true,
        destination: '/404'
      }
    }
  }


  const profile = await Profile.findOne({
    _id: session.user.id
  }).lean()

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile))
    }
  }
}

export default ProfileSettings
