import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'
import { Route } from '@/routes/cookie-policy'

export function CookiePolicyPage() {
  const canGoBack = useCanGoBack()
  const navigate = Route.useNavigate()
  const router = useRouter()

  const goBack = () => {
    if (!canGoBack) {
      navigate({
        to: '/',
        viewTransition: true,
      })
      return
    }

    router.history.back()
  }

  return (
    <div className="mx-auto flex max-w-prose flex-col gap-8 p-6 md:p-14">
      <div className="flex items-center justify-between">
        <Button size={'sm'} type="button" onClick={goBack}>
          <ArrowLeft /> Go back
        </Button>
        <ThemeSwitcher withText />
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">Learn More About Our Cookie Usage</h1>
        We use a single, essential cookie to provide you with a seamless and
        personalized experience on our app. This page explains what this cookie
        is, why we use it, and how long it lasts.
        <h2 className="text-xl font-bold">What is a Cookie?</h2>A cookie is a
        small piece of data (text file) that a website or app stores on your
        computer or mobile device when you visit. It allows the website or app
        to remember your actions and preferences (such as login details) over a
        period of time, so you don&apos;t have to re-enter them every time you
        come back to the site or browse from one page to another.
        <h2 className="text-xl font-bold">Our Cookie: sessionId</h2>
        We utilize a cookie named sessionId. This cookie is crucial for the
        functionality of our app. It allows us to:
        <ul className="list-inside list-disc">
          <li>
            <span className="font-semibold">Maintain Your Session: </span>
            The sessionId cookie keeps you logged in as you navigate through
            different sections of our app. This prevents you from having to
            re-enter your login credentials repeatedly.
          </li>
          <li>
            <span className="font-semibold">Personalize Your Experience: </span>
            By remembering your session, we can deliver content and features
            tailored to your specific user account.
          </li>
          <li>
            <span className="font-semibold">Ensure Security: </span>
            The sessionId cookie helps us verify your identity and protect your
            account from unauthorized access.
          </li>
        </ul>
        <h2 className="text-xl font-bold">Why We Use This Cookie</h2>
        The sessionId cookie is essential for the basic operation of our app.
        Without it, you would not be able to stay logged in or access your
        personalized data. We do not use this cookie for tracking or advertising
        purposes.
        <h2 className="text-xl font-bold">Cookie Duration</h2>
        The sessionId cookie has a lifespan of one week (7 days). After this
        period, you will be required to log in again.
        <h2 className="text-xl font-bold">Your Choices</h2>
        <ul className="list-inside list-disc">
          <li>
            <span className="font-semibold">Cookie Acceptance: </span>
            By using our app, you consent to the use of the sessionId cookie.
          </li>
          <li>
            <span className="font-semibold">Browser Settings: </span>
            Most web browsers allow you to control cookies through their
            settings. You can typically choose to accept, reject, or delete
            cookies. However, please note that disabling cookies may
            significantly impact your experience on our app, and you may not be
            able to use all of its features. Because this cookie is required for
            the app to function, the app may not function at all if this cookie
            is blocked.
          </li>
          <li>
            <span className="font-semibold">App settings: </span>
            There are currently no in-app settings to change cookie permissions,
            as this cookie is essential for app use. Third-Party Cookies We do
            not use any third-party cookies on our app. The sessionId cookie is
            generated and managed by our app itself.
          </li>
        </ul>
        <h2 className="text-xl font-bold">Changes to This Policy</h2>
        We may update this cookie policy from time to time to reflect changes in
        our practices or for other operational, legal, or regulatory reasons. We
        will notify you of any significant changes by posting the new policy
        within the app.
      </div>
    </div>
  )
}
