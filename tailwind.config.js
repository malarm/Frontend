const { join } = require('path');
const { workspaceRoot } = require('nx/src/devkit-exports');

const config = require(join(workspaceRoot, 'tailwind.config.base.js'));

module.exports = {
  ...config,
  content: [
    ...config.content,
    join(workspaceRoot, 'apps/thor-frontend') + '/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...(config.theme ?? {}),
    extend: {
      transitionProperty: {
        width: 'width',
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        brick: '#9C826E',
        green: {
          DEFAULT: '#28D769',
          muted: '#d7edeb',
          lightest: '#84c0bc',
          light: '#6bb3ae',
          normal: '#52a7a1',
          dark: '#399a93',
          darkest: '#218e86',
        },
        mint: '#B6FFC7',
        mortar: '#EEECD5',
        pine: '#005032',
        purple: '#AF99FF',
        slate: '#E5E5E5',
      },
    },
  },
};