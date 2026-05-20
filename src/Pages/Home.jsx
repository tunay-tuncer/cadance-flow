import Navbar from "../components/HomePageComponents/Navbar";
import Hero from "../components/HomePageComponents/Hero"
import GridBackground from "../components/GridBackground";
import Process from "../components/HomePageComponents/Process";
import Gallery from "../components/HomePageComponents/Gallery";
import Reviews from "../components/HomePageComponents/Reviews";
import CallToAction from "../components/HomePageComponents/CallToAction";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <>
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