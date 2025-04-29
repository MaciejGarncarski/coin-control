import { Link } from '@tanstack/react-router'
import { Cookie } from 'lucide-react'
import { AnimatePresence, motion, type TargetAndTransition } from 'motion/react'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30

const exitProps: TargetAndTransition = {
  y: 200,
  opacity: 0,
}

export const CookieBanner = () => {
  const isAccepted = localStorage.getItem('cookie-banner-accepted')
  const isExpired = Number(isAccepted) < new Date().getTime()
  const [isShown, setIsShown] = useState(isAccepted ? isExpired : true)

  const acceptCookies = async () => {
    const bannerExpiresAt = new Date().getTime() + ONE_MONTH
    localStorage.setItem('cookie-banner-accepted', bannerExpiresAt.toString())
    setIsShown(false)
  }

  return (
    <AnimatePresence mode="wait">
      {isShown ? (
        <motion.div
          exit={exitProps}
          className="fixed bottom-4 left-[50%] -translate-x-[50%] md:bottom-4 md:left-4 md:translate-x-0">
          <Alert className="w-[22rem] md:w-auto">
            <Cookie className="h-4 w-4" />
            <AlertTitle>Cookies</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col gap-2 md:gap-4">
                <p>This app uses only necessary cookies, to work properly.</p>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant={'outline'} asChild size={'sm'}>
                    <Link to="/privacy-policy">Learn more</Link>
                  </Button>
                  <Button type="button" size={'sm'} onClick={acceptCookies}>
                    Okay
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
