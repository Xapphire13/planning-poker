import { app, BrowserWindow, ipcMain } from "electron";
import express from "express";
import { ApolloServer, IResolvers } from "apollo-server-express";
import gql from "graphql-tag";
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import internalIp from "internal-ip";
import IpcChannel from ":shared/IpcChannel";
import path from "path";
import User from ":shared/User";

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
  type User {
    id: ID!
    name: String!
  }

  type VoidResult {
    success: Boolean!
  }

  type Query {
    noop: VoidResult
  }

  input UserInput {
    id: ID!
    name: String!
  }

  type Mutation {
    join(user: UserInput): VoidResult
  }
`;

let window: BrowserWindow | undefined;
const joinedUsers: Map<string, User> = new Map();

const resolvers = {
  Query: {
    noop: () => ({
      success: true
    })
  },
  Mutation: {
    join: (_: any, args: Record<string, any>) => {
      const user: User = args.user;
      if (!joinedUsers.has(user.id)) {
        joinedUsers.set(user.id, user);

        if (window) {
          window.webContents.send(IpcChannel.PersonConnected);
        }
      }


      return {
        success: true
      }
    }
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

  ipcMain.handle(IpcChannel.GetConnectedCount, () => joinedUsers.size);

  await installExtension(REACT_DEVELOPER_TOOLS);
  window = createWindow();
})();