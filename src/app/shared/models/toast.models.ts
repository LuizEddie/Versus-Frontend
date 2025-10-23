export interface Toast {
  message: string | null | undefined;
  type: 'success' | 'error' | 'info' | 'warning' | 'loading';
  id: number;
  persistent?: boolean;
  closeable?: boolean;
  duration?: number;
}