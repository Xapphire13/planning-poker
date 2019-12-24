import { app, BrowserWindow, ipcMain } from "electron";
import { ApolloServer } from "apollo-server";
import gql from "graphql-tag";
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import internalIp from "internal-ip";

function createWindow() {
  let win = new BrowserWindow({
    width: 300,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
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

  ipcMain.handle("get-ip", () => {
    return internalIp.v4();
  });

  await installExtension(REACT_DEVELOPER_TOOLS);
  createWindow();
})();