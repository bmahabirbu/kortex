<script lang="ts">
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, FilteredEmptyScreen, NavPage, SearchInput } from '@podman-desktop/ui-svelte';

import NoLogIcon from '/@/lib/ui/NoLogIcon.svelte';
import { handleNavigation } from '/@/navigation';
import { agentWorkspaces, type AgentWorkspaceSummaryUI } from '/@/stores/agent-workspaces.svelte';
import { NavigationPage } from '/@api/navigation-page';

import AgentWorkspaceEmptyScreen from './AgentWorkspaceEmptyScreen.svelte';
import AgentWorkspaceRow from './AgentWorkspaceRow.svelte';
import AgentWorkspaceStatCards from './AgentWorkspaceStatCards.svelte';

let searchTerm = $state('');

function navigateToCreate(): void {
  handleNavigation({ page: NavigationPage.AGENT_WORKSPACE_CREATE });
}

const filteredWorkspaces: AgentWorkspaceSummaryUI[] = $derived.by(() => {
  const term = searchTerm.toLowerCase();
  return $agentWorkspaces.filter(
    ws =>
      !term ||
      ws.name.toLowerCase().includes(term) ||
      ws.project.toLowerCase().includes(term) ||
      (ws.model?.toLowerCase().includes(term) ?? false),
  );
});

const ACTIVE_STATES: Set<string> = new Set(['running', 'starting', 'stopping']);
const activeWorkspaces = $derived(filteredWorkspaces.filter(ws => ACTIVE_STATES.has(ws.state)));
const stoppedWorkspaces = $derived(filteredWorkspaces.filter(ws => !ACTIVE_STATES.has(ws.state)));
</script>

<NavPage bind:searchTerm={searchTerm} searchEnabled={false} title="Agentic Workspaces">
  {#snippet additionalActions()}
    <Button icon={faPlus} onclick={navigateToCreate}>Create Workspace</Button>
  {/snippet}

  {#snippet content()}
    <div class="flex flex-col min-w-full h-full px-5 pt-4 pb-6 overflow-auto">
      <AgentWorkspaceStatCards workspaces={$agentWorkspaces} />

      <div
        class="mb-5 w-full"
        style="--pd-input-field-bg: var(--pd-content-card-bg); --pd-input-field-hover-bg: var(--pd-content-card-bg); --pd-input-field-focused-bg: var(--pd-content-card-bg);">
        <SearchInput bind:searchTerm={searchTerm} title="Agentic Workspaces" />
      </div>

      {#if filteredWorkspaces.length === 0}
        {#if searchTerm}
          <FilteredEmptyScreen icon={NoLogIcon} kind="sessions" bind:searchTerm={searchTerm} />
        {:else}
          <AgentWorkspaceEmptyScreen />
        {/if}
      {:else}
        <div class="bg-[var(--pd-content-card-bg)] border border-[var(--pd-content-card-border)] rounded-[14px] overflow-hidden">
          <div class="grid grid-cols-[44px_minmax(0,1fr)_200px_56px_80px] gap-x-5 px-[22px] py-3 items-end text-xs font-semibold text-[var(--pd-content-text)] opacity-50 uppercase tracking-wide bg-[var(--pd-invert-content-card-bg)] border-b border-b-[var(--pd-content-card-border)]">
            <span aria-hidden="true"></span>
            <span>Workspace</span>
            <span>Context</span>
            <span class="text-right">Time</span>
            <span aria-hidden="true"></span>
          </div>

          {#if activeWorkspaces.length > 0}
            <div class="px-[22px] pt-3.5 pb-2 text-xs font-bold text-[var(--pd-content-text)] opacity-50 uppercase tracking-widest">Active</div>
            {#each activeWorkspaces as workspace (workspace.id)}
              <AgentWorkspaceRow object={workspace} />
            {/each}
          {/if}

          {#if stoppedWorkspaces.length > 0}
            <div class="px-[22px] pt-3.5 pb-2 text-xs font-bold text-[var(--pd-content-text)] opacity-50 uppercase tracking-widest">Stopped</div>
            {#each stoppedWorkspaces as workspace (workspace.id)}
              <AgentWorkspaceRow object={workspace} />
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  {/snippet}
</NavPage>
