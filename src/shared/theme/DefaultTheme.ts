import { loadTheme } from "office-ui-fabric-react/lib/Styling"

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

export const officeTheme = loadTheme({
  defaultFontStyle: {
    fontFamily: theme.fontFamily.join((", "))
  },
  semanticColors: {
    bodyBackground: theme.color.background,
    bodyText: theme.color.text.default,
  }
})

export default theme;