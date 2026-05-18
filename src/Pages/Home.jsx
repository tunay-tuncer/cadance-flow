import Navbar from "../components/HomePageComponents/Navbar";
import Hero from "../components/HomePageComponents/Hero"
import GridBackground from "../components/GridBackground";
import Process from "../components/HomePageComponents/Process";
import Gallery from "../components/HomePageComponents/Gallery";
import Reviews from "../components/HomePageComponents/Reviews";
import ScrollToTopButton from "../components/ScrollToTopButton";

const Home = () => {
    return (
        <>
            <GridBackground />
            <Navbar />
            <Hero />
            <Process />
            <Gallery />
            <Reviews />
            <ScrollToTopButton />
        </>
    )
}

export default Home