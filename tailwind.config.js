const path = require('path');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const themes = {
  default: {
    primary: {
      100: "#0B4D1C",
      200: "#488513",
      300: "#76A600",
      400: "#BBF08F",
      500: "#488513",
      600: "#488513",
      700: "#488513",
      800: "#488513",
      900: "#488513",
      950: "#488513",
      DEFAULT: "#0B4D1C",
    },
    secondary: {
      50: "#e6edf5",
      100: "#d9e4f0",
      200: "#b0c8df",
      300: "#004c98",
      400: "#004489",
      500: "#003d7a",
      600: "#003972",
      700: "#002e5b",
      800: "#002244",
      900: "#001b35",
      950: "#2a2a2a",
      DEFAULT: "#003972",
    },
    accent: {
      ...colors.slate,
      DEFAULT: colors.slate[800],
    },
    slate: {
      50: "#fafafa",
      100: "#f4f4f4",
      200: "#ededed",
      300: "#dfdfdf",
      400: "#bbbbbb",
      500: "#9c9c9c",
      600: "#737373",
      700: "#606060",
      800: "#414141",
      900: "#202020",
      950: "#202020",
      DEFAULT: "#ededed",
    },
    warn: {
      ...colors.red,
      DEFAULT: colors.red[600],
    },
    'on-warn': {
      500: colors.red['50'],
    },
  },
};

const config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,scss,ts}',
    "./node_modules/flowbite/**/*.js", "./node_modules/tw-elements/dist/js/**/*.js"],
  important: true,
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      base: '1.25rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '2.5rem',
      '3xl': '3rem',
      '4xl': '4rem',
      '5xl': '5rem',
      '6xl': '5.5rem',
      '7xl': '6rem',
      '8xl': '6.5rem',
      '9xl': '7rem',
      '10xl': '7.5rem',
    },
    screens: {
      sm: '460px',
      md: '960px',
      custom: '1160px',
      lg: '1280px',
      xl: '1440px',
      large: '1600px',
    },
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        gray: colors.slate,
        grayLigth: '#868686',
        grayDark: '#4C4C4C',
        'custom-purple-start': '#D350F2',
        'custom-purple-end': '#AB66FF',
      },
      flex: {
        0: '0 0 auto',
      },
      fontFamily: {
        sans: `"Mulish var", ${defaultTheme.fontFamily.sans.join(',')}`,
        mono: `"IBM Plex Mono", ${defaultTheme.fontFamily.mono.join(',')}`,
      },
      opacity: {
        12: '0.12',
        38: '0.38',
        87: '0.87',
      },
      rotate: {
        '-270': '270deg',
        15: '15deg',
        30: '30deg',
        60: '60deg',
        270: '270deg',
      },
      scale: {
        '-1': '-1',
      },
      zIndex: {
        '-1': -1,
        49: 49,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        99: 99,
        999: 999,
        9999: 9999,
        99999: 99999,
      },
      spacing: {
        // 4: '0.25rem',
        // 8: '0.5rem',
        // 16: '1rem',
        // 24: '1.5rem',
        // 32: '2rem',
        // 40: '2.5rem',
        // 48: '3rem',
        // 64: '4rem',
        // 100: '25rem',
        // 120: '30rem',
        // 128: '32rem',
        // 140: '35rem',
        // 160: '40rem',
        // 180: '45rem',
        // 192: '48rem',
        // 200: '50rem',
        // 240: '60rem',
        // 256: '64rem',
        // 280: '70rem',
        // 320: '80rem',
        // 360: '90rem',
        // 400: '100rem',
        // 480: '120rem',

        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        50: '12.5rem',
        90: '22.5rem',

        100: '25rem',
        120: '30rem',
        128: '32rem',
        140: '35rem',
        160: '40rem',
        180: '45rem',
        192: '48rem',
        200: '50rem',
        240: '60rem',
        256: '64rem',
        280: '70rem',
        320: '80rem',
        360: '90rem',
        400: '100rem',
        480: '120rem',

        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
      },
      minHeight: ({ theme }) => ({
        ...theme('spacing'),
      }),
      maxHeight: {
        none: 'none',
      },
      minWidth: ({ theme }) => ({
        ...theme('spacing'),
        screen: '100vw',
      }),
      maxWidth: ({ theme }) => ({
        ...theme('spacing'),
        screen: '100vw',
        maxSize: '1680px'
      }),
      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        drawer: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      backgroundImage: {
        'auth-image': "url('/assets/images/auth/auth-image.svg')",
        'hero-image': "linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0.00) 100%), url('/assets/images/landing/hero.jpg')",
        'carrousel-1': "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 10%, rgba(0, 0, 0, 0.80) 100%), url('/assets/images/landing/carrousel-1.jpg')",
        'carrousel-2': "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 10%, rgba(0, 0, 0, 0.80) 100%), url('/assets/images/landing/carrousel-2.jpg')",
        'carrousel-3': "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 10%, rgba(0, 0, 0, 0.80) 100%), url('/assets/images/landing/carrousel-3.jpg')",
        'carrousel-4': "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 10%, rgba(0, 0, 0, 0.80) 100%), url('/assets/images/landing/carrousel-4.jpg')",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: 'var(--hubsd-text-low-pure)',
            '[class~="lead"]': {
              color: 'var(--hubsd-text-low-medium)',
            },
            a: {
              color: 'var(--hubsd-primary-500)',
            },
            strong: {
              color: 'var(--hubsd-text-low-pure)',
            },
            'ol > li::before': {
              color: 'var(--hubsd-text-low-medium)',
            },
            'ul > li::before': {
              backgroundColor: 'var(--hubsd-text-hint)',
            },
            hr: {
              borderColor: 'var(--hubsd-border)',
            },
            blockquote: {
              color: 'var(--hubsd-text-low-pure)',
              borderLeftColor: 'var(--hubsd-border)',
            },
            h1: {
              color: 'var(--hubsd-text-low-pure)',
            },
            h2: {
              color: 'var(--hubsd-text-low-pure)',
            },
            h3: {
              color: 'var(--hubsd-text-low-pure)',
            },
            h4: {
              color: 'var(--hubsd-text-low-pure)',
            },
            'figure figcaption': {
              color: 'var(--hubsd-text-low-medium)',
            },
            code: {
              color: 'var(--hubsd-text-low-pure)',
              fontWeight: '500',
            },
            'a code': {
              color: 'var(--hubsd-primary)',
            },
            pre: {
              color: theme('colors.white'),
              backgroundColor: theme('colors.gray.800'),
            },
            thead: {
              color: 'var(--hubsd-text-low-pure)',
              borderBottomColor: 'var(--hubsd-border)',
            },
            'tbody tr': {
              borderBottomColor: 'var(--hubsd-border)',
            },
            'ol[type="A" s]': false,
            'ol[type="a" s]': false,
            'ol[type="I" s]': false,
            'ol[type="i" s]': false,
          },
        },
        sm: {
          css: {
            code: {
              fontSize: '1em',
            },
            pre: {
              fontSize: '1em',
            },
            table: {
              fontSize: '1em',
            },
          },
        },
      }),
    },
  },
  corePlugins: {
    appearance: false,
    container: false,
    float: false,
    clear: false,
    placeholderColor: false,
    placeholderOpacity: false,
    verticalAlign: false,
  },
  plugins: [
    require(path.resolve(__dirname, 'src/@hubsd/tailwind/plugins/utilities')),
    require(path.resolve(__dirname, 'src/@hubsd/tailwind/plugins/theming'))({
      themes,
    }),
    require('@tailwindcss/typography')({ modifiers: ['sm', 'lg'] }),
    require("tw-elements/dist/plugin.cjs")
  ],
};

module.exports = config;
