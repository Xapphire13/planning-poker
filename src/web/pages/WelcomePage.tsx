import React from "react";
import { RouteComponentProps } from "@reach/router";

export type WelcomePageProps = RouteComponentProps;

export default function WelcomePage({ }: WelcomePageProps) {
  return <div>Welcome</div>;
}