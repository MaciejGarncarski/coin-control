import sharedConfig from '@shared/eslint-prettier/prettier'

/**
 * @type {import("prettier").Config}
 */
const config = {
  ...sharedConfig,
  semi: false,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
