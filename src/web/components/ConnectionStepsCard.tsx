import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import QRCode from 'qrcode';
import createStylesFn from ':web/theme/createStylesFn';

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    padding: unit
  },
  url: {
    fontWeight: 'lighter'
  },
  sessionId: {
    fontWeight: 'bold',
    fontSize: '1.2em'
  },
  grow: {
    flexGrow: 1
  },
  orText: {
    paddingLeft: unit,
    paddingRight: unit
  },
  networkSelect: {
    marginTop: unit,
    marginBottom: unit / 2
  },
  ngrokStatus: {
    marginBottom: unit / 2
  },
  networkSelectLabel: {
    fontWeight: 'bold'
  }
}));

export type ConnectionStepsCardProps = {
  sessionId: string;
};

export default function ConnectionStepsCard({
  sessionId
}: ConnectionStepsCardProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();
  const url = `${window.location.protocol}//${window.location.host}`;

  useEffect(() => {
    QRCode.toString(
      `${url}?sessionId=${sessionId}`,
      { type: 'svg', margin: 1 },
      (err, svgText) => {
        if (err) {
          console.error(err);
          setQrCodeSvg(undefined);
          return;
        }

        setQrCodeSvg(svgText);
      }
    );
  }, [sessionId, url]);

  return (
    <Card {...css(styles.container)}>
      <Typography>To join, go to:</Typography>
      <Typography align="center">
        <span {...css(styles.url)}>{url}?sessionId=</span>
        <span {...css(styles.sessionId)}>{sessionId}</span>
      </Typography>
      {qrCodeSvg && (
        <>
          <Grid container wrap="nowrap" alignItems="center">
            <Grid item {...css(styles.grow)}>
              <Divider />
            </Grid>
            <Grid item {...css(styles.orText)}>
              <Typography>OR</Typography>
            </Grid>
            <Grid item {...css(styles.grow)}>
              <Divider />
            </Grid>
          </Grid>
          <Typography>Scan the QR Code below:</Typography>
          <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
        </>
      )}
    </Card>
  );
}
