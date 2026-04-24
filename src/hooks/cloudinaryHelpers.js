export const getWatermarkedUrl = (originalUrl) => {
    
    if (!originalUrl) return "";

    const watermarkParams = "l_text:Montserrat_60_bold:CADANCE%20FLOW,co_white,o_15,g_center,a_45,fl_tiled/";
    return originalUrl?.replace("/upload/", `/upload/${watermarkParams}`);
};