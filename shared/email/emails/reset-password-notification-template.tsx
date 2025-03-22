import {
  Body,
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
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordNotificationEmailProps {
  baseUrl: string;
  createdAt: string;
}

export const ResetPasswordNotificationEmail = ({
  baseUrl,
  createdAt,
}: ResetPasswordNotificationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Reset password for CoinControl</Preview>
      <Container style={container}>
        <Heading>CoinControl</Heading>
        <Section>
          <Text style={paragraph}>
            You updated the password for your CoinControl account on{" "}
            <CodeInline style={codeSmall}>{createdAt}</CodeInline>.
          </Text>
          <Text style={paragraph}>
            If this was you, then no further action is required.
          </Text>
          <Text style={paragraph}>
            However if you did NOT perform this password change, please{" "}
            <Link href={`${baseUrl}/auth/forgot-password`}>
              reset your account password
            </Link>{" "}
            immediately.
          </Text>
          <Hr style={hr} />
        </Section>
        <Link href={baseUrl} style={reportLink}>
          CoinControl
        </Link>
      </Container>
    </Body>
  </Html>
);

ResetPasswordNotificationEmail.PreviewProps = {
  createdAt: "today",
  baseUrl: "http://localhost:3000",
} as ResetPasswordNotificationEmailProps;

export default ResetPasswordNotificationEmail;

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

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
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
