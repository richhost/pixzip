<script lang="ts">
	import TitleBar from '$lib/components/title-bar/title-bar.svelte';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import { cn } from '$lib/utils';
	import Body from '$lib/components/body/body.svelte';
	import SpaceConfig from '$lib/components/space-config/space-config.svelte';
</script>

<div class="h-screen bg-neutral-50 rounded-md flex overflow-hidden text-neutral-900">
	<Sidebar />
	<section class="grow flex flex-col">
		<TitleBar />

		<div
			class={cn(
				'border border-neutral-200/70 border-r-transparent overflow-hidden rounded-l-3xl grow flex',
				{}
			)}
		>
			<SpaceConfig />
			<Body />
		</div>
	</section>
</div>
