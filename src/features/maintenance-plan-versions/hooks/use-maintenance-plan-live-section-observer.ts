// 3rd party libraries
import React, { RefObject } from 'react';

// Workspace libraries
import { useActiveMLNSectionStore } from '@thor-frontend/features/maintenance-plan-versions/store/active_mln_section.store';



export const useMLNSectionObserver = (
  sectionId: string,
  ref: RefObject<HTMLDivElement>
) => {
  const mlnSectionStore = useActiveMLNSectionStore();
  const active = mlnSectionStore.activeSections.includes(sectionId);

  React.useEffect(() => {
    const observerConfig = {
      threshold: 1,
      rootMargin: '0px',
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (
          // If Not In Active Sections Array And In DOM View
          !mlnSectionStore.activeSections.includes(entry.target.id) &&
          entry.isIntersecting
        ) {
          handleUpdateList(entry.target.id);
        } else if (
          // If In Active Sections Array And Not in DOM View
          mlnSectionStore.activeSections.includes(entry.target.id) &&
          !entry.isIntersecting
        ) {
          removeFromList(entry.target.id);
        }
      });
    };

    const removeFromList = (value: string) => {
      const newActiveSections = [...mlnSectionStore.activeSections];

      const index = newActiveSections.indexOf(value);
      if (index !== -1) {
        newActiveSections.splice(index, 1);
      }

      mlnSectionStore.setActiveSections(newActiveSections);
    };

    const handleUpdateList = (value: string) => {
      const newActiveSections = [...mlnSectionStore.activeSections];

      if (!newActiveSections.includes(value)) {
        newActiveSections.push(value);
      }

      mlnSectionStore.setActiveSections(newActiveSections);
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerConfig
    );

    observer.observe(ref.current);

    return () => observer.disconnect(); // Clenaup the observer if component unmount.
  }, [ref, sectionId, mlnSectionStore, active]);

  return active;
};
