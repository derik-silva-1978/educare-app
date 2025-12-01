
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { HelpCenter } from './index';

export const helpRoutes: RouteObject[] = [
  {
    path: 'help',
    element: <HelpCenter />,
  }
];
