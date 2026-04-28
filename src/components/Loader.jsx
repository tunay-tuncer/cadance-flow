import loader1 from "../assets/loader/1.svg"
import loader2 from "../assets/loader/2.svg"
import loader3 from "../assets/loader/3.svg"
import loader4 from "../assets/loader/4.svg"

function Loader() {
    return (
        <>
            <style>{`
                .loaderOverlay {
                    position: fixed; /* Sayfa kaydırılsa bile ekranın ortasında kalır */
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .loaderMainContainer {
                    position: relative; 
                    width: 180px; 
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .loader1, .loader2, .loader3, .loader4 {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .loader1 {
                    transform-origin: center; 
                    animation: r1 2.25s infinite;
                    animation-delay: 0.5s;
                }

                .loader3 {
                    animation: r1 2.25s infinite;
                    animation-delay: 0.5s;
                }

                .loader2, .loader4 {
                    animation: l1 2.25s infinite;
                    animation-delay: 0.5s;
                }

                @keyframes r1 { 
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(1turn); }
                }
                @keyframes l1 { 
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(-1turn); }
                }
            `}</style>

            <div className="loaderOverlay">
                <div className="loaderMainContainer">
                    <img src={loader1} className="loader1" alt="L1" />
                    <img src={loader2} className="loader2" alt="L2" />
                    <img src={loader3} className="loader3" alt="L3" />
                    <img src={loader4} className="loader4" alt="L4" />
                </div>
            </div>
        </>
    );
}

export default Loader;