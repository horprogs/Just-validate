import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';

export const clickByText = (text: string) => {
    userEvent.click(screen.getByText(text));
};
