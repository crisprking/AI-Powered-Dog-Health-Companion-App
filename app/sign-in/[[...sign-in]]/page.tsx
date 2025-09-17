import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-rose-500 hover:bg-rose-600',
            footerActionLink: 'text-rose-500 hover:text-rose-600'
          }
        }}
      />
    </div>
  )
}



