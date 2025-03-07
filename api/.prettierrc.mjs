import sharedConfig from '@shared/eslint-prettier/prettier'

/**
 * @type {import("prettier").Config}
 */
const config = {
  ...sharedConfig,
  semi: false,
}

export default config
