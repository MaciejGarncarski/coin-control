import { Button } from '@/components/ui/button'
import { env } from '@/config/env'

export const GoogleLoginButton = () => {
  return (
    <Button type="button" className="w-full" variant={'outline'} asChild>
      <a href={env.API_URL + '/auth/google'}>
        <img
          src="https://img.icons8.com/color/22/000000/google-logo.png"
          alt="Google Logo"
        />
        Continue with Google
      </a>
    </Button>
  )
}
