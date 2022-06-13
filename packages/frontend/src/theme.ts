import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import createPalette from '@mui/material/styles/createPalette';
import createTypography from '@mui/material/styles/createTypography';
import { deepmerge } from '@mui/utils';

declare module "@mui/material/styles" {
  interface TypographyVariants {
    h1sup: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    h1sup?: React.CSSProperties;
  }

  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}


// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    h1sup: true;
  }
}

export enum ThemeColor {
  crimson = '#ed143d',
  cinnabar = '#BF4C41',
  whitesmoke = '#f5f5f5',
  teal = '#4db6ac',
  blueGrey = '#c4d1d7',
  error = '#de2114',
  errorLight = '#e8675a',
  errorDark = '#9e1c10',
  success = '#4caf50',
  transparent = "#00000000",
}

let baseTheme = createTheme({
  // if we set any of the default breakpoints to custom values, we need to update them all
  breakpoints: {
    values: {
      xs: 280,
      sm: 390,
      md: 820,
      lg: 1200,
      xl: 1536,
      xsmobile: 280,
      mobile: 390,
      tablet: 820,
      laptop: 1200,
      desktop: 1536, // default value
    },
  },
});

const palette = createPalette({
  neutral: {
    main: ThemeColor.whitesmoke,
  },
  background: {
    default: ThemeColor.whitesmoke,
  },
  primary: {
    main: ThemeColor.teal,
    contrastText: baseTheme.palette.common.white,
  },
  secondary: {
    main: ThemeColor.blueGrey,
  },
  error: {
    main: ThemeColor.error,
    light: ThemeColor.errorLight,
    dark: ThemeColor.errorDark,
  },
  success: {
    main: ThemeColor.success,
  },
  text: {
    primary: ThemeColor.crimson,
    secondary: ThemeColor.cinnabar,
  },
});

baseTheme.typography = createTypography(palette, {
  fontFamily: ['FatFrank', 'Comic Sans MS', 'sans-serif'].join(','),
});

baseTheme = responsiveFontSizes(baseTheme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl', 'xsmobile', 'mobile', 'tablet', 'laptop', 'desktop'],
});

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xsmobile: true;
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }
}


const { xs, sm, md } = baseTheme.breakpoints.values;

const typography = {
  h1: {
    fontSize: '8rem',
    [`@media (min-width: ${md}px)`]: {
      fontSize: '8rem',
    },
    [`@media (min-width: ${xs}px) and (max-width: ${md}px)`]: {
      fontSize: '5rem',
    },
    [`@media (max-width: ${xs}px)`]: {
      fontSize: '4.5rem',
    },
  },
  h2: {
    fontSize: '3rem',
    [`@media (min-width: ${sm}px) and (max-width: ${md}px)`]: {
      fontSize: '2.5rem',
    },
    [`@media (max-width: ${xs}px)`]: {
      fontSize: '2rem',
    },
  },
  h3: {
    fontSize: '2.25rem',
    [`@media (min-width: ${sm}px) and (max-width: ${md}px)`]: {
      fontSize: '1.7rem',
    },
    [`@media (max-width: ${xs}px)`]: {
      fontSize: '1.25rem',
    },
  },
  h4: {
    fontSize: '2rem',
    [`@media (min-width: ${md}px)`]: {
      fontSize: '2rem',
    },
    [`@media (max-width: ${sm}px)`]: {
      fontSize: '1.25rem',
    },
    [`@media (max-width: ${xs}px)`]: {
      fontSize: '1rem',
    },
  },
  h5: {
    fontSize: '1.75rem',
    [`@media (max-width: ${sm}px)`]: {
      fontSize: '1.2rem',
    },
    [`@media (max-width: ${xs}px)`]: {
      fontSize: '0.95rem',
    },
  },
  h6: {
    fontSize: '1.25rem',
    [`@media (min-width: ${md}px)`]: {
      fontSize: '1.25rem',
    },
    [`@media (max-width: ${sm}px)`]: {
      fontSize: '1rem',
    },
    [`@media (max-width: ${xs}px)`]: {
      fontSize: '0.9rem',
    },
  },
  h1sup: {
    fontSize: '1.25rem',
    top: '12px',
    right: 0,
    verticalAlign: 'top',
    position: 'relative',
    [`@media (min-width: ${md}px)`]: {
      fontSize: '1.25rem',
      top: '12px',
    },
    [`@media (min-width: ${xs}px) and (max-width: ${md}px)`]: {
      fontSize: '1rem',
      top: '6px',
    },
    [`@media (max-width: ${xs}px)`]: {
      fontSize: '0.95rem',
      top: '4px',
    },
  },
};


const theme = deepmerge(baseTheme, {
  palette,
  typography,
});

export default theme;
