/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ComponentType } from 'react';
import { Routes, Route, useOutlet } from 'react-router';
import { TemplateEntityV1beta2 } from '@backstage/catalog-model';
import { ScaffolderPage } from './ScaffolderPage';
import { TemplatePage } from './TemplatePage';
import { TaskPage } from './TaskPage';
import { ActionsPage } from './ActionsPage';

import {
  FieldExtensionOptions,
  FIELD_EXTENSION_WRAPPER_KEY,
  FIELD_EXTENSION_KEY,
  DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS,
} from '../extensions';
import { useElementFilter } from '@backstage/core-plugin-api';
import { PermissionedRoute } from '@backstage/plugin-permission';
import { ScaffolderPermission } from '../permissions';

type RouterProps = {
  TemplateCardComponent?:
    | ComponentType<{ template: TemplateEntityV1beta2 }>
    | undefined;
};

export const Router = ({ TemplateCardComponent }: RouterProps) => {
  const outlet = useOutlet();

  const customFieldExtensions = useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: FIELD_EXTENSION_WRAPPER_KEY,
      })
      .findComponentData<FieldExtensionOptions>({
        key: FIELD_EXTENSION_KEY,
      }),
  );

  const fieldExtensions = [
    ...customFieldExtensions,
    ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(
      ({ name }) =>
        !customFieldExtensions.some(
          customFieldExtension => customFieldExtension.name === name,
        ),
    ),
  ];

  return (
    <Routes>
      <PermissionedRoute
        path="/"
        permission={ScaffolderPermission.ROUTES}
        element={
          <ScaffolderPage TemplateCardComponent={TemplateCardComponent} />
        }
      />
      <Route
        path="/templates/:templateName"
        element={<TemplatePage customFieldExtensions={fieldExtensions} />}
      />
      <Route path="/tasks/:taskId" element={<TaskPage />} />
      <Route path="/actions" element={<ActionsPage />} />
    </Routes>
  );
};
