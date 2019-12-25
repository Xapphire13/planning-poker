import { app, BrowserWindow, ipcMain } from "electron";
import express from "express";
import { ApolloServer, IResolvers } from "apollo-server-express";
import gql from "graphql-tag";
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import internalIp from "internal-ip";
import IpcChannel from ":shared/IpcChannel";
import path from "path";

const PORT = 4000;

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
  const expressServer = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  apolloServer.applyMiddleware({ app: expressServer });
  expressServer.use(express.static(path.resolve(__dirname, "web")));

  await new Promise((res) => expressServer.listen(PORT, res));
  console.log(`Ready at http://localhost:${PORT}`);

  await app.whenReady();

  ipcMain.handle(IpcChannel.GetIp, () => {
    return internalIp.v4();
  });

  // TODO
  ipcMain.handle(IpcChannel.GetConnectedCount, () => 10);

  await installExtension(REACT_DEVELOPER_TOOLS);
  const window = createWindow();
})();