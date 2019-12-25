import { loadTheme } from "office-ui-fabric-react/lib/Styling"

const theme = {
  unit: 8,
  fontFamily: ['Roboto', "sans-serif"],
  color: {
    background: "#242426",
    text: {
      default: "#fff"
    }
  }
};

loadTheme({
  defaultFontStyle: {
    fontFamily: theme.fontFamily.join((", "))
  }
})

export default theme;