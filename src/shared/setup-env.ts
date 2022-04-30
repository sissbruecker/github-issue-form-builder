// @ts-nocheck
/** Define process.env.NODE_ENV for MobX, gets replaced with 'production' in rollup build */
window.process = { env: {} };
process.env.NODE_ENV = 'development';
