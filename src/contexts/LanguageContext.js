import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    const saved = localStorage.getItem('language') || 'pt';
    setLanguage(saved);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => translations[language][key] || key;
  
  const translateCategory = (category) => {
    const map = {
      'Ação': t('action'),
      'Quebra-cabeça': t('puzzle'),
      'Estratégia': t('strategy'),
      'Esportes': t('sports'),
      'Arcade': t('arcade')
    };
    return map[category] || category;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translateCategory }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
