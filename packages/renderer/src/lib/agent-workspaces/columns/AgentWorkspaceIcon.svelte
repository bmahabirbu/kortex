<script lang="ts">
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCode, faO, faRobot, faWrench } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

import type { AgentWorkspaceSummaryUI } from '/@/stores/agent-workspaces.svelte';

interface Props {
  object: AgentWorkspaceSummaryUI;
}

let { object }: Props = $props();

const agentIcons: Record<string, IconDefinition> = {
  opencode: faO,
  claude: faRobot,
  cursor: faCode,
  goose: faWrench,
};

const agentStyles: Record<string, string> = {
  claude: 'bg-gradient-to-br from-amber-600 to-amber-500',
  opencode: 'bg-gradient-to-br from-green-500 to-green-600',
  codex: 'bg-gradient-to-br from-green-500 to-green-600',
  cursor: 'bg-gradient-to-br from-sky-500 to-sky-600',
  goose: 'bg-gradient-to-br from-red-600 to-red-700',
};

const icon = $derived(agentIcons[object.agent] ?? faRobot);
const colorClass = $derived(agentStyles[object.agent] ?? 'bg-gradient-to-br from-purple-500 to-purple-600');
</script>

<div class="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 {colorClass}" title={object.agent}>
  <Fa {icon} size="1x" color="#fff" />
</div>
