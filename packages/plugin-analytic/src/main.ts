import './types';
import type { InitConfig as AbstractAnalyticInitConfig } from './AbstractAnalytic';
import AbstractAnalytic from './AbstractAnalytic';
import { Events } from './Events';

const defaultDependencies = AbstractAnalytic.$dependencies;

export type { AbstractAnalyticInitConfig };
export { Events, AbstractAnalytic, defaultDependencies };
