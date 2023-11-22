import type { Locale } from '../../theme/PropsType';

export default interface PropsType {
  type?: 'number' | 'price' | 'idcard';
  onKeyClick?: (key?: string) => void;
  locale?: Locale;
}
