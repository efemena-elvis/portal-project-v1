// Interface for Table Header
export interface TableHeaderType {
  title?: string | HTMLElement;
  slug: string;
  sortable?: boolean;
  tableDataClass?: string;
  tableLogicClass?: Record<string, string>;
  tableStaticContent?: string | HTMLElement;
  tableAction?: () => void;
}

// Interface for Table Body
export interface TableBodyType {
  tableHeader: TableHeaderType[];
  tableData: Record<string, any>;
  onTableClicked?: (item: any) => void;
}

// Interface for Table Container
export interface TableContainerType {
  tableHeader: TableHeaderType[];
  tableBody: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  children?: any;
  onCheckBoxSelected?: (item: any) => void;
}
