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

interface VerifyEmailProps {
  otpCode?: string;
  baseUrl: string;
}

export const VerifyEmail = ({ otpCode, baseUrl }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Your verification code for CoinControl.</Preview>
      <Container style={container}>
        <Heading>CoinControl</Heading>
        <Heading style={heading}>Your verification code</Heading>
        <Text style={paragraph}>
          This code will only be valid for the next 5 minutes.
        </Text>
        <code style={code}>{otpCode}</code>
        <Hr style={hr} />
        <Link href={baseUrl} style={reportLink}>
          CoinControl
        </Link>
      </Container>
    </Body>
  </Html>
);

VerifyEmail.PreviewProps = {
  otpCode: "tt226-5398x",
  baseUrl: "http://localhost:3000",
} as VerifyEmailProps;

export default VerifyEmail;

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

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};
