import React from 'react';
import VStack from 'pancake-layout/dist/VStack';
import Divider from '@material-ui/core/Divider';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import VStackItem from 'pancake-layout/dist/VStackItem';
import SessionParticipants from ':web/components/SessionParticipants';

export type SessionParticipantsLayoutProps = {
  children: React.ReactNode | React.ReactNodeArray;
  sessionId: string | undefined;
};

const useStyles = createUseStyles({
  container: {
    height: '100%'
  }
});

export default function SessionParticipantsLayout({
  children,
  sessionId
}: SessionParticipantsLayoutProps) {
  const styles = useStyles();

  return (
    <VStack justify="space-between" className={classNames(styles.container)}>
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
