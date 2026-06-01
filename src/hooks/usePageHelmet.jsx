import { Helmet } from "react-helmet-async";

/**
 * Component to manage page meta tags with language support
 * Automatically updates meta tags when language changes
 *
 * @param {Object} metaData - Meta data object containing tr and en properties
 * @param {string} language - Current language code ('tr' or 'en')
 * @returns {JSX.Element} Helmet component with appropriate meta tags
 */
export const PageHelmet = ({ metaData, language = "tr" }) => {
    const lang = language || "tr";
    const data = metaData[lang];

    return (
        <Helmet>
            <html lang={lang} />
            <title>{data.title}</title>
            <meta name="title" content={data.title} />
            <meta name="description" content={data.description} />

            {/* Robots meta tag if specified (e.g., for project details: noindex, nofollow) */}
            {data.robots && <meta name="robots" content={data.robots} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={data.og.title} />
            <meta property="og:description" content={data.og.description} />
            <meta property="og:image" content={data.og.image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={data.twitter.title} />
            <meta
                property="twitter:description"
                content={data.twitter.description}
            />
            <meta property="twitter:image" content={data.twitter.image} />
        </Helmet>
    );
};

/**
 * Component for dynamic meta tags (e.g., project names)
 * Used for project detail pages where the title/description depends on project data
 *
 * @param {Function} metaDataFn - Function that returns meta data object: metaDataFn(dynamicValue)
 * @param {string|any} dynamicValue - The value to pass to the meta data function (e.g., project name)
 * @param {string} language - Current language code ('tr' or 'en')
 * @returns {JSX.Element} Helmet component with dynamic meta tags
 */
export const DynamicPageHelmet = ({
    metaDataFn,
    dynamicValue,
    language = "tr",
}) => {
    const lang = language || "tr";
    const data = metaDataFn(dynamicValue)[lang](dynamicValue);

    return (
        <Helmet>
            <html lang={lang} />
            <title>{data.title}</title>
            <meta name="title" content={data.title} />
            <meta name="description" content={data.description} />

            {/* Robots meta tag if specified */}
            {data.robots && <meta name="robots" content={data.robots} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={data.og.title} />
            <meta property="og:description" content={data.og.description} />
            <meta property="og:image" content={data.og.image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={data.twitter.title} />
            <meta
                property="twitter:description"
                content={data.twitter.description}
            />
            <meta property="twitter:image" content={data.twitter.image} />
        </Helmet>
    );
};

/**
 * Component for project details - directly handles noindex, nofollow
 *
 * @param {string} projectName - The project name
 * @param {Object} metaDataObj - The projectDetails meta data object with tr/en language functions
 * @param {string} language - Current language code
 * @returns {JSX.Element} Helmet component with noindex, nofollow
 */
export const ProjectHelmet = ({ projectName, metaDataObj, language = "tr" }) => {
    const lang = language || "tr";
    const langData = metaDataObj[lang](projectName);

    return (
        <Helmet>
            <html lang={lang} />
            <title>{langData.title}</title>
            <meta name="title" content={langData.title} />
            <meta name="description" content={langData.description} />
            <meta name="robots" content="noindex, nofollow" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={langData.og.title} />
            <meta property="og:description" content={langData.og.description} />
            <meta property="og:image" content={langData.og.image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={langData.twitter.title} />
            <meta
                property="twitter:description"
                content={langData.twitter.description}
            />
            <meta property="twitter:image" content={langData.twitter.image} />
        </Helmet>
    );
};
