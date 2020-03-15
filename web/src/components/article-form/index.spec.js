import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { action } from '@storybook/addon-actions';
import { renders } from './index.stories';
import { MockedProvider } from '@apollo/react-testing';

jest.mock('@storybook/addon-actions');

describe('ArticleForm', () => {
  it('displays errors on submit', async () => {
    render(<MockedProvider>{renders()}</MockedProvider>);

    const submitButton = await screen.findByText('Publish Article');
    fireEvent.click(submitButton);
    const errors = await screen.findAllByText(/is a required field$/);
    expect(errors).toHaveLength(3);
  });

  it('calls onSubmit when valid on submit', async () => {
    render(<MockedProvider>{renders()}</MockedProvider>);

    const title = await screen.findByLabelText(/title/i);
    const description = await screen.findByLabelText(/description/i);
    const body = await screen.findByLabelText(/body/i);
    const submitButton = await screen.findByText('Publish Article');

    fireEvent.change(title, {
      target: { value: 'How to build webapps that scale' }
    });

    fireEvent.change(description, {
      target: {
        value:
          'Web development technologies have evolved at an incredible clip over the past few years.'
      }
    });

    fireEvent.change(body, {
      target: {
        value:
          "## Introducing RealWorld.\nIt's a great solution for learning how other frameworks work."
      }
    });

    await waitFor(async () => {
      fireEvent.click(submitButton);
    });

    expect(action('onSubmit')).toHaveBeenCalled();
  });
});