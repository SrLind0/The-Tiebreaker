export interface PresetDecision {
  title: string;
  category: 'Career' | 'Life' | 'Finance' | 'Tech';
  icon: string;
  dilemma: string;
  options: string[];
  context: string;
  priorities: string[];
  riskTolerance: string;
}

export const PRESET_DECISIONS: PresetDecision[] = [
  {
    title: 'Career Crossroads',
    category: 'Career',
    icon: 'Briefcase',
    dilemma: 'Should I join a Series-A AI startup as Lead Engineer or take a Senior Staff role at a Fortune 500 company?',
    options: [
      'Join Series-A AI Startup (Lead Engineer)',
      'Accept Fortune 500 Senior Staff Role',
      'Stay at current company and negotiate promotion'
    ],
    context: 'I have 7 years of engineering experience and a 2-year-old child. I want career acceleration and financial upside, but cannot sustain 70-hour weeks permanently.',
    priorities: ['Financial Upside', 'Work-Life Balance', 'Learning Velocity', 'Job Security'],
    riskTolerance: 'Moderate / Calculated',
  },
  {
    title: 'Housing Dilemma',
    category: 'Finance',
    icon: 'Home',
    dilemma: 'Should I buy a 3-bedroom house in the suburbs with a 30-year mortgage, or keep renting in the city center and invest savings into index funds?',
    options: [
      'Buy 3BR Suburban Home',
      'Rent in City Center & Invest Savings',
      'Rent in Suburbs for 1 year trial first'
    ],
    context: 'We have $120k saved for a down payment. Current mortgage rates are around 6.5%. Commute to office is 2 days a week.',
    priorities: ['Long-term Net Worth', 'Quality of Life', 'Commute Convenience', 'Flexibility'],
    riskTolerance: 'Balanced',
  },
  {
    title: 'Vehicle Purchase',
    category: 'Life',
    icon: 'Car',
    dilemma: 'Should I purchase a new Electric Vehicle (Tesla Model Y / Ioniq 5), buy a reliable used Hybrid, or keep maintaining my 2014 gas car?',
    options: [
      'Buy New All-Electric Vehicle',
      'Buy 3-year-old Used Hybrid',
      'Keep maintaining 2014 Gas Car'
    ],
    context: 'Daily commute is 28 miles roundtrip. Home has standard garage where Level 2 charging can be installed. Gas prices fluctuate.',
    priorities: ['Total Cost of Ownership', 'Reliability', 'Environmental Impact', 'Tech Features'],
    riskTolerance: 'Conservative',
  },
  {
    title: 'Startup Architecture',
    category: 'Tech',
    icon: 'Cpu',
    dilemma: 'Should we build our new SaaS on a serverless microservices stack or launch with a monolithic framework (Next.js/Node)?',
    options: [
      'Modern Serverless & Microservices',
      'Fast Modular Monolith',
      'PaaS with Managed Postgres'
    ],
    context: 'We have a 3-person dev team needing to hit market in 6 weeks with limited initial user concurrency but rapid feature iterations.',
    priorities: ['Speed to Market', 'Developer Velocity', 'Operational Simplicity', 'Future Scalability'],
    riskTolerance: 'Pragmatic / Fast',
  },
];
