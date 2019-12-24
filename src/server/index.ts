import { app, BrowserWindow } from "electron";
import { ApolloServer } from "apollo-server";
import gql from "graphql-tag";
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

function createWindow() {
  let win = new BrowserWindow({
    width: 300,
    height: 600,
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

  await installExtension(REACT_DEVELOPER_TOOLS);

  await app.whenReady();
  createWindow();
})();