import SystemInformation, { Systeminformation } from 'systeminformation';
import ConnectionInterface from ':shared/ConnectionInterface';

function isInternetInterface(iface: Systeminformation.NetworkInterfacesData) {
  return iface.ifaceName.startsWith('en'); // macOS prefixes with `en`
}

function isVpnInterface(iface: Systeminformation.NetworkInterfacesData) {
  return iface.ifaceName.startsWith('gpd'); // GlobalProtect VPN
}

function isActiveInterface(iface: Systeminformation.NetworkInterfacesData) {
  return !!iface.ip4;
}

export default async function getNetworkInterfaces(): Promise<
  ConnectionInterface[]
> {
  const interfaces = (await SystemInformation.networkInterfaces())
    .filter(isActiveInterface)
    .filter(iface => isInternetInterface(iface) || isVpnInterface(iface));

  const toConnectionInterface = (networkType: string) => (
    iface: Systeminformation.NetworkInterfacesData,
    i: number
  ): ConnectionInterface => {
    return {
      name: i === 0 ? networkType : `${networkType} ${i + 1}`,
      address: iface.ip4
    };
  };

  return [
    // Then Wi-Fi
    ...interfaces
      .filter(iface => isInternetInterface(iface) && iface.type === 'wireless')
      .map(toConnectionInterface('Wi-Fi')),
    // Then Wired
    ...interfaces
      .filter(iface => isInternetInterface(iface) && iface.type === 'wired')
      .map(toConnectionInterface('Wired')),
    // Then VPN
    ...interfaces
      .filter(iface => isVpnInterface(iface))
      .map(toConnectionInterface('VPN'))
  ];
}
