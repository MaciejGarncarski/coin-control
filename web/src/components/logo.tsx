import logo from '@/assets/logo-transparent.png'

export const Logo = () => {
  return (
    <h1 className="flex items-center gap-0 font-bold">
      <img src={logo} alt="CoinControl" width={35} height={35} />
      CoinControl
    </h1>
  )
}
