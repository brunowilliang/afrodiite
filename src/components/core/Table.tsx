import {
	Table as HeroTable,
	TableBody as HeroTableBody,
	TableCell as HeroTableCell,
	TableColumn as HeroTableColumn,
	TableHeader as HeroTableHeader,
	type TableProps as HeroTableProps,
	TableRow as HeroTableRow,
} from '@heroui/react';
import { type Key, type ReactNode } from 'react';
import { useSlot } from 'use-styled';

// Types for declarative API
export interface TableColumn<T = any> {
	key?: keyof T;
	label: ReactNode;
	render?: (item: T) => ReactNode;
	align?: 'start' | 'center' | 'end';
	allowsSorting?: boolean;
}

export interface TableData<T = any> {
	columns: TableColumn<T>[];
	rows: T[];
	getRowKey?: (item: T, index: number) => Key;
}

interface TableComponentProps<T = any> extends HeroTableProps {
	data?: TableData<T>;
	emptyContent?: ReactNode;
	loadingContent?: ReactNode;
	isLoading?: boolean;
}

// Create the base Table component with slots
const BaseTable = useSlot(HeroTable, {
	Body: HeroTableBody,
	Cell: HeroTableCell,
	Column: HeroTableColumn,
	Header: HeroTableHeader,
	Row: HeroTableRow,
});

// Enhanced Table component with declarative API
const TableComponent = <T,>({
	data,
	children,
	emptyContent = 'Nenhum dado encontrado',
	loadingContent = 'Carregando...',
	isLoading = false,
	...props
}: TableComponentProps<T>) => {
	// If data prop is provided, render declaratively
	if (data) {
		const { columns, rows, getRowKey = (_, index) => index } = data;

		return (
			<BaseTable {...props}>
				<BaseTable.Header>
					{columns.map((column) => (
						<BaseTable.Column
							key={String(column.key)}
							align={column.align}
							allowsSorting={column.allowsSorting}
						>
							{column.label}
						</BaseTable.Column>
					))}
				</BaseTable.Header>
				<BaseTable.Body
					emptyContent={emptyContent}
					loadingContent={loadingContent}
					loadingState={isLoading ? 'loading' : 'idle'}
				>
					{rows.map((row, index) => (
						<BaseTable.Row key={getRowKey(row, index)}>
							{columns.map((column) => (
								<BaseTable.Cell key={String(column.key)}>
									{column.render
										? column.render(row)
										: String(row[column.key as keyof T] ?? '')}
								</BaseTable.Cell>
							))}
						</BaseTable.Row>
					))}
				</BaseTable.Body>
			</BaseTable>
		);
	}

	// If no data prop, render children (manual mode)
	return <BaseTable {...props}>{children}</BaseTable>;
};

// Helper function to create type-safe columns
export const createTableColumns = <T,>(
	columns: TableColumn<T>[],
): TableColumn<T>[] => {
	return columns;
};

// Attach the slot components to the main component
export const Table = Object.assign(TableComponent, {
	Body: BaseTable.Body,
	Cell: BaseTable.Cell,
	Column: BaseTable.Column,
	Header: BaseTable.Header,
	Row: BaseTable.Row,
});

// Example usage:
export const COLUMNS_EXAMPLE: TableColumn[] = [
	{
		key: 'reviewer_name',
		label: 'Nome',
	},
	{
		key: 'rating',
		label: 'Avaliação',
		align: 'center',
		render: (item: any) => `${item.rating}⭐`,
	},
	{
		key: 'status',
		label: 'Status',
		align: 'center',
		render: (item: any) => (
			<span
				className={`rounded px-2 py-1 text-xs ${
					item.status === 'pending'
						? 'bg-yellow-100 text-yellow-800'
						: item.status === 'approved'
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
				}`}
			>
				{item.status}
			</span>
		),
	},
	{
		key: 'created_at',
		label: 'Data',
		render: (item: any) =>
			new Date(item.created_at).toLocaleDateString('pt-BR'),
	},
];

/*
// Uso Declarativo (Simples):
<Table 
	data={{
		columns: COLUMNS_EXAMPLE,
		rows: reviews,
		getRowKey: (item) => item.id
	}}
	isLoading={loading}
	emptyContent="Nenhuma avaliação encontrada"
/>

// Uso Manual (Flexível):
<Table>
	<Table.Header>
		<Table.Column>Nome</Table.Column>
		<Table.Column>Status</Table.Column>
	</Table.Header>
	<Table.Body>
		{reviews.map(review => (
			<Table.Row key={review.id}>
				<Table.Cell>{review.reviewer_name}</Table.Cell>
				<Table.Cell>{review.status}</Table.Cell>
			</Table.Row>
		))}
	</Table.Body>
</Table>
*/

// exemple:
// // import {
// // 	getKeyValue,
// // 	Table,
// // 	TableBody,
// // 	TableCell,
// // 	TableColumn,
// // 	TableHeader,
// // 	TableRow,
// // } from '@heroui/react';

// import { Chip } from '@heroui/react';
// import { useQuery } from '@tanstack/react-query';
// import { createFileRoute } from '@tanstack/react-router';
// import { IReviews } from '@/api/utils/schemas/reviews';
// import { Icon } from '@/components/core/Icon';
// import { Container } from '@/components/core/Stack';
// import { Text } from '@/components/core/Text';
// import { Button } from '@/components/heroui/Button';
// import { Dropdown } from '@/components/heroui/Dropdown';
// import { createTableColumns, Table } from '@/components/heroui/Table';
// import { api } from '@/lib/api';

// export const Route = createFileRoute('/{-$locale}/(admin)/dashboard/reviews')({
// 	component: RouteComponent,
// });

// function RouteComponent() {
// 	const { data: reviews, isLoading: isReviewsLoading } = useQuery(
// 		api.queries.reviews.list.queryOptions(),
// 	);

// 	const columns = createTableColumns<IReviews.Table>([
// 		{
// 			key: 'reviewer_name',
// 			label: 'Nome',
// 		},
// 		{
// 			key: 'rating',
// 			label: 'Avaliação',
// 		},
// 		{
// 			key: 'title',
// 			label: 'Título',
// 		},
// 		{
// 			key: 'comment',
// 			label: 'Comentário',
// 		},
// 		{
// 			key: 'status',
// 			label: 'Status',
// 			render: (item) => (
// 				<Chip
// 					className="capitalize"
// 					color={
// 						statusColor[item.status as keyof typeof statusColor] || 'default'
// 					}
// 					size="sm"
// 					variant="flat"
// 				>
// 					{item.status || 'N/A'}
// 				</Chip>
// 			),
// 		},
// 		{
// 			key: 'created_at',
// 			label: 'Data',
// 		},
// 		{
// 			label: 'Actions',
// 			render: () => (
// 				<div className="relative flex items-center justify-end gap-2">
// 					<Dropdown placement="bottom-end">
// 						<Dropdown.Trigger>
// 							<Button isIconOnly size="sm" variant="light" color="default">
// 								<Icon name="VerticalDots" />
// 							</Button>
// 						</Dropdown.Trigger>
// 						<Dropdown.Menu>
// 							<Dropdown.Item key="view">View</Dropdown.Item>
// 						</Dropdown.Menu>
// 					</Dropdown>
// 				</div>
// 			),
// 		},
// 	]);

// 	const statusColor: Record<
// 		'pending' | 'approved' | 'rejected',
// 		React.ComponentProps<typeof Chip>['color']
// 	> = {
// 		pending: 'warning',
// 		approved: 'success',
// 		rejected: 'danger',
// 	};

// 	return (
// 		<Container>
// 			<Text size="2xl" weight="bold">
// 				Dashboard - Avaliações
// 			</Text>

// 			<Table
// 				aria-label="Reviews"
// 				data={{
// 					columns: columns,
// 					rows: reviews?.results || [],
// 					getRowKey: (item) => item.id || 0,
// 				}}
// 				isLoading={isReviewsLoading}
// 				emptyContent="Nenhuma avaliação encontrada"
// 			/>

// 			{/* <Table aria-label="Example table with dynamic content">
// 				<Table.Header>
// 					{columns.map((column) => (
// 						<Table.Column key={column.key}>{column.label}</Table.Column>
// 					))}
// 				</Table.Header>
// 				<Table.Body>
// 					{isReviewsLoading
// 						? Array.from({ length: 10 }).map((_, index) => (
// 								<Table.Row key={index}>
// 									{columns.map((column) => (
// 										<Table.Cell key={column.key}>
// 											<Skeleton className="h-5 w-full rounded-md" />
// 										</Table.Cell>
// 									))}
// 								</Table.Row>
// 							))
// 						: rows.map((row) => (
// 								<Table.Row key={row.id}>
// 									{(columnKey) => (
// 										<Table.Cell>{renderCell(row, columnKey)}</Table.Cell>
// 									)}
// 								</Table.Row>
// 							))}
// 				</Table.Body>
// 			</Table> */}
// 		</Container>
// 	);
// }
