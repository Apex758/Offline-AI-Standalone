import { useTranslation } from 'react-i18next';

const AIDisclaimer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-shrink-0 px-4 pb-2 pt-1.5" style={{ borderTop: '1px solid transparent' }}>
      <p className="text-[11px] text-theme-muted opacity-40 text-center select-none">
        {t('common.aiDisclaimer')}
      </p>
    </div>
  );
};

export default AIDisclaimer;
