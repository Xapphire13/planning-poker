import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import UserDetailsInput from ":web/components/UserDetailsInput";
import { createStylesFn } from ":shared/theme/createStylesFn";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import User from ":shared/User";
import uuid from "uuid/v4";
import LocalStorageUtils from ":web/LocalStorageUtils";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export type WelcomePageProps = RouteComponentProps;

const stylesFn = createStylesFn(({ unit }) => ({
  container: {
    height: "100%",
  },
  contentContainer: {
    padding: unit,
    flexGrow: 1,
  },
  heading: {
    marginTop: 0
  }
}));

const JOIN_MUTATION = gql`
mutation JoinSession($user: UserInput!){
  join(user: $user) {
    success
  }
}
`;

export default function WelcomePage({ }: WelcomePageProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [name, setName] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [joinSession] = useMutation(JOIN_MUTATION);

  useEffect(() => {
    let user = LocalStorageUtils.getItem<User>("user");

    if (user) {
      setName(user.name);
    } else {
      user = {
        id: uuid(),
        name: ""
      };

      LocalStorageUtils.setItem("user", user);
    }

    setUserId(user.id);
  }, []);

  const handleJoin = () => {
    LocalStorageUtils.setItem<User>("user", {
      id: userId!,
      name: name!
    })

    joinSession({
      variables: {
        user: {
          id: userId,
          name: name
        }
      }
    }).then(() => console.log("joined"));
  }

  return <Grid container direction="column" {...css(styles.container)}>
    <Grid child {...css(styles.contentContainer)}>
      <h1 {...css(styles.heading)}>Planning Poker</h1>
      <UserDetailsInput name={name} onNameChanged={setName} />
    </Grid>
    <Button variant="contained" color="primary" disabled={!name || !userId} onClick={handleJoin}>Join</Button>
  </Grid>;
}