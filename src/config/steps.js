export const getDashboardTourSteps = (currentLang, styles) => {
    if (!currentLang || !currentLang.joyrideSteps?.dashboard?.tour) return [];

    const tour = currentLang.joyrideSteps.dashboard.tour;

    return [
        {
            target: `.${styles.dashboardContainer}`,
            title: tour.step1_title,
            content: tour.step1_content,
            placement: "center",
            disableBeacon: true,
        },
        {
            target: `[data-tour="dashboard-info"]`,
            title: tour.step2_title,
            content: tour.step2_content,
            placement: "bottom",
        },
        {
            target: `[data-tour="recent-projects"]`,
            title: tour.step3_title,
            content: tour.step3_content,
            placement: "top",
        },
    ];
};

export const getProjectTourSteps = (currentLang, styles) => {
    if (!currentLang || !currentLang.joyrideSteps?.project?.tour) return [];

    const tour = currentLang.joyrideSteps.project.tour;

    return [
        {
            target: `.${styles.projectMainContainer}`,
            title: tour.step1_title,
            content: tour.step1_content,
            placement: "center",
            disableBeacon: true,
        },
        {
            target: `.${styles.carouselWrapper}`,
            title: tour.step2_title,
            content: tour.step2_content,
            placement: "bottom",
        },
        {
            target: `.${styles.mediaContainer}`,
            title: tour.step3_title,
            content: tour.step3_content,
            placement: "top",
        },
    ];
};
