/**
 * This represents our global config.  Config should be
 * read from environment variables and with reasonable
 * default set when safe.
 */
//TODO: write something decent in this file to build the config object from env vars and error for things without defaults
export const CONFIG = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  DEFAULT_LIMIT: 25,
};

/**
 * Check to make sure all of our config propertes have a value.
 *
 * If there is no environment variable present and no
 * default value is provided, this will cause our program
 * to crash on startup with an infomative error message.
 */
const undefinedConfigProperties = Object.keys(CONFIG).filter(
  property => !CONFIG[property]
);

if (undefinedConfigProperties.length > 0) {
  console.log(
    `ERROR: the following environment variables must be set: ${undefinedConfigProperties}`
  );
  process.exit(1);
}
