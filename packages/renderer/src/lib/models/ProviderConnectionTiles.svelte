<script lang="ts">
import { router } from 'tinro';

import type { InferenceConnectionSummary } from '/@/lib/models/models-utils';

interface Props {
  connections: InferenceConnectionSummary[];
}

let { connections }: Props = $props();

interface ProviderDisplay {
  title: string;
  subtitle?: string;
}

const providerDisplayOverrides: Record<string, ProviderDisplay> = {
  gemini: { title: 'Google AI', subtitle: 'Gemini (AI Studio / Vertex)' },
  claude: { title: 'Anthropic', subtitle: 'Claude 3.5 / 4' },
  openai: { title: 'OpenAI', subtitle: 'GPT-4o, GPT-4o-mini, o-series' },
  openshiftai: { title: 'OpenShift AI', subtitle: 'Red Hat Cloud' },
};

function getDisplay(connection: InferenceConnectionSummary): ProviderDisplay {
  return providerDisplayOverrides[connection.providerId] ?? { title: connection.providerName };
}

function configure(connection: InferenceConnectionSummary): void {
  router.goto(`/preferences/provider/${connection.providerInternalId}`);
}

interface BadgeInfo {
  label: string;
  style: string;
}

function effectiveStatus(connection: InferenceConnectionSummary): string {
  if (connection.status === 'unknown' && connection.modelCount > 0) return 'started';
  return connection.status;
}

function getStatusBadge(status: string): BadgeInfo {
  switch (status) {
    case 'started':
      return {
        label: 'Connected',
        style: 'text-[var(--pd-status-running)] bg-[color-mix(in_srgb,var(--pd-status-running)_12%,transparent)]',
      };
    case 'stopped':
      return {
        label: 'Disconnected',
        style: 'text-[var(--pd-status-stopped)] bg-[color-mix(in_srgb,var(--pd-status-stopped)_12%,transparent)]',
      };
    case 'not-configured':
      return { label: 'Not configured', style: 'bg-[var(--pd-label-bg)] text-[var(--pd-label-text)]' };
    case 'failed':
      return {
        label: 'Error',
        style: 'text-[var(--pd-status-terminated)] bg-[color-mix(in_srgb,var(--pd-status-terminated)_12%,transparent)]',
      };
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        style: 'bg-[var(--pd-label-bg)] text-[var(--pd-label-text)]',
      };
  }
}

function getSecondBadge(status: string): BadgeInfo | undefined {
  switch (status) {
    case 'started':
      return { label: 'Verified', style: 'bg-[var(--pd-label-bg)] text-[var(--pd-label-text)]' };
    case 'failed':
      return { label: 'Check failed', style: 'bg-[var(--pd-label-bg)] text-[var(--pd-label-text)]' };
    default:
      return undefined;
  }
}
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-3">
  {#each connections as connection (connection.providerId + ':' + connection.connectionName)}
    {@const display = getDisplay(connection)}
    {@const status = effectiveStatus(connection)}
    {@const primaryBadge = getStatusBadge(status)}
    {@const secondaryBadge = getSecondBadge(status)}
    <div
      class="flex flex-col gap-2 p-4 rounded-lg border border-[var(--pd-content-card-border)] bg-[var(--pd-content-card-bg)]">
      <span class="text-sm font-semibold text-[var(--pd-content-card-header-text)]">
        {display.title}
      </span>
      <span class="text-xs text-[var(--pd-content-card-text)] min-h-[1.25rem]">
        {display.subtitle ?? '\u00A0'}
      </span>
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {primaryBadge.style}">
          {primaryBadge.label}
        </span>
        {#if secondaryBadge}
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {secondaryBadge.style}">
            {secondaryBadge.label}
          </span>
        {/if}
      </div>
      <button
        class="text-xs font-medium text-[var(--pd-link)] hover:text-[var(--pd-link-hover)] mt-auto self-start"
        onclick={(): void => configure(connection)}>
        Configure
      </button>
    </div>
  {/each}
</div>
