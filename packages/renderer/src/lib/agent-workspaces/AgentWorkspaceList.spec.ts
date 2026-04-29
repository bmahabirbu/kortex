/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { agentWorkspaces } from '/@/stores/agent-workspaces.svelte';
import type { AgentWorkspaceSummary } from '/@api/agent-workspace-info';

import AgentWorkspaceList from './AgentWorkspaceList.svelte';

beforeEach(() => {
  vi.resetAllMocks();
  agentWorkspaces.set([]);
});

test('Expect empty screen when no workspaces', () => {
  render(AgentWorkspaceList);

  expect(screen.getByText('No agent workspaces')).toBeInTheDocument();
});

test('Expect stat cards show zero counts when empty', () => {
  render(AgentWorkspaceList);

  expect(screen.getByText('Active Sessions')).toBeInTheDocument();
  expect(screen.getByText('Total Sessions')).toBeInTheDocument();
  expect(screen.getByText('Configured Agents')).toBeInTheDocument();
  expect(screen.getAllByText('0')).toHaveLength(3);
});

test('Expect stat cards show correct counts with workspaces', () => {
  const workspaces: AgentWorkspaceSummary[] = [
    {
      id: 'ws-1',
      name: 'api-refactor',
      project: 'backend',
      agent: 'coder-v1',
      state: 'stopped',
      paths: {
        source: '/home/user/projects/backend',
        configuration: '/home/user/.config/kaiden/workspaces/api-refactor.yaml',
      },
      timestamps: { created: 1700000000 },
    },
    {
      id: 'ws-2',
      name: 'frontend-redesign',
      project: 'frontend',
      agent: 'coder-v2',
      state: 'running',
      paths: {
        source: '/home/user/projects/frontend',
        configuration: '/home/user/.config/kaiden/workspaces/frontend-redesign.yaml',
      },
      timestamps: { created: 1700000001, started: 1700000002 },
    },
  ];
  agentWorkspaces.set(workspaces);

  render(AgentWorkspaceList);

  expect(screen.getByText('api-refactor')).toBeInTheDocument();
  expect(screen.getByText('frontend-redesign')).toBeInTheDocument();
  // Active: 1, Total: 2, Configured Agents: 2
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getAllByText('2')).toHaveLength(2);
});

test('Expect page title to be Agentic Workspaces', () => {
  render(AgentWorkspaceList);

  expect(screen.getByText('Agentic Workspaces')).toBeInTheDocument();
});
