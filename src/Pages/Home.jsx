import { useContext } from 'react';
import Navbar from "../components/HomePageComponents/Navbar";
import Hero from "../components/HomePageComponents/Hero"
import GridBackground from "../components/GridBackground";
import Process from "../components/HomePageComponents/Process";
import Gallery from "../components/HomePageComponents/Gallery";
import Reviews from "../components/HomePageComponents/Reviews";
import CallToAction from "../components/HomePageComponents/CallToAction";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from "../components/Footer";
import { PageHelmet } from '../hooks/usePageHelmet.jsx';
import { metaTags } from '../config/metaTags';
import { ProjectContext } from '../context/ProjectContext';

const Home = () => {
    const { langCode } = useContext(ProjectContext);

    return (
        <>
            <PageHelmet metaData={metaTags.home} language={langCode} />
            <GridBackground />
            <Navbar />
            <Hero />
            <Process />
            <Gallery />
            <Reviews />
            <CallToAction />
            <ScrollToTopButton />
            <Footer />
        </>
    )
}

export default Home