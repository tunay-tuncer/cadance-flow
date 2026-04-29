//DEPENDENCIES
import { useEffect, useState, useRef } from "react";
import styles from "../../styles/Project.module.css"
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from 'uuid';
import { useSupabase } from "../../hooks/useSupabase";
//COMPONENTS
import FsImageContainer from "./FsImageContainer";
import ToolsContainer from "./ToolsContainer";
import ImageDisplay from "./ImageDisplay";
import PdfDisplay from "./PdfDisplay";
import { getWatermarkedUrl } from "../../hooks/cloudinaryHelpers"
//REACT ICONS
import { MdCheck, MdClose, MdFullscreen } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiUserLine } from "react-icons/ri";
import { TbCube3dSphere } from "react-icons/tb";

const MediaContainer = ({ project, isPublic }) => {
    const containerRef = useRef(null);
    const imgElRef = useRef(null);
    const textAreaRef = useRef(null);

    const { user, isAuthenticated } = useAuth0();
    const { getClient } = useSupabase();

    const [currentImage, setCurrentImage] = useState(0);
    const [currentImageId, setCurrentImageId] = useState("");
    const [currentAssetType, setCurrentAssetType] = useState("image");

    const [isFsOpen, setIsFsOpen] = useState(false);
    const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
    const [isCommenting, setIsCommenting] = useState(false);
    const [openCommentIds, setOpenCommentIds] = useState([]);

    const [isDrafting, setIsDrafting] = useState(false);
    const [draftText, setDraftText] = useState("");
    const [canUserComment, setCanUserComment] = useState(false);
    const [canDownloadAsset, setCanDownloadAsset] = useState(true);

    // Güvenli assets ve comments
    const assets = project?.project_assets ?? [];
    const allComments = assets.flatMap(asset => asset.project_comments || []);
    const [comments, setComments] = useState(allComments);

    useEffect(() => {
        if (!assets[currentImage]) return;
        setCurrentImageId(assets[currentImage].id);
        setCurrentAssetType(assets[currentImage].asset_type);
    }, [currentImage, assets]);

    useEffect(() => {
        assets.forEach((asset) => {
            if (asset?.url && typeof asset.url === "string") {
                const fullResUrl = getWatermarkedUrl(asset.url);
                const img = new Image();
                img.src = fullResUrl;
            }
        });
    }, [assets]);

    useEffect(() => {
        if (!assets.length) return;
        const currentAsset = assets[currentImage];
        if (currentAsset) {
            if (currentAssetType === "image" && isAuthenticated) {
                setCanUserComment(true);

            } else {
                setCanUserComment(false);
                setIsCommenting(false);
            }
            setCanDownloadAsset(currentAsset.can_download !== false);
        }
    }, [currentAssetType, currentImage, project]);

    const getPhaseName = (asset) => {
        const phases = project?.project_phases ?? [];
        const phase = phases.find(p => p.id === asset.phase_id);
        return phase ? phase.name : "Unassigned";
    };

    const deleteAllComments = async () => {
        const confirmDelete = window.confirm("Bu görsele ait TÜM yorumları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");
        if (!confirmDelete) return;
        try {
            const supabase = await getClient();
            const { error } = await supabase
                .from('project_comments')
                .delete()
                .eq("asset_id", currentImageId);
            if (error) throw error;
            setComments(prev => prev.filter(c => c.asset_id !== currentImageId));
        } catch (err) {
            console.error("Yorumlar silinirken hata oluştu:", err.message);
            alert("Silme işlemi başarısız oldu: " + err.message);
        }
    };

    const getImageRect = () => {
        if (!containerRef.current || !imgElRef.current) return null;
        const container = containerRef.current.getBoundingClientRect();
        const { naturalWidth, naturalHeight } = imgElRef.current;
        if (!naturalWidth || !naturalHeight) return null;
        const containerAspect = container.width / container.height;
        const imageAspect = naturalWidth / naturalHeight;
        let renderedWidth, renderedHeight, offsetX, offsetY;
        if (imageAspect > containerAspect) {
            renderedWidth = container.width;
            renderedHeight = container.width / imageAspect;
            offsetX = 0;
            offsetY = (container.height - renderedHeight) / 2;
        } else {
            renderedHeight = container.height;
            renderedWidth = container.height * imageAspect;
            offsetX = (container.width - renderedWidth) / 2;
            offsetY = 0;
        }
        return { renderedWidth, renderedHeight, offsetX, offsetY, container };
    };

    const handleMouseMove = (e) => {
        if (!isCommenting || isDrafting) return;
        const result = getImageRect();
        if (!result) return;
        const { renderedWidth, renderedHeight, offsetX, offsetY, container } = result;
        const rawX = e.clientX - container.left - offsetX;
        const rawY = e.clientY - container.top - offsetY;
        const x = Math.min(Math.max((rawX / renderedWidth) * 100, 0), 100);
        const y = Math.min(Math.max((rawY / renderedHeight) * 100, 0), 100);
        setPreviewPos({ x, y });
    };

    const handleImageClick = () => {
        if (!isCommenting || isDrafting) return;
        setIsDrafting(true);
    };

    const getPinStyle = (left, top) => {
        const result = getImageRect();
        if (!result) return { left: `${left}%`, top: `${top}%`, position: "absolute" };
        const { renderedWidth, renderedHeight, offsetX, offsetY } = result;
        return {
            position: "absolute",
            left: `${offsetX + (parseFloat(left) / 100) * renderedWidth}px`,
            top: `${offsetY + (parseFloat(top) / 100) * renderedHeight}px`,
        };
    };

    const confirmComment = async (e) => {
        e.stopPropagation();
        if (!draftText.trim()) return;
        if (!isAuthenticated) return;
        try {
            const supabase = await getClient();
            const newComment = {
                id: uuidv4(),
                created_at: new Date().toISOString(),
                left: `${previewPos.x}`,
                top: `${previewPos.y}`,
                content: draftText,
                asset_id: currentImageId,
                profile_id: user.sub,
            };
            const { data, error } = await supabase
                .from('project_comments')
                .insert(newComment)
                .select('*, profiles(avatar_url, full_name)');
            if (error) throw error;
            const inserted = data?.[0] ?? {
                ...newComment,
                profiles: {
                    avatar_url: user.picture,
                    full_name: user.name,
                }
            };
            setComments((prev) => [...prev, inserted]);
            setDraftText("");
            setIsDrafting(false);
            setIsCommenting(false);
        } catch (err) {
            console.error("Yorum eklenirken hata oluştu:", err.message);
            alert("Yorum gönderilemedi!");
        }
    };

    const cancelComment = (e) => {
        e.stopPropagation();
        setIsDrafting(false);
        setDraftText("");
    };

    const toggleComment = (id) => {
        setOpenCommentIds((prev) =>
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    const deleteSelectedComment = async (id) => {
        setComments(prev => prev.filter(comment => comment.id !== id));
        try {
            const supabase = await getClient();
            const { error } = await supabase
                .from('project_comments')
                .delete()
                .eq("id", id);
            if (error) throw error;
        } catch (err) {
            console.error("Yorum silinirken hata oluştu:", err.message);
            alert("Yorum silinemedi!");
        }
    };

    const openFullscreen = () => {
        setIsFsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    return (
        <div className={styles.mediaContainer}>

            {project?.project_assets?.length === 0 ? (
                <div className={styles.emptyMediaWrapper}>
                    <div className={styles.emptyMediaContent}>
                        <div className={styles.emptyMediaIllustration}>
                            <TbCube3dSphere className={styles.floatingIcon} />
                        </div>
                        <h2>Initial Renders are on the way!</h2>
                        <p>Our team is currently working on your visualizations. Once the first drafts are ready, you'll be able to view and comment on them here.</p>
                        <div className={styles.pulseBadge}>Creative Process in Progress</div>
                    </div>
                </div>
            ) : (
                <div className={styles.leftContainer}>
                    <p className={styles.assetName}>
                        {`${assets[currentImage]?.file_name ?? ""} - ${getPhaseName(assets[currentImage])}`}
                    </p>

                    {currentAssetType === "image" && (
                        <ImageDisplay
                            containerRef={containerRef}
                            imgElRef={imgElRef}
                            handleMouseMove={handleMouseMove}
                            handleImageClick={handleImageClick}
                            imageUrl={assets[currentImage]?.url}
                        >
                            <MdFullscreen className={styles.fullscreenIcon} onClick={openFullscreen} />

                            {isCommenting && (
                                <div
                                    className={styles.draftWrapper}
                                    style={{
                                        ...getPinStyle(previewPos.x, previewPos.y),
                                        pointerEvents: isDrafting ? 'auto' : 'none',
                                        flexDirection: previewPos.x > 55 ? "row-reverse" : "row",
                                        transform: `translate(${previewPos.x > 55 ? "-100%" : "0"}, ${previewPos.y > 60 ? "-100%" : "0"})`,
                                    }}
                                >
                                    {user?.picture
                                        ? <img className={styles.commentProfilePic} src={user.picture} alt={user?.name} referrerPolicy="no-referrer" />
                                        : <RiUserLine className={styles.commentProfilePic} />
                                    }
                                    {isDrafting && (
                                        <div className={styles.commentInputPopUp}>
                                            <textarea
                                                ref={textAreaRef}
                                                autoFocus
                                                placeholder="Add comment..."
                                                value={draftText}
                                                onChange={(e) => {
                                                    setDraftText(e.target.value);
                                                    e.target.style.height = "inherit";
                                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                                                }}
                                                className={styles.commentTextArea}
                                            />
                                            <div className={styles.inputActions}>
                                                <button onClick={confirmComment}><MdCheck /></button>
                                                <button onClick={cancelComment}><MdClose /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isAuthenticated && comments
                                .filter((c) => c.asset_id === currentImageId)
                                .map((c) => {
                                    const isOpen = openCommentIds.includes(c.id);
                                    const isRightEdge = parseFloat(c.left) > 65;
                                    return (
                                        <div
                                            key={c.id}
                                            className={styles.comment}
                                            style={{
                                                ...getPinStyle(c.left, c.top),
                                                flexDirection: isRightEdge ? "row-reverse" : "row",
                                                zIndex: isOpen ? 90 : 10,
                                                pointerEvents: 'auto',
                                                transform: isRightEdge ? "translateX(-100%)" : "",
                                            }}
                                        >
                                            {c.profiles?.avatar_url
                                                ? <img className={styles.commentProfilePic} src={c.profiles.avatar_url} alt="user" referrerPolicy="no-referrer" onClick={(e) => { e.stopPropagation(); toggleComment(c.id); }} />
                                                : <RiUserLine className={styles.commentProfilePic} onClick={(e) => { e.stopPropagation(); toggleComment(c.id); }} />
                                            }
                                            {isOpen && (
                                                <div className={styles.commentBubble} onClick={(e) => e.stopPropagation()}>
                                                    <div className={styles.commentControls}>
                                                        <FaRegTrashAlt className={styles.deleteComment} onClick={() => deleteSelectedComment(c.id)} />
                                                    </div>
                                                    <p>{c.content}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            }
                        </ImageDisplay>
                    )}

                    {currentAssetType === "pdf" && (
                        <PdfDisplay pdfUrl={assets[currentImage]?.url} />
                    )}
                </div>
            )}

            {project?.project_assets?.length > 0 && (
                <ToolsContainer
                    project={project}
                    setIsCommenting={setIsCommenting}
                    isCommenting={isCommenting}
                    deleteAllComments={deleteAllComments}
                    currentImage={currentImage}
                    setCurrentImage={setCurrentImage}
                    getPhaseName={getPhaseName}
                    canUserComment={canUserComment}
                    canDownloadAsset={canDownloadAsset}
                />
            )}

            {isFsOpen && project?.project_assets?.length > 0 && (
                <FsImageContainer
                    image={assets[currentImage]}
                    isFsOpen={isFsOpen}
                    setIsFsOpen={setIsFsOpen}
                />
            )}
        </div>
    );
};

export default MediaContainer;