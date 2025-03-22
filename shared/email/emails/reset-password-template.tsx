import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  resetToken?: string;
  baseUrl: string;
}

export const ResetPasswordEmail = ({
  resetToken,
  baseUrl,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Reset password for CoinControl</Preview>
      <Container style={container}>
        <Heading>CoinControl</Heading>
        <Heading style={heading}>Reset password for CoinControl.</Heading>
        <Section style={buttonContainer}>
          <Text style={paragraph}>
            This link will only be valid for the next 5 minutes.
          </Text>
          <Button
            style={button}
            href={`${baseUrl}/auth/password-reset?reset_token=${resetToken}`}
          >
            Reset password
          </Button>
        </Section>
        <Text style={paragraph}>If button does not work, copy this link:</Text>
        <Text style={codeSmall}>
          {`${baseUrl}/auth/password-reset?reset_token=${resetToken}`}
        </Text>
        <Hr style={hr} />
        <Link href={baseUrl} style={reportLink}>
          CoinControl
        </Link>
      </Container>
    </Body>
  </Html>
);

ResetPasswordEmail.PreviewProps = {
  resetToken: "tt226-5398x",
  baseUrl: "http://localhost:3000",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const codeSmall = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "13px",
  borderRadius: "4px",
  color: "#3c4149",
};
