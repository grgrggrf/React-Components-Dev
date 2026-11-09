import type { ReactNode } from 'react';

function Test({ children }: { children?: ReactNode }) {
  return <div>{children}</div>;
}
export default Test;
