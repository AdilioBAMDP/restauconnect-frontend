import { useState, useEffect, useCallback } from 'react';
import { investorService, InvestmentOpportunity, Investment } from '@/services/financialServices';
import { PortfolioStats, RiskLevel } from '@/types/investor.types';

export const useInvestorData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour les données
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [portfolio, setPortfolio] = useState<Investment[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalInvested: 0,
    totalConfirmed: 0,
    count: 0
  });
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [minROIFilter, setMinROIFilter] = useState<number>(0);

  const loadData = useCallback(async () => {
    try {
      console.log('📊 useInvestorData: Début loadData()');
      setLoading(true);
      setError('');

      // Charger les opportunités
      console.log('🎯 useInvestorData: Appel API opportunités...');
      const oppResponse = await investorService.getOpportunities({
        riskLevel: riskFilter !== 'all' ? riskFilter : undefined,
        minROI: minROIFilter > 0 ? minROIFilter : undefined,
        sector: sectorFilter !== 'all' ? sectorFilter : undefined
      });
      console.log('📈 useInvestorData: Réponse opportunités:', oppResponse);

      if (oppResponse.success) {
        console.log('✅ useInvestorData: Opportunités chargées:', oppResponse.opportunities.length);
        setOpportunities(oppResponse.opportunities);
      } else {
        console.error('❌ useInvestorData: Erreur opportunités:', oppResponse);
      }

      // Charger le portfolio
      console.log('💼 useInvestorData: Appel API portfolio...');
      const portfolioResponse = await investorService.getPortfolio();
      console.log('📊 useInvestorData: Réponse portfolio:', portfolioResponse);
      
      if (portfolioResponse.success) {
        console.log('✅ useInvestorData: Portfolio chargé:', portfolioResponse.investments.length, 'investissements');
        setPortfolio(portfolioResponse.investments);
        setPortfolioStats({
          totalInvested: portfolioResponse.totalInvested,
          totalConfirmed: portfolioResponse.totalConfirmed,
          count: portfolioResponse.investments.length
        });
      } else {
        console.error('❌ useInvestorData: Erreur portfolio:', portfolioResponse);
      }

    } catch (err: unknown) {
      console.error('💥 useInvestorData: Erreur loadData:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setError(errorMessage);
    } finally {
      console.log('🏁 useInvestorData: Fin loadData()');
      setLoading(false);
    }
  }, [riskFilter, minROIFilter, sectorFilter]);

  // Filtrer les opportunités
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = (opp.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (opp.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || opp.riskLevel === riskFilter;
    const matchesSector = sectorFilter === 'all' || (opp.sector || '').toLowerCase().includes(sectorFilter.toLowerCase());
    const matchesROI = minROIFilter === 0 || (opp.expectedROI || 0) >= minROIFilter;

    return matchesSearch && matchesRisk && matchesSector && matchesROI;
  });

  // Investir dans une opportunité
  const handleInvest = async (opportunityId: string, amount: number, shares: number) => {
    try {
      setLoading(true);
      const response = await investorService.invest({
        opportunityId,
        amount,
        shares
      });

      if (response.success) {
        // Recharger les données
        await loadData();
        return { success: true };
      }
      return { success: false, error: 'Erreur lors de l\'investissement' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'investissement';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔍 useInvestorData: Démarrage du chargement des données...');
    loadData();
  }, [loadData]);

  return {
    // États
    loading,
    error,
    opportunities,
    portfolio,
    portfolioStats,
    filteredOpportunities,
    
    // Filtres
    searchTerm,
    setSearchTerm,
    riskFilter,
    setRiskFilter,
    sectorFilter,
    setSectorFilter,
    minROIFilter,
    setMinROIFilter,
    
    // Actions
    loadData,
    handleInvest,
    setError
  };
};