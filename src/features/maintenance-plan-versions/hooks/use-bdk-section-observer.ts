// 3rd party libraries
import React, { RefObject } from 'react';

// Workspace libraries
import { useActiveBDKSectionStore } from '@thor-frontend/features/maintenance-plan-versions/store/active_bdk_section.store';



export const useBDKSectionObserver = (
  sectionId: string,
  ref: RefObject<HTMLDivElement>
) => {
  const bdkSectionStore = useActiveBDKSectionStore();
  const active = bdkSectionStore.activeSections.includes(sectionId);

  React.useEffect(() => {
    const observerConfig = {
      threshold: 1,
      rootMargin: '0px',
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (
          // If Not In Active Sections Array And In DOM View
          !bdkSectionStore.activeSections.includes(entry.target.id) &&
          entry.isIntersecting
        ) {
          handleUpdateList(entry.target.id);
        } else if (
          // If In Active Sections Array And Not in DOM View
          bdkSectionStore.activeSections.includes(entry.target.id) &&
          !entry.isIntersecting
        ) {
          removeFromList(entry.target.id);
        }
      });
    };

    const removeFromList = (value: string) => {
      const newActiveSections = [...bdkSectionStore.activeSections];

      const index = newActiveSections.indexOf(value);
      if (index !== -1) {
        newActiveSections.splice(index, 1);
      }

      bdkSectionStore.setActiveSections(newActiveSections);
    };

    const handleUpdateList = (value: string) => {
      const newActiveSections = [...bdkSectionStore.activeSections];

      if (!newActiveSections.includes(value)) {
        newActiveSections.push(value);
      }

      bdkSectionStore.setActiveSections(newActiveSections);
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerConfig
    );

    observer.observe(ref.current);

    return () => observer.disconnect(); // Clenaup the observer if component unmount.
  }, [ref, sectionId, bdkSectionStore, active]);

  return active;
};
