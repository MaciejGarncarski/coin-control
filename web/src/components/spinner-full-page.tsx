import { LoaderCircle } from 'lucide-react'

export const SpinnerFullPage = () => {
  return (
    <div className="container mx-auto flex h-[50dvh] items-center justify-center">
      <LoaderCircle className="size-20 animate-spin" />
    </div>
  )
}
