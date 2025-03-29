import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/features/layout/comoponents/theme-switcher'
import { Route } from '@/routes/privacy-policy'

export function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold">Privacy policy</h1>
        <h2 className="text-xl font-bold"> 1. Introduction</h2>
        <p>
          This Privacy Policy explains how we collect, use, and protect your
          personal data when you use our application. By using our services, you
          agree to the terms outlined in this policy.
        </p>
        <h2 className="text-xl font-bold"> 2. Data Collection and Usage</h2>
        <p>
          We collect and store certain user data in session cookies to
          facilitate authentication, security, and improve the user experience.
          The following information is stored during an active session:
        </p>
        <ul className="flex list-inside list-disc flex-col gap-3">
          <li>
            <strong>Session ID</strong> &#8208; Unique identifier for the
            session.
          </li>
          <li>
            <strong>Data</strong> &#8208; Additional session-related
            information.
          </li>
          <li>
            <strong>Expiration Time</strong> &#8208; Timestamp indicating when
            the session expires.
          </li>
          <li>
            <strong>User ID</strong> &#8208; Unique identifier of the
            authenticated user.
          </li>
          <li>
            <strong>Last Access</strong> &#8208; Timestamp of the last user
            interaction.
          </li>
          <li>
            <strong>Device Type</strong> &#8208; The type of device used.
          </li>
          <li>
            <strong>Operating System</strong> &#8208; The OS of the device.
          </li>
          <li>
            <strong>Browser</strong> &#8208; The browser used by the user.
          </li>
          <li>
            <strong>IP Address</strong> &#8208; The IP address of the user.
          </li>
          <li>
            <strong>Location</strong> &#8208; Approximate geographical location
            of the user.
          </li>
        </ul>
        <h2 className="text-xl font-bold">3. Cookies</h2>
        <p>
          We use essential session cookies to maintain your login session and
          ensure the security of our application. These cookies are strictly
          necessary for the application&apos;s functionality. We do not use
          third-party tracking cookies. Users can manage cookie settings within
          their browser.
        </p>
        <h2 className="text-xl font-bold">4. Data Protection</h2>
        <p>
          We take appropriate security measures to protect user data against
          unauthorized access, alteration, or disclosure. However, no method of
          transmission over the internet is 100% secure.
        </p>
        <h2 className="text-xl font-bold">5. Data Retention</h2>
        <p>
          Session data is stored only for the duration of the session and is
          deleted upon expiration. We do not retain session information beyond
          the necessary period.
        </p>
        <h2 className="text-xl font-bold">6. User Rights</h2>
        <p>You have the right to:</p>
        <ul className="flex list-inside list-disc flex-col gap-3">
          <li>Request access to your personal data.</li>
          <li>Request correction or deletion of your personal data.</li>
          <li>Withdraw consent for data processing where applicable.</li>
        </ul>

        <h2 className="text-xl font-bold">7. Contact Information</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at: maciejgarncarski@gmail.com
        </p>
        <h2 className="text-xl font-bold">8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page. You
          are advised to review this Privacy Policy periodically for any
          changes.
        </p>

        <p>
          <em>Last updated: 29.03.2025</em>
        </p>
      </div>
    </div>
  )
}
