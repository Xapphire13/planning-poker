import { loadTheme } from "office-ui-fabric-react/lib/Styling"
import { createMuiTheme } from "@material-ui/core";

const theme = {
  unit: 8,
  fontFamily: ['Roboto', "sans-serif"],
  color: {
    background: "#242426",
    text: {
      default: "#fff"
    },
    rule: "#888"
  }
};

export const muiTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

export default theme;