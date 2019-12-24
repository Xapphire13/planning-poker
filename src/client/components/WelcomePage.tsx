import React from "react";
import { RouteComponentProps } from "@reach/router";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

export type WelcomePageProps = RouteComponentProps;

export default function WelcomePage({ navigate }: WelcomePageProps) {
  return <div>
    <PrimaryButton onClick={() => navigate?.("/results")}>See results</PrimaryButton>
  </div>
}