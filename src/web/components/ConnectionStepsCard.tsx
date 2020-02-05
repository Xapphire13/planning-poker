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
    fontWeight: 'bold'
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

export type ConnectionStepsCardProps = {};

export default function ConnectionStepsCard() {
  const { css, styles } = useStyles({ stylesFn });
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();

  useEffect(() => {
    // TODO put in real address
    QRCode.toString('', { type: 'svg', margin: 1 }, (err, svgText) => {
      if (err) {
        console.error(err);
        setQrCodeSvg(undefined);
        return;
      }

      setQrCodeSvg(svgText);
    });
  }, []);

  return (
    <Card {...css(styles.container)}>
      <Typography>
        To join, go to: <span {...css(styles.url)}>TODO</span>
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
