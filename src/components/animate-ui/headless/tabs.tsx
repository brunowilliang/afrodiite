'use client';

import {
	TabGroup as TabGroupPrimitive,
	type TabGroupProps as TabGroupPrimitiveProps,
	TabList as TabListPrimitive,
	type TabListProps as TabListPrimitiveProps,
	TabPanel as TabPanelPrimitive,
	type TabPanelProps as TabPanelPrimitiveProps,
	TabPanels as TabPanelsPrimitive,
	type TabPanelsProps as TabPanelsPrimitiveProps,
	Tab as TabPrimitive,
	type TabProps as TabPrimitiveProps,
} from '@headlessui/react';
import { motion, type Transition } from 'motion/react';
import * as React from 'react';
import {
	MotionHighlight,
	MotionHighlightItem,
} from '@/components/animate-ui/effects/motion-highlight';
import { cn } from '@/lib/utils';

type TabGroupProps<TTag extends React.ElementType = 'div'> =
	TabGroupPrimitiveProps<TTag> & {
		className?: string;
		as?: TTag;
	};

function TabGroup<TTag extends React.ElementType = 'div'>({
	className,
	...props
}: TabGroupProps<TTag>) {
	return (
		<TabGroupPrimitive
			data-slot="tab-group"
			className={cn('flex flex-col gap-2', className)}
			{...props}
		/>
	);
}

type TabListProps<TTag extends React.ElementType = 'div'> =
	TabListPrimitiveProps<TTag> & {
		as?: TTag;
		className?: string;
		activeClassName?: string;
		transition?: Transition;
	};

function TabList<TTag extends React.ElementType = 'div'>({
	children,
	className,
	activeClassName,
	transition = {
		type: 'spring',
		stiffness: 200,
		damping: 25,
	},
	...props
}: TabListProps<TTag>) {
	return (
		<TabListPrimitive
			data-slot="tab-list"
			className={cn(
				'inline-flex h-13 w-fit items-center justify-center rounded-lg bg-muted p-[4px] text-muted-foreground',
				className,
			)}
			{...props}
		>
			{(bag) => (
				<MotionHighlight
					controlledItems
					className={cn('rounded-sm bg-background shadow-sm', activeClassName)}
					value={bag.selectedIndex.toString()}
					transition={transition}
				>
					{typeof children === 'function' ? children(bag) : children}
				</MotionHighlight>
			)}
		</TabListPrimitive>
	);
}

type TabProps<TTag extends React.ElementType = 'button'> = Omit<
	TabPrimitiveProps<TTag>,
	'children'
> &
	Required<Pick<TabPrimitiveProps<TTag>, 'children'>> & {
		index: number;
		className?: string;
		as?: TTag;
	};

function Tab<TTag extends React.ElementType = 'button'>(props: TabProps<TTag>) {
	const { children, className, index, as = 'button', ...rest } = props;

	return (
		<MotionHighlightItem value={index.toString()} className="size-full">
			<TabPrimitive
				data-slot="tabs-trigger"
				className={cn(
					'z-[1] inline-flex size-full cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-2 py-1 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-selected:text-foreground',
					className,
				)}
				as={as as React.ElementType}
				{...rest}
			>
				{children}
			</TabPrimitive>
		</MotionHighlightItem>
	);
}

type TabPanelProps<TTag extends React.ElementType = typeof motion.div> = Omit<
	TabPanelPrimitiveProps<TTag>,
	'transition'
> & {
	children: React.ReactNode;
	className?: string;
	as?: TTag;
	transition?: Transition;
};

function TabPanel<TTag extends React.ElementType = typeof motion.div>(
	props: TabPanelProps<TTag>,
) {
	const {
		className,
		as = motion.div,
		transition = {
			duration: 0.5,
			ease: 'easeInOut',
		},
		...rest
	} = props;

	return (
		<TabPanelPrimitive
			data-slot="tabs-content"
			className={cn('flex-1 outline-none', className)}
			layout
			initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
			animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
			exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
			transition={transition}
			as={as as React.ElementType}
			{...rest}
		/>
	);
}

type TabPanelsProps<TTag extends React.ElementType = typeof motion.div> = Omit<
	TabPanelsPrimitiveProps<TTag>,
	'transition'
> & {
	className?: string;
	as?: TTag;
	transition?: Transition;
};

function TabPanels<TTag extends React.ElementType = typeof motion.div>(
	props: TabPanelsProps<TTag>,
) {
	const {
		children,
		className,
		as = motion.div,
		transition = { type: 'spring', stiffness: 200, damping: 25 },
		...rest
	} = props;
	const containerRef = React.useRef<HTMLDivElement | null>(null);

	const [height, setHeight] = React.useState(0);

	React.useEffect(() => {
		if (!containerRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			const newHeight = entries[0]?.contentRect.height ?? 0;
			requestAnimationFrame(() => {
				setHeight(newHeight);
			});
		});

		resizeObserver.observe(containerRef.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, [children]);

	React.useLayoutEffect(() => {
		if (containerRef.current) {
			const initialHeight = containerRef.current.getBoundingClientRect().height;
			setHeight(initialHeight);
		}
	}, [children]);

	return (
		<TabPanelsPrimitive
			data-slot="tabs-contents"
			layout
			animate={{ height: height }}
			transition={transition}
			as={as as React.ElementType}
			className={className}
			{...rest}
		>
			<div ref={containerRef}>{children}</div>
		</TabPanelsPrimitive>
	);
}

export {
	TabGroup,
	TabList,
	Tab,
	TabPanel,
	TabPanels,
	type TabGroupProps,
	type TabListProps,
	type TabProps,
	type TabPanelProps,
	type TabPanelsProps,
};
