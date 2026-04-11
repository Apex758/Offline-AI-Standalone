import { useEffect } from 'react';
import { useLicense } from '../contexts/LicenseContext';
import { useSettings } from '../contexts/SettingsContext';

/**
 * LicenseSettingsBridge
 *
 * Bridges LicenseContext -> SettingsContext so that when the OAK license is
 * validated/activated/deactivated, the teacher's profile school + territory
 * get written into settings (locked, non-editable in Settings > Profile).
 *
 * Must be rendered inside BOTH providers. In App.tsx it sits inside
 * SettingsProvider, which is itself inside LicenseProvider.
 */
export function LicenseSettingsBridge() {
  const { isLicensed, schoolName, territoryName } = useLicense();
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    if (isLicensed && schoolName) {
      // Only write if something actually changed, to avoid re-render loops.
      const currentSchool = settings.profile.school;
      const currentTerritory = settings.profile.territory || '';
      const currentSource = settings.profile.schoolSource;
      if (
        currentSchool !== schoolName ||
        currentTerritory !== (territoryName || '') ||
        currentSource !== 'oak'
      ) {
        updateSettings({
          profile: {
            ...settings.profile,
            school: schoolName,
            territory: territoryName || '',
            schoolSource: 'oak',
          },
        });
      }
    } else if (!isLicensed && settings.profile.schoolSource === 'oak') {
      // License was revoked -- clear the OAK-sourced fields.
      updateSettings({
        profile: {
          ...settings.profile,
          school: '',
          territory: '',
          schoolSource: null,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLicensed, schoolName, territoryName]);

  return null;
}
