import React, { useEffect, useState } from 'react';
import ProgressCircle from './ProgressCircle';
import createStory from ':storybook/CreateStory';

export default {
  title: 'Progress Circle',
};

export const Default = createStory(() => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setInterval(() => setValue((prev) => (prev === 10 ? 0 : prev + 1)), 1000);
  }, []);

  return (
    <div style={{ width: 200 }}>
      <ProgressCircle max={10} value={value} />
    </div>
  );
});
