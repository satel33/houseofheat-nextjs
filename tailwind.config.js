const defaultTheme = require('tailwindcss/defaultTheme')

const colors = require('./src/theme/colors.cjs')
const fontSize = require('./src/theme/fontSize.cjs')
const screens = require('./src/theme/screens.cjs')
const sizes = require('./src/theme/sizes.cjs')
const zIndex = require('./src/theme/zIndex.cjs')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    colors,
    screens,
    zIndex,
    fontSize,
    fontFamily: {
      sans: ['"ABC Whyte"', ...defaultTheme.fontFamily.sans],
      serif: ['"ABC Whyte Inktrap"', ...defaultTheme.fontFamily.serif],
      mono: ['"ABC Whyte Mono"', ...defaultTheme.fontFamily.mono]
    },
    extend: {
      typography: theme => ({
        DEFAULT: {
          css: {
            color: '#000',
            h1: {
              fontFamily: theme('fontFamily')?.serif.join(',')
            },
            h2: {
              fontFamily: theme('fontFamily')?.serif.join(','),
              marginTop: 0
            },
            h3: {
              fontFamily: theme('fontFamily')?.serif.join(',')
            },
            h4: {
              fontSize: '1.15em'
            },
            h5: {
              fontSize: '1.05em',
              fontWeight: 'bold'
            },
            h6: {
              fontWeight: 'bold'
            },
            p: {
              fontSize: '18px',
              lineHeight: 1.5
            },
            link: {
              textDecoration: 'underline'
            },
            '--tw-prose-body': '#000',
            '--tw-prose-headings': '#000',
            '--tw-prose-links': '#000',
            '--tw-prose-bold': '#000',
            '--tw-prose-quotes': '#000',
            '--tw-prose-quote-borders': '#000',
            '--tw-prose-code': '#000'
          }
        }
      }),
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17'
      },
      gridTemplateColumns: {
        18: 'repeat(18, minmax(0, 1fr))', // Simple 18 column grid
        releasePreviewGrid: 'min-content 1fr min-content'
      },
      gridTemplateRows: {
        releasePreviewGrid: 'min-content 1fr min-content'
      },
      borderRadius: {
        menu: '32px'
      },
      spacing: sizes,
      maxWidth: sizes,
      maxHeight: {
        menu: '500px'
      },
      transitionTimingFunction: {
        'custom-out': 'cubic-bezier(.01,.93,.12,.96)'
      },
      animation: {
        flash: 'pulse 80ms steps(1) infinite'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    function ({ addVariant }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
    }
  ]
}
