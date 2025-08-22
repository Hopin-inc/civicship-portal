module.exports = {
  ci: {
    collect: {
      url: ['https://localhost:8000/opportunities'],
      startServerCommand: 'pnpm dev:https',
      startServerReadyPattern: 'ready',
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        onlyCategories: ['performance'],
        skipAudits: ['uses-https'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
