import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

const { ipcRenderer } = window.require("electron");

export type WelcomePageProps = RouteComponentProps;

export default function WelcomePage({ navigate }: WelcomePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState<string>();

  useEffect(() => {
    ipcRenderer.invoke("get-ip").then((ip: string) => {
      setIpAddress(ip);
      setIsLoading(false);
    });
  }, []);

  return <>
    {!isLoading && <div>
      To join, go to: http://{ipAddress}
      <PrimaryButton onClick={() => navigate?.("/results")}>See results</PrimaryButton>
    </div>}
  </>
}