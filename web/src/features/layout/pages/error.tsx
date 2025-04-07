import { type ErrorComponentProps } from '@tanstack/react-router'

import { GoBackButton } from '@/components/go-back-button'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'

export const ErrorPage = ({ reset }: ErrorComponentProps) => {
  return (
    <div className="mx-auto flex h-[90dvh] max-w-[80%] flex-col items-center justify-center gap-10 text-center md:max-w-prose">
      <h1 className="text-5xl font-black text-balance md:text-6xl">
        Error occurred
      </h1>
      <p className="text-balance">
        Something happened and cannot fetch data.
        <br />
        Try again later.
      </p>
      <div className="flex justify-between gap-10">
        <Button type="button" onClick={reset} size={'sm'} variant={'default'}>
          Refresh
        </Button>
        <GoBackButton size="sm" variant="link" className="cursor-pointer" />
        <ThemeSwitcher withText />
      </div>
    </div>
  )
}
