import { UAParser } from 'ua-parser-js';

const browserInfo = (() => {
  const uaParser = new UAParser();

  return {
    engine: uaParser.getEngine(),
    browser: uaParser.getBrowser()
  };
})();

export default function useBrowserInfo() {
  return browserInfo;
}
