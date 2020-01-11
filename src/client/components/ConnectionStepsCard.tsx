import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import QRCode from 'qrcode';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import delay from 'delay';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import createStylesFn from ':shared/theme/createStylesFn';
import ConnectionInterface from ':shared/ConnectionInterface';

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

export type ConnectionStepsCardProps = {
  connectionInterfaces: ConnectionInterface[];
  toggleNgrok: (state: 'on' | 'off') => Promise<void>;
};

export default function ConnectionStepsCard({
  connectionInterfaces,
  toggleNgrok
}: ConnectionStepsCardProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [selectedInterface, setSelectedInterface] = useState<
    ConnectionInterface | undefined
  >(connectionInterfaces[0]);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();
  const [ngrokStatus, setNgrokStatus] = useState<string>();

  useEffect(() => {
    if (selectedInterface?.address) {
      QRCode.toString(
        selectedInterface.address,
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
    } else {
      setQrCodeSvg(undefined);
    }
  }, [selectedInterface]);

  useEffect(() => {
    setSelectedInterface(
      connectionInterfaces.find(iface => iface.name === selectedInterface?.name)
    );
  }, [connectionInterfaces, selectedInterface]);

  const handleInterfaceChanged = (name: string) => {
    setSelectedInterface(
      connectionInterfaces.find(iface => iface.name === name)!
    );
  };

  const handleToggleNgrok = () => {
    const isConnected =
      selectedInterface?.name === 'Ngrok' && !!selectedInterface?.address;

    setNgrokStatus(!isConnected ? 'Connecting' : 'Disconnecting');
    Promise.all([
      delay(1000), // Synthetic delay to improve UX
      toggleNgrok(isConnected ? 'off' : 'on')
    ]).then(() => {
      setNgrokStatus(undefined);
    });
  };

  return (
    <Card {...css(styles.container)}>
      {connectionInterfaces.length > 1 && (
        <FormControl
          fullWidth
          variant="outlined"
          {...css(styles.networkSelect)}
        >
          <InputLabel
            id="network-select-label"
            {...css(styles.networkSelectLabel)}
          >
            Network
          </InputLabel>
          <Select
            labelId="network-select-label"
            labelWidth={62}
            fullWidth
            onChange={val => handleInterfaceChanged(val.target.value as string)}
            value={selectedInterface?.name}
          >
            {connectionInterfaces.map(iface => (
              <MenuItem key={iface.name} value={iface.name}>
                {iface.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {selectedInterface && (
        <>
          {selectedInterface.name === 'Ngrok' && (
            <>
              <Grid
                container
                wrap="nowrap"
                alignItems="center"
                justify="center"
              >
                {!!ngrokStatus && (
                  <Grid item>
                    <Typography {...css(styles.ngrokStatus)}>
                      {ngrokStatus}
                    </Typography>
                  </Grid>
                )}
                {!ngrokStatus && (
                  <>
                    <Grid item>
                      <Typography>Off</Typography>
                    </Grid>
                    <Grid item {...css(styles.orText)}>
                      <Switch
                        checked={!!selectedInterface.address}
                        onChange={handleToggleNgrok}
                        color="default"
                      />
                    </Grid>
                    <Grid item>
                      <Typography>On</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </>
          )}
          {!ngrokStatus && (
            <>
              {selectedInterface.address && (
                <Typography>
                  To join, go to:{' '}
                  <span {...css(styles.url)}>{selectedInterface.address}</span>
                </Typography>
              )}
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
            </>
          )}
        </>
      )}
    </Card>
  );
}
