#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import MtAwsCdkBootstrapStack from '../lib/mt-aws-cdk-bootstrap-stack';

// importing configuration based on environment
import environmentConfig from './stack-config';

const app = new cdk.App();

// injecting configurations into stack based on environment.
new MtAwsCdkBootstrapStack(app, 'mt-aws-cdk-bootstrap', environmentConfig);
