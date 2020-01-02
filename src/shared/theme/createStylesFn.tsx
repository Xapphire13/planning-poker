import { Styles } from 'react-with-styles';
import DefaultTheme from './DefaultTheme';

type StylesFn = (theme: typeof DefaultTheme) => Styles;

export function createStylesFn(stylesFn: StylesFn): StylesFn {
  return stylesFn;
}
