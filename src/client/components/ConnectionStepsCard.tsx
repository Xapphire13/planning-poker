import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import Switch from "@material-ui/core/Switch";
import QRCode from "qrcode";
import ConnectionInfo from ":shared/ConnectionInfo";

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    padding: unit
  },
  url: {
    fontWeight: "bold"
  },
  grow: {
    flexGrow: 1
  },
  orText: {
    paddingLeft: unit,
    paddingRight: unit
  }
}));

export type ConnectionStepsCardProps = {
  connectionInfo: ConnectionInfo;
}

export default function ConnectionStepsCard({ connectionInfo }: ConnectionStepsCardProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [destination, setDestination] = useState<"local" | "remote">("local");
  const url = (destination === "local" || !connectionInfo.remote) ? connectionInfo.local : connectionInfo.remote;
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();

  useEffect(() => {
    QRCode.toString(url, { type: "svg", margin: 1 }, (err, svgText) => {
      if (err) {
        console.error(err);
        return;
      }

      setQrCodeSvg(svgText);
    });
  }, [url]);

  const handleSwitchToggled = () => setDestination(prev => prev === "local" ? "remote" : "local");

  return <Card {...css(styles.container)}>
    <Typography>
      To join, go to: <span {...css(styles.url)}>{url}</span>
    </Typography>
    <Grid container wrap="nowrap" alignItems="center">
      <Grid item {...css(styles.grow)}><Divider /></Grid>
      <Grid item {...css(styles.orText)}><Typography>OR</Typography></Grid>
      <Grid item {...css(styles.grow)}><Divider /></Grid>
    </Grid>
    <Typography>
      Scan the QR Code below:
    </Typography>
    {qrCodeSvg && <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />}
    {connectionInfo.remote && <Grid container wrap="nowrap" justify="center" alignItems="center">
      <Grid item><Typography>Local</Typography></Grid>
      <Grid item><Switch color="default" onChange={handleSwitchToggled} /></Grid>
      <Grid item><Typography>Remote</Typography></Grid>
    </Grid>}
  </Card>;
}