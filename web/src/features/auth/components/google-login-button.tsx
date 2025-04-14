import { Button } from '@/components/ui/button'
import { env } from '@/config/env'

export const GoogleLoginButton = () => {
  return (
    <Button type="button" className="w-full" variant={'outline'} asChild>
      <a href={env.API_URL + '/auth/google'} className="gap-3">
        <img
          src="https://img.icons8.com/color/18/000000/google-logo.png"
          alt="Google Logo"
          width={18}
          height={18}
        />
        Continue with Google
      </a>
    </Button>
  )
}
