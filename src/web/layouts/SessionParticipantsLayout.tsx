import React from 'react';
import VStack from 'pancake-layout/dist/VStack';
import Divider from '@material-ui/core/Divider';
import VStackItem from 'pancake-layout/dist/VStackItem';
import { css } from 'linaria';
import SessionParticipants from ':web/components/SessionParticipants';

export type SessionParticipantsLayoutProps = {
  children: React.ReactNode | React.ReactNodeArray;
  sessionId: string | undefined;
};

const container = css`
  height: 100%;
`;

export default function SessionParticipantsLayout({
  children,
  sessionId,
}: SessionParticipantsLayoutProps) {
  return (
    <VStack justify="space-between" className={container}>
      <VStackItem grow>{children}</VStackItem>
      {sessionId && (
        <>
          <Divider />
          <SessionParticipants sessionId={sessionId} />
        </>
      )}
    </VStack>
  );
}
