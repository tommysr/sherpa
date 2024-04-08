<script lang="ts">
	import clsx from 'clsx';

	export let isRight: boolean;
	export let left: string;
	export let right: string;


</script>

<div class="flex justify-center">
	<label
		for="themeSwitcherTwo"
		class="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center"
	>
		<input
			type="checkbox"
			name="themeSwitcherTwo"
			id="themeSwitcherTwo"
			class="sr-only"
			bind:checked={isRight}
		/>
		<span class="label flex items-center text-sm font-medium text-dark">{left}</span>
		<span
			class={clsx(
				'slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200',
				isRight ? 'bg-primary-600' : 'bg-primary-200'
			)}
		>
			<span
				class={clsx(
					'dot h-6 w-6 rounded-full bg-white duration-200',
					isRight ? 'translate-x-[28px]' : ''
				)}
			></span>
		</span>
		<span class="label flex items-center text-sm font-medium text-dark">{right}</span>
	</label>
</div>
