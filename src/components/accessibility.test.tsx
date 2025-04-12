tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressAnnouncer } from './accessibility';
import { AnnouncerProvider } from './accessibility';

describe('ProgressAnnouncer', () => {
  it('renders correctly', () => {
    render(
      <AnnouncerProvider>
        <ProgressAnnouncer value={0} max={100} label="Test Progress" />
      </AnnouncerProvider>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('announces the correct progress when the value changes', async () => {
    const { rerender } = render(
      <AnnouncerProvider>
        <ProgressAnnouncer value={0} max={100} label="Test Progress" announceEvery={25}/>
      </AnnouncerProvider>
    );

    rerender(
      <AnnouncerProvider>
        <ProgressAnnouncer value={50} max={100} label="Test Progress" announceEvery={25} />
      </AnnouncerProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Progress: 50% complete')).toBeInTheDocument();
    });
  });

  it('does not announce when the progress is below the threshold', async () => {
    render(
      <AnnouncerProvider>
        <ProgressAnnouncer value={10} max={100} label="Test Progress" announceEvery={25} />
      </AnnouncerProvider>
    );
    
    const politeAnnouncement = screen.queryByText(/Test Progress/);
    expect(politeAnnouncement).not.toBeInTheDocument();
  });
});