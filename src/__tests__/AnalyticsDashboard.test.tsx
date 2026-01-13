import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard';

describe('AnalyticsDashboard', () => {
  it('should render loading state initially', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText(/chargement analytics/i)).toBeInTheDocument();
  });

  it('should render dashboard title', async () => {
    render(<AnalyticsDashboard />);
    // Wait for loading to finish (test will timeout if it never finishes)
    const title = await screen.findByText(/analytics en temps réel/i);
    expect(title).toBeInTheDocument();
  });

  it('should have KPI cards section', async () => {
    render(<AnalyticsDashboard />);
    // Check for revenue card
    const revenueCard = await screen.findByText(/revenus aujourd'hui/i);
    expect(revenueCard).toBeInTheDocument();
  });
});
