import './types';
import AbstractAnalytic, {
  InitConfig as AbstractAnalyticInitConfig,
} from './AbstractAnalytic';
import { Events } from './Events';

const defaultDependencies = AbstractAnalytic.$dependencies;

export {
  Events,
  AbstractAnalytic,
  AbstractAnalyticInitConfig,
  defaultDependencies,
};
