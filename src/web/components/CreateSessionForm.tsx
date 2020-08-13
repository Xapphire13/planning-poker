import React, { useState, useContext } from 'react';
import useStyles from 'react-with-styles/lib/hooks/useStyles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { ColorResult, SketchPicker } from 'react-color';
import createStylesFn from ':web/theme/createStylesFn';
import StorageUtil from ':web/utils/storageUtil';
import { DEFAULT_TIME_LIMIT, DEFAULT_COLOR } from ':web/constants';
import { ThemeContext } from ':web/theme/SessionThemeProvider';
import { createThemeWithPrimaryColor } from ':web/theme/DefaultTheme';
import { VoteSequenceType } from ':__generated__/graphql';

const stylesFn = createStylesFn(({ unit }) => ({
  marginTop: {
    marginTop: unit,
  },
  formControl: {
    margin: unit,
    minWidth: 120,
  },
  button: {
    marginTop: 4 * unit,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
  colorButton: {
    margin: unit,
    width: 120,
    height: 120,
    backgroundColor: DEFAULT_COLOR,
    borderColor: DEFAULT_COLOR,
  },
  colorPickerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },
}));

export type CreateSessionFormProps = {
  handleCreateSession: () => void;
};

export default function CreateSessionForm({
  handleCreateSession,
}: CreateSessionFormProps) {
  const { css, styles } = useStyles({ stylesFn });
  const setTheme = useContext(ThemeContext)!;
  const [sessionSequence, setSessionSequence] = useState<string>(
    VoteSequenceType.FIBONACCI
  );
  const [sessionTimeLimit, setSessionTimeLimit] = useState(DEFAULT_TIME_LIMIT);
  const [sessionColor, setSessionColor] = useState(DEFAULT_COLOR);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleSequenceChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    StorageUtil.session.setItem(
      'sessionSequence',
      event.target.value as string
    );
    setSessionSequence(event.target.value as string);
  };

  const handleTimeLimitChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    StorageUtil.session.setItem(
      'sessionTimeLimit',
      event.target.value as number
    );
    setSessionTimeLimit(event.target.value as number);
  };

  const handleColorChange = (color: ColorResult) => {
    StorageUtil.session.setItem('sessionColor', color.hex);
    setSessionColor(color.hex);
    setTheme(createThemeWithPrimaryColor(color.hex));
  };

  return (
    <>
      <FormGroup>
        <FormControl variant="filled" {...css(styles.formControl)}>
          <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            Sequence
          </InputLabel>
          <Select
            labelId="sequence-select-label"
            id="sequence-select"
            value={sessionSequence}
            onChange={handleSequenceChange}
            displayEmpty
            className="sequence-select-class"
            autoWidth
          >
            <MenuItem value={VoteSequenceType.FIBONACCI}>Fibonacci</MenuItem>
            {/* TODO: Add support for T-Shirt sequence */}
            <MenuItem value={VoteSequenceType.TSHIRT}>T-Shirt</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled" {...css(styles.formControl)}>
          <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            Time limit
          </InputLabel>
          <Select
            labelId="sequence-timelimit-label"
            id="timelimit-select"
            value={sessionTimeLimit}
            onChange={handleTimeLimitChange}
            displayEmpty
            className="sequence-timelimit-class"
            autoWidth
          >
            <MenuItem value={10}>10 seconds</MenuItem>
            <MenuItem value={20}>20 seconds</MenuItem>
            <MenuItem value={30}>30 seconds</MenuItem>
            <MenuItem value={40}>40 seconds</MenuItem>
            <MenuItem value={50}>50 seconds</MenuItem>
            <MenuItem value={60}>60 seconds</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled" {...css(styles.formControl)}>
          <Button
            variant="text"
            color="primary"
            {...css(styles.button)}
            onClick={() => setDisplayColorPicker(!displayColorPicker)}
          >
            Select theme
          </Button>
          {displayColorPicker && (
            <div {...css(styles.colorPickerContainer)}>
              <SketchPicker color={sessionColor} onChange={handleColorChange} />
            </div>
          )}
        </FormControl>
      </FormGroup>
      <Button
        {...css(styles.button)}
        variant="contained"
        color="primary"
        onClick={handleCreateSession}
      >
        Create session
      </Button>
    </>
  );
}
