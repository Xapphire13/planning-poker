import { app, BrowserWindow, ipcMain } from "electron";
import { ApolloServer } from "apollo-server";
import gql from "graphql-tag";
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import internalIp from "internal-ip";
import IpcChannel from ":shared/IpcChannel";

function createWindow() {
  let win = new BrowserWindow({
    width: 300,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

  return win;
}

const typeDefs = gql`
  type Test {
    text: String
  }

  type Query {
    tests: [Test]
  }
`;

const testData = [
  { text: "foobar" }
];

const resolvers = {
  Query: {
    tests: () => Promise.resolve(testData)
  }
};

(async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`Ready at ${url}`);
  })

  await app.whenReady();

  ipcMain.handle(IpcChannel.GetIp, () => {
    return internalIp.v4();
  });

  // TODO
  ipcMain.handle(IpcChannel.GetConnectedCount, () => 10);

  await installExtension(REACT_DEVELOPER_TOOLS);
  const window = createWindow();
})();