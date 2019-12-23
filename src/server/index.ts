import { app, BrowserWindow } from "electron";
import { ApolloServer } from "apollo-server";
import gql from "graphql-tag";

function createWindow() {
  let win = new BrowserWindow({
    width: 300,
    height: 600,
  })

  win.loadFile('index.html')
}

app.on("ready", createWindow);

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


const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`Ready at ${url}`);
})