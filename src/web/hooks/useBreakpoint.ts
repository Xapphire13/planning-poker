import createBreakpoint from 'react-use/lib/createBreakpoint';

const BREAKPOINTS = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };

const useBreakpoint = createBreakpoint(
  BREAKPOINTS
) as () => keyof typeof BREAKPOINTS;

export default () => {
  const currentBreakpoint = useBreakpoint();

  const breakpoints: Record<keyof typeof BREAKPOINTS, boolean> = {
    xs: true,
    sm: currentBreakpoint !== 'xs',
    md: ['md', 'lg', 'xl'].includes(currentBreakpoint),
    lg: ['lg', 'xl'].includes(currentBreakpoint),
    xl: currentBreakpoint === 'xl'
  };

  return { currentBreakpoint, breakpoints };
};
