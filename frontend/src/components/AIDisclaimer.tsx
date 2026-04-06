import { useTranslation } from 'react-i18next';

interface AIDisclaimerProps {
  inline?: boolean;
}

const AIDisclaimer: React.FC<AIDisclaimerProps> = ({ inline }) => {
  const { t } = useTranslation();

  if (inline) {
    return (
      <p className="text-[11px] italic text-theme-muted opacity-40 select-none">
        {t('common.aiDisclaimer')}
      </p>
    );
  }

  return (
    <div className="flex-shrink-0 px-4 pb-2 pt-1.5 bg-theme-secondary" style={{ borderTop: '1px solid transparent' }}>
      <p className="text-[11px] italic text-theme-muted opacity-40 text-center select-none">
        {t('common.aiDisclaimer')}
      </p>
    </div>
  );
};

export default AIDisclaimer;
