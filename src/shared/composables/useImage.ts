export function useImage() {
  const images = import.meta.glob("@/shared/assets/images/*", { eager: true });

  // ======================================================
  //  RENDER IMAGE FROM SHARED ASSETS FOLDER
  // ======================================================
  const renderImg = (src: string) => {
    const imagePath = `/src/shared/assets/images/${src}`;
    return (images[imagePath] as any)?.default || "";
  };

  return { renderImg };
}
