export default function useFile() {
  const processFileType = (name: string, allowedFiles: string[]) => {
    const fileParts = name.split(".");
    const fileType = fileParts[fileParts.length - 1];
    return allowedFiles.includes(fileType) ? true : false;
  };

  const processFileSize = (size: number, limit = 5000000) => {
    if (size > limit) return false;

    return size.toString().length >= 6
      ? `${(size / 1000000).toFixed(1)}mb`
      : `${(size / 1000).toFixed(1)}kb`;
  };

  return {
    processFileType,
    processFileSize,
  };
}
