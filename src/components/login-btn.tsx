import { useSession, signIn, signOut } from "next-auth/react"
export default function LoginButton() {
  const { data: session } = useSession();

  console.log(useSession())

  if (session && session.user) {
    return (
      <>
        <p>Signed in as {session.user.email}</p> 
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <p>Not signed in</p>
      <br />
      <button onClick={() => signIn("fusionauth")}>Sign in</button>
    </>
  )
}