const chroma = require('chroma-js');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const flattenColorPalette =
  require('tailwindcss/lib/util/flattenColorPalette').default;

const generateContrasts = require(path.resolve(
  __dirname,
  '../../utils/generate-contrasts'
));
const jsonToSassMap = require(path.resolve(
  __dirname,
  '../../utils/json-to-sass-map'
));

const normalizeTheme = (theme) => {
  return _.fromPairs(
    _.map(
      _.omitBy(
        theme,
        (palette, paletteName) =>
          paletteName.startsWith('on') || _.isEmpty(palette)
      ),
      (palette, paletteName) => [
        paletteName,
        {
          ...palette,
          DEFAULT: palette['DEFAULT'] || palette[500],
        },
      ]
    )
  );
};

const theming = plugin.withOptions(
  (options) =>
    ({ addComponents, e, theme }) => {
      const userThemes = _.fromPairs(
        _.map(options.themes, (theme, themeName) => [
          themeName,
          _.defaults({}, theme, options.themes['default']),
        ])
      );

      let themes = _.fromPairs(
        _.map(userThemes, (theme, themeName) => [
          themeName,
          normalizeTheme(theme),
        ])
      );

      themes = _.fromPairs(
        _.map(themes, (theme, themeName) => [
          themeName,
          _.pick(
            _.fromPairs(
              _.map(theme, (palette, paletteName) => [
                paletteName,
                {
                  ...palette,
                  contrast: _.fromPairs(
                    _.map(generateContrasts(palette), (color, hue) => [
                      hue,
                      _.get(userThemes[themeName], [
                        `on-${paletteName}`,
                        hue,
                      ]) || color,
                    ])
                  ),
                },
              ])
            ),
            ['primary', 'accent', 'warn']
          ),
        ])
      );

      themes = _.fromPairs(
        _.map(themes, (theme, themeName) => [
          themeName,
          {
            selector: `".theme-${themeName}"`,
            ...theme,
          },
        ])
      );

      const sassMap = jsonToSassMap(JSON.stringify({ 'user-themes': themes }));

      const filename = path.resolve(__dirname, '../../styles/user-themes.scss');

      let data;
      try {
        data = fs.readFileSync(filename, { encoding: 'utf8' });
      } catch (err) {
        console.error(err);
      }

      if (data !== sassMap) {
        try {
          fs.writeFileSync(filename, sassMap, { encoding: 'utf8' });
        } catch (err) {
          console.error(err);
        }
      }

      addComponents(
        _.fromPairs(
          _.map(options.themes, (theme, themeName) => [
            themeName === 'default'
              ? 'body, .theme-default'
              : `.theme-${e(themeName)}`,
            _.fromPairs(
              _.flatten(
                _.map(
                  flattenColorPalette(
                    _.fromPairs(
                      _.flatten(
                        _.map(normalizeTheme(theme), (palette, paletteName) => [
                          [e(paletteName), palette],
                          [
                            `on-${e(paletteName)}`,
                            _.fromPairs(
                              _.map(
                                generateContrasts(palette),
                                (color, hue) => [
                                  hue,
                                  _.get(theme, [`on-${paletteName}`, hue]) ||
                                  color,
                                ]
                              )
                            ),
                          ],
                        ])
                      )
                    )
                  ),
                  (value, key) => [
                    [`--hubsd-${e(key)}`, value],
                    [`--hubsd-${e(key)}-rgb`, chroma(value).rgb().join(',')],
                  ]
                )
              )
            ),
          ])
        )
      );

      const schemeCustomProps = _.map(['light', 'dark'], (colorScheme) => {
        const isDark = colorScheme === 'dark';
        const background = theme(
          `hubsd.customProps.background.${colorScheme}`
        );
        const foreground = theme(
          `hubsd.customProps.foreground.${colorScheme}`
        );
        const lightSchemeSelectors = 'body.light, .light, .dark .light';
        const darkSchemeSelectors = 'body.dark, .dark, .light .dark';

        return {
          [isDark ? darkSchemeSelectors : lightSchemeSelectors]: {
            ...(!isDark ? { '--is-dark': 'false' } : {}),

            ..._.fromPairs(
              _.flatten(
                _.map(background, (value, key) => [
                  [`--hubsd-${e(key)}`, value],
                  [`--hubsd-${e(key)}-rgb`, chroma(value).rgb().join(',')],
                ])
              )
            ),
            ..._.fromPairs(
              _.flatten(
                _.map(foreground, (value, key) => [
                  [`--hubsd-${e(key)}`, value],
                  [`--hubsd-${e(key)}-rgb`, chroma(value).rgb().join(',')],
                ])
              )
            ),
          },
        };
      });

      const schemeUtilities = (() => {
        return {};
      })();

      addComponents(schemeCustomProps);
      addComponents(schemeUtilities);
    },
  (options) => {
    return {
      theme: {
        extend: {
          colors: _.fromPairs(
            _.flatten(
              _.map(
                _.keys(
                  flattenColorPalette(normalizeTheme(options.themes.default))
                ),
                (name) => [
                  [name, `rgba(var(--hubsd-${name}-rgb), <alpha-value>)`],
                  [
                    `on-${name}`,
                    `rgba(var(--hubsd-on-${name}-rgb), <alpha-value>)`,
                  ],
                ]
              )
            )
          ),
        },
        hubsd: {
          customProps: {
            background: {
              light: {
                'bg-app-bar': '#ffffff',
                'bg-card': '#f7f7f7',
                'bg-default': '#ededed',
                'bg-dialog': '#EDEDED',
                'bg-hover': '#E8E8E8',
                'bg-active': '#d8eaff',
                'bg-status-bar': colors.slate[300],
              },
              dark: {
                'bg-app-bar': "#2b2b2b",
                'bg-card': '#2a2a2a',
                'bg-default': '#202020',
                'bg-dialog': "#2b2b2b",
                'bg-hover': '#232323',
                'bg-active': '#2e70bb',
                'bg-status-bar': colors.slate[900],
              },
            },
            foreground: {
              light: {
                'text-disabled-form': "#616161",
                'text-low-light': "#868686",
                'text-low-medium': "#4C4C4C",
                'text-low-pure': "#15240F",
                'text-low-dark': "#0F1C0A",
                'text-high-light': "#F5F5F5",
                'text-high-medium': "#EDEDED",
                'text-high-pure': "#F7F7F7",
                'text-high-dark': "#E8E8E8",
                'text-primary-light': "#004899",
                'text-primary-lighter': "#004899",
                'text-primary-low': "#004899",
                'text-primary-high': '#004899',
                'text-primary-musk': "#004899",
                'text-primary-transition': "#004899",
                'text-primary-medium': "#004899",
                'text-primary-pure': "#004899",
                'text-primary-middle': "#004899",
                'text-primary-dark': "#004899",
                'text-hint': "#868686",
                'chart-label-text': "#FFFFFF",
                'chart-axis-text': "#404040",
                'chart-light-red': "#8F1414",
                'chart-dark-red': "#E23434",
                'chart-orange': "#FF8A00",
                'text-disabled': colors.slate[400],
                'input-border': '#4D4D4D',
                border: '#E8E8E8',
                divider: '#E8E8E8',
                icon: '#4C4C4C',
                'mat-icon': '#4C4C4C',
              },
              dark: {
                'text-low-light': "#F7F7F7",
                'text-low-medium': "#A3A3A3",
                'text-low-pure': "#D4D4D4",
                'text-low-dark': "#8E8E8E",
                'text-high-light': "#F5F5F5",
                'text-high-medium': "#EDEDED",
                'text-high-pure': "#F7F7F7",
                'text-high-dark': "#232323",
                'text-primary-light': "#F7F7F7",
                'text-primary-lighter': "#F7F7F7",
                'text-primary-low': "#F7F7F7",
                'text-primary-high': "#F7F7F7",
                'text-primary-musk': "#F7F7F7",
                'text-primary-medium': "#F7F7F7",
                'text-primary-transition': "#F7F7F7",
                'text-primary-pure': "#F7F7F7",
                'text-primary-middle': "#F7F7F7",
                'text-primary-dark': "#F7F7F7",
                'chart-axis-text': "#fff",
                'chart-label-text': "#2B2B2B",
                'chart-light-red': "#FF5B5B",
                'chart-dark-red': "#E23434",
                'chart-orange': "#FF8A00",
                'text-hint': '#4D4D4D',
                'text-disabled': colors.slate[600],
                'input-border': '#4D4D4D',
                border: '#404040',
                divider: '#404040',
                icon: '#A3A3A3',
                'mat-icon': '#A3A3A3',
              },
            },
          },
        },
      },
    };
  }
);

module.exports = theming;
