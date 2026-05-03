import { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Loader from "../../components/Loader";
import { useFetchProjects } from "../../hooks/useFetchProject";
import { useSupabase } from "../../hooks/useSupabase";
import { useAuth0 } from "@auth0/auth0-react";
//STYLES
import styles from "../../styles/MediaPage.module.css";
//REACT ICONS
import {
    MdOutlineImage,
    MdCollections,
    MdClose,
    MdFileDownload,
    MdCalendarToday,
    MdLabelOutline,
    MdArrowBack,
    MdArrowForward,
    MdCheckCircle,
    MdRadioButtonUnchecked,
    MdLibraryAddCheck,
    MdExpandMore,
    MdExpandLess
} from "react-icons/md";

const Media = () => {
    const { user } = useAuth0();
    const { getClient } = useSupabase();
    const { projects, loading: projectsLoading } = useFetchProjects(user);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedAssetIndex, setSelectedAssetIndex] = useState(null);
    const [collapsedProjects, setCollapsedProjects] = useState([]);


    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedAssetIds, setSelectedAssetIds] = useState([]);
    const [isZipping, setIsZipping] = useState(false);

    useEffect(() => {
        if (projectsLoading) return;
        if (!projects || projects.length === 0) {
            setLoading(false);
            return;
        }

        const fetchAllMedia = async () => {
            setLoading(true);
            try {
                const supabase = await getClient();
                const { data, error } = await supabase
                    .from("project_assets")
                    .select("*, cadance_flow(id, project_name, tracking_number)")
                    .in('project_id', projects.map(p => p.id));

                if (error) throw error;
                setAssets(data ?? []);
            } catch (err) {
                console.error("Fetch hatası:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMedia();
    }, [projects, projectsLoading, getClient]);

    const toggleSelection = (id) => {
        setSelectedAssetIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleProjectCollapse = (projectName) => {
        setCollapsedProjects(prev =>
            prev.includes(projectName)
                ? prev.filter(name => name !== projectName)
                : [...prev, projectName]
        );
    };

    const handleDownloadSelected = async () => {
        if (selectedAssetIds.length === 0) return;
        setIsZipping(true);
        const zip = new JSZip();

        try {
            const promises = assets
                .filter(asset => selectedAssetIds.includes(asset.id))
                .map(async (asset) => {
                    const response = await fetch(asset.url);
                    const blob = await response.blob();
                    zip.file(asset.file_name || `${asset.id}.jpg`, blob);
                });

            await Promise.all(promises);
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "cadance-flow-export.zip");

            setIsSelectionMode(false);
            setSelectedAssetIds([]);
        } catch (error) {
            console.error("Zipleme hatası:", error);
            alert("Toplu indirme sırasında bir hata oluştu.");
        } finally {
            setIsZipping(false);
        }
    };

    const groupedAssets = assets.reduce((acc, asset) => {
        const projectName = asset.cadance_flow?.project_name ?? "Unknown Project";
        if (!acc[projectName]) acc[projectName] = [];
        acc[projectName].push(asset);
        return acc;
    }, {});

    const handleNext = (e) => {
        e.stopPropagation();
        setSelectedAssetIndex((prev) => (prev + 1) % assets.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setSelectedAssetIndex((prev) => (prev - 1 + assets.length) % assets.length);
    };

    const downloadSingleImage = async (imageUrl, fileName) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'cadance-flow-export.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("İndirme hatası:", error);
        }
    };

    if (loading || projectsLoading) return <Loader />;

    const currentAsset = selectedAssetIndex !== null ? assets[selectedAssetIndex] : null;

    return (
        <div className={styles.mediaMainContainer}>
            <header className={styles.mediaHeader}>
                <div className={styles.headerTitle}>
                    <MdCollections className={styles.headerIcon} />
                    <h1>MEDIA ARCHIVE</h1>
                </div>

                <div className={styles.headerActions}>
                    <p>{assets.length} Assets total</p>
                    <div className={styles.selectionControls}>
                        {isSelectionMode ? (
                            <>
                                <button
                                    className={styles.downloadSelectedBtn}
                                    onClick={handleDownloadSelected}
                                    disabled={selectedAssetIds.length === 0 || isZipping}
                                >
                                    {isZipping ? "Creating Zip..." : `Download Zip (${selectedAssetIds.length})`}
                                </button>
                                <button className={styles.cancelSelectionBtn} onClick={() => {
                                    setIsSelectionMode(false);
                                    setSelectedAssetIds([]);
                                }}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button className={styles.selectionModeBtn} onClick={() => setIsSelectionMode(true)}>
                                <MdLibraryAddCheck /> Select Multiple
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {Object.entries(groupedAssets).map(([projectName, projectAssets]) => {
                const isCollapsed = collapsedProjects.includes(projectName);

                return (
                    <section key={projectName} className={styles.projectSection}>
                        {/* Proje Başlığı ve Daraltma Kontrolü */}
                        <div
                            className={styles.projectHeader}
                            onClick={() => toggleProjectCollapse(projectName)}
                        >
                            <h2 className={styles.projectTitle}>
                                {projectName}
                                <span className={styles.assetCount}>({projectAssets.length} assets)</span>
                            </h2>
                            <button className={styles.collapseBtn}>
                                {isCollapsed ? <MdExpandMore /> : <MdExpandLess />}
                            </button>
                        </div>

                        {/* İçerik Alanı: Sadece daraltılmamışsa gösterilir */}
                        {!isCollapsed && (
                            <div className={styles.assetGrid}>
                                {projectAssets.map((asset) => {
                                    const globalIndex = assets.findIndex(a => a.id === asset.id);
                                    const isSelected = selectedAssetIds.includes(asset.id);
                                    return (
                                        <div
                                            key={asset.id}
                                            className={`${styles.assetCard} ${isSelected ? styles.assetCardSelected : ""}`}
                                            onClick={() => {
                                                if (isSelectionMode) {
                                                    toggleSelection(asset.id);
                                                } else {
                                                    setSelectedAssetIndex(globalIndex);
                                                }
                                            }}
                                        >
                                            <div className={styles.imageWrapper}>
                                                <img src={asset.url} alt={asset.file_name} className={styles.assetImage} />

                                                {/* Seçim Modu İkonları */}
                                                {isSelectionMode && (
                                                    <div className={styles.selectionIcon}>
                                                        {isSelected ? <MdCheckCircle color="var(--accent)" /> : <MdRadioButtonUnchecked />}
                                                    </div>
                                                )}

                                                {!isSelectionMode && (
                                                    <div className={styles.overlay}>
                                                        <span className={styles.viewBtn}>View Detail</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.assetInfo}>
                                                <p className={styles.fileName}>{asset.file_name}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                );
            })}

            {/* Boş Durum Kontrolü */}
            {Object.keys(groupedAssets).length === 0 && (
                <div className={styles.emptyState}>
                    <MdOutlineImage className={styles.emptyIcon} />
                    <p>No media assets found in your archive.</p>
                </div>
            )}

            {/* Detay Modalı (Sidebar İçeren Yapı) */}
            {currentAsset && (
                <div className={styles.modalOverlay} onClick={() => setSelectedAssetIndex(null)}>
                    <button className={styles.closeBtn} onClick={() => setSelectedAssetIndex(null)}>
                        <MdClose />
                    </button>

                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        {/* Görsel Alanı ve Navigasyon */}
                        <div className={styles.viewerSection}>
                            <button className={styles.navBtn} onClick={handlePrev}><MdArrowBack /></button>
                            <img src={currentAsset.url} alt="Detail" className={styles.largeImage} />
                            <button className={styles.navBtn} onClick={handleNext}><MdArrowForward /></button>
                        </div>

                        {/* Bilgi Paneli (Sidebar) */}
                        <aside className={styles.detailSidebar}>
                            <div className={styles.sidebarHeader}>
                                <h2>Asset Details</h2>
                                <span className={styles.badge}>{currentAsset.asset_type}</span>
                            </div>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <MdLabelOutline className={styles.infoIcon} />
                                    <div>
                                        <label>Project</label>
                                        <p>{currentAsset.cadance_flow?.project_name}</p>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <MdCalendarToday className={styles.infoIcon} />
                                    <div>
                                        <label>Upload Date</label>
                                        <p>{new Date(currentAsset.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <MdOutlineImage className={styles.infoIcon} />
                                    <div>
                                        <label>File Name</label>
                                        <p>{currentAsset.file_name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.sidebarActions}>
                                <button
                                    onClick={() => downloadSingleImage(currentAsset.url, currentAsset.file_name)}
                                    className={styles.downloadAction}
                                >
                                    <MdFileDownload /> Download Original
                                </button>
                                <button
                                    className={styles.projectAction}
                                    onClick={() => window.location.href = `/dashboard/project/${currentAsset.cadance_flow?.tracking_number}`}
                                >
                                    Go to Project
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Media;