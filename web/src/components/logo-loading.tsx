import logo from '@/assets/logo-transparent.png'

export const LogoLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="flex items-center gap-0 text-3xl font-bold">
        <img src={logo} alt="CoinControl" width={72} height={72} />
        CoinControl
      </h1>
    </div>
  )
}
