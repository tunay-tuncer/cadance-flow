import loader1 from "../assets/loader/1.svg"
import loader2 from "../assets/loader/2.svg"
import loader3 from "../assets/loader/3.svg"
import loader4 from "../assets/loader/4.svg"

function Loader() {
    console.log("loader")
    return (
        <>
            <style>{`
            .loaderMainContainer {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 200px;
                aspect-ratio: 1;
                z-index: 99;
                transform: translateY(-50%);
            }

            .loader1, .loader2, .loader3, .loader4 {
                position: absolute;
              
            }

            .loader1{
              transform-origin: 90px 90px;
            }

            .loader1, .loader3{
                animation-delay: 0.5s;
                animation: r1 2.25s infinite;
            }

            .loader2, .loader4{
                animation-delay: 0.5s;
                animation: l1 2.25s infinite;
            }

            @keyframes r1 {to{transform: rotate(1turn)}}
            @keyframes l1 {to{transform: rotate(-1turn)}}

        `}
            </style>
            <div className="loaderMainContainer">
                <img src={loader1} className="loader1" />
                <img src={loader2} className="loader2" />
                <img src={loader3} className="loader3" />
                <img src={loader4} className="loader4" />
            </div>
        </>
    )
}

export default Loader;