import {
  debug as debug_dev,
  debugIf as debugIf_dev,
  error as error_dev,
  errorIf as errorIf_dev,
  info as info_dev,
  infoIf as infoIf_dev,
  log as log_dev,
  logIf as logIf_dev,
  rejectIf as rejectIf_dev,
  throwIf as throwIf_dev,
  warn as warn_dev,
  warnIf as warnIf_dev,
  beSilent as beSilent_dev,
  configureLogger as configureLogger_dev,
  isSilent as isSilent_dev,
} from './dist/development/esm/main.js';
import {
  debug as debug_prod,
  debugIf as debugIf_prod,
  error as error_prod,
  errorIf as errorIf_prod,
  info as info_prod,
  infoIf as infoIf_prod,
  log as log_prod,
  logIf as logIf_prod,
  rejectIf as rejectIf_prod,
  throwIf as throwIf_prod,
  warn as warn_prod,
  warnIf as warnIf_prod,
  beSilent as beSilent_prod,
  configureLogger as configureLogger_prod,
  isSilent as isSilent_prod,
} from './dist/production/esm/main.js';

export const debug =
  process.env.NODE_ENV === 'production' ? debug_prod : debug_dev;
export const debugIf =
  process.env.NODE_ENV === 'production' ? debugIf_prod : debugIf_dev;
export const error =
  process.env.NODE_ENV === 'production' ? error_prod : error_dev;
export const errorIf =
  process.env.NODE_ENV === 'production' ? errorIf_prod : errorIf_dev;
export const info =
  process.env.NODE_ENV === 'production' ? info_prod : info_dev;
export const infoIf =
  process.env.NODE_ENV === 'production' ? infoIf_prod : infoIf_dev;
export const log = process.env.NODE_ENV === 'production' ? log_prod : log_dev;
export const logIf =
  process.env.NODE_ENV === 'production' ? logIf_prod : logIf_dev;
export const rejectIf =
  process.env.NODE_ENV === 'production' ? rejectIf_prod : rejectIf_dev;
export const throwIf =
  process.env.NODE_ENV === 'production' ? throwIf_prod : throwIf_dev;
export const warn =
  process.env.NODE_ENV === 'production' ? warn_prod : warn_dev;
export const warnIf =
  process.env.NODE_ENV === 'production' ? warnIf_prod : warnIf_dev;
export const beSilent =
  process.env.NODE_ENV === 'production' ? beSilent_prod : beSilent_dev;
export const configureLogger =
  process.env.NODE_ENV === 'production'
    ? configureLogger_prod
    : configureLogger_dev;
export const isSilent =
  process.env.NODE_ENV === 'production' ? isSilent_prod : isSilent_dev;
