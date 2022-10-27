import * as React from 'react';
import { PageType } from '../interfaces/Enums';
import { PageSwitcherContextType } from '../interfaces/ContextTypes';

export const PageSwitcherContext = React.createContext<PageSwitcherContextType>({
  currentPage: PageType.Picker,
  goToPage: () => void 0
});

function PageSwitcherContextProvider(props: { children: any }) {
  const { children } = props;
  const [currentPage, goToPage] = React.useState<PageType>(PageType.Picker);

  const pageSwitcherContext: PageSwitcherContextType = {
    currentPage: currentPage,
    goToPage: goToPage
  };
  return (
    <PageSwitcherContext.Provider value={pageSwitcherContext}>
      {children}
    </PageSwitcherContext.Provider>
  );
}

export default PageSwitcherContextProvider;
