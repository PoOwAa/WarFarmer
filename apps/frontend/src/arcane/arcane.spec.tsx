import { render } from '@testing-library/react';

import Arcane from './arcane';

describe('Arcane', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Arcane />);
    expect(baseElement).toBeTruthy();
  });
});
