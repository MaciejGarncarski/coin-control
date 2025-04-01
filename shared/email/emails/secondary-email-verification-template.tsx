import {
  Body,
  Button,
  CodeInline,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface SecondaryEmailVerificationProps {
  verificationToken?: string
  email: string
  baseUrl: string
}

export const SecondaryEmailVerification = ({
  verificationToken,
  email,
  baseUrl,
}: SecondaryEmailVerificationProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Confirm email for CoinControl</Preview>
      <Container style={container}>
        <Heading>CoinControl</Heading>
        <Heading style={heading}>Confirm email for CoinControl.</Heading>
        <Section style={buttonContainer}>
          <Text style={paragraph}>You are adding new email:</Text>
          <CodeInline style={codeSmall}>{email}</CodeInline>
        </Section>
        <Section style={buttonContainer}>
          <Text style={paragraph}>
            This link will only be valid for the next 5 minutes.
          </Text>
          <Button
            style={button}
            href={`${baseUrl}/auth/verify-email?email=${encodeURIComponent(email)}&token=${verificationToken}`}>
            Verify email
          </Button>
        </Section>
        <Text style={paragraph}>If button does not work, copy this link:</Text>
        <Text style={codeSmall}>
          {`${baseUrl}/auth/verify-email?email=${encodeURIComponent(email)}&token=${verificationToken}`}
        </Text>
        <Hr style={hr} />
        <Link href={baseUrl} style={reportLink}>
          CoinControl
        </Link>
      </Container>
    </Body>
  </Html>
)

SecondaryEmailVerification.PreviewProps = {
  verificationToken: 'tt226-5398x',
  baseUrl: 'http://localhost:3000',
  email: 'test@email.com',
} as SecondaryEmailVerificationProps

export default SecondaryEmailVerification

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
}

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
}

const buttonContainer = {
  padding: '27px 0 27px',
}

const button = {
  backgroundColor: '#5e6ad2',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
}

const reportLink = {
  fontSize: '14px',
  color: '#b4becc',
}

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
}

const codeSmall = {
  fontFamily: 'monospace',
  fontWeight: '700',
  padding: '1px 4px',
  backgroundColor: '#dfe1e4',
  letterSpacing: '-0.3px',
  fontSize: '13px',
  borderRadius: '4px',
  color: '#3c4149',
}
