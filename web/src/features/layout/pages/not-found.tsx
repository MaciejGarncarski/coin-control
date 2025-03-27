import { GoBackButton } from '@/components/go-back-button'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'

export const NotFoundPage = () => {
  return (
    <main className="mx-auto flex h-screen max-w-[80%] flex-col items-center justify-center gap-10 text-center md:max-w-prose">
      <h1 className="text-5xl font-black text-balance md:text-7xl">
        404
        <br />
        <span className="text-4xl font-bold uppercase md:text-5xl">
          Not found
        </span>
      </h1>
      <p className="text-balance">
        The page you are looking for does not exist.
      </p>
      <div className="flex justify-between gap-10">
        <GoBackButton size="sm" variant="link" className="cursor-pointer" />
        <ThemeSwitcher withText />
      </div>
    </main>
  )
}
