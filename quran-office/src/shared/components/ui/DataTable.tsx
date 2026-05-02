import React from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  type TableProps, 
  useTheme, 
  alpha,
  Typography,
  Stack
} from '@mui/material';
import { EmptyState } from './EmptyState';

export interface Column<T = any> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  width?: string | number;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T = any> extends Omit<TableProps, 'children'> {
  columns: Column<T>[];
  data: T[];
  header?: React.ReactNode;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  rowKey?: keyof T | ((row: T) => string);
}

export const DataTable = <T extends Record<string, any>>({ 
  columns, 
  data, 
  header, 
  loading, 
  sx, 
  emptyTitle = 'لا توجد بيانات',
  emptyDescription = 'لم يتم العثور على أي سجلات لعرضها.',
  emptyIcon,
  rowKey,
  ...props 
}: DataTableProps<T>) => {
  const theme = useTheme();

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(row);
    if (rowKey && row[rowKey]) return String(row[rowKey]);
    return row.id || row.student_id || row.subscription_id || row.payment_id || String(index);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        ...sx
      }}
    >
      {header && (
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          {header}
        </Box>
      )}
      
      <TableContainer sx={{ position: 'relative', minHeight: data.length === 0 ? 300 : 'auto' }}>
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              zIndex: 10, 
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={600}>جارِ التحميل...</Typography>
          </Box>
        )}

        <Table {...props} stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ 
                    minWidth: column.width,
                    fontWeight: 800,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.secondary,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    padding: '16px 20px'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                hover 
                key={getRowKey(row, index)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell 
                      key={column.id} 
                      align={column.align}
                      sx={{ padding: '16px 20px' }}
                    >
                      {column.render ? column.render(value, row) : (value || '---')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!loading && data.length === 0 && (
          <EmptyState 
            title={emptyTitle}
            description={emptyDescription}
            icon={emptyIcon}
          />
        )}
      </TableContainer>
    </Paper>
  );
};
