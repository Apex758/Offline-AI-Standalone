import React, { createContext, useContext } from 'react';

const TabIdContext = createContext<string | null>(null);

export const TabIdProvider: React.FC<{ tabId: string; children: React.ReactNode }> = ({ tabId, children }) => (
  <TabIdContext.Provider value={tabId}>{children}</TabIdContext.Provider>
);

export const useTabId = (): string | null => useContext(TabIdContext);
