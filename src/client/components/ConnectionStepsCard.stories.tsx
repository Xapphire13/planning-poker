import React from "react";
import CreateStory from ":storybook/CreateStory";
import ConnectionStepsCard from "./ConnectionStepsCard";

export default {
  title: "Connection Steps Card"
}

export const Default = CreateStory(() => <div style={{ width: 300 }}>
  <ConnectionStepsCard localInfo={{ url: "http://localhost:4000" }} remoteInfo={{ url: "http://abcd.ngrok.io" }} />
</div>);