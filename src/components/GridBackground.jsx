const GridBackground = () => {
    return (
        <div style={{
            position: "absolute", top: "0", left: "0", height: "100%", width: "100%", backgroundImage: "linear-gradient(to right, var(--gridWhite) 1px, transparent 1px),linear-gradient(to bottom, var(--gridWhite) 1px, transparent 1px)", backgroundSize: "20rem 20rem", backgroundPosition: "left top", zIndex: "-10"

        }}>

        </div>
    )
}

export default GridBackground