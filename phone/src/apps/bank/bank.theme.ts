import { blue, common } from '@mui/material/colors';

export const BANK_APP_PRIMARY_COLOR = blue[500];
export const BANK_APP_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: BANK_APP_PRIMARY_COLOR,
      dark: blue[700],
      light: blue[300],
      contrastText: BANK_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#d32f2f',
      light: '#eb4242',
      dark: '#941212',
      contrastText: BANK_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: BANK_APP_TEXT_COLOR,
    },
  },
};

export default theme;
