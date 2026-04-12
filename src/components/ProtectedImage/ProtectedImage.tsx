import React, { useEffect, useState } from "react";
import instance from "../../utils/AxiosCustomize";

interface ProtectedImageProps {
  src: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt = "",
  className = "",
  fallbackSrc,
  style,
  onError,
}) => {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!src) {
      setImgUrl(fallbackSrc || "");
      return;
    }

    // Nếu là ảnh từ domain khác (cloudinary, unsplash...) thì không cần fetch có token
    if (src.startsWith("http") && !src.includes("localhost:8888")) {
      setImgUrl(src);
      return;
    }

    let isMounted = true;
    let currentBlobUrl = "";

    const fetchImage = async () => {
      try {
        setIsLoading(true);
        
        // Loại bỏ tiền tố /api/v1 nếu nó đã tồn tại trong src để tránh bị Axios instance nhân đôi
        const apiPrefix = "/api/v1";
        let cleanUrl = src;
        if (src.startsWith(apiPrefix)) {
          cleanUrl = src.substring(apiPrefix.length);
        } else if (src.startsWith(`http://localhost:8888${apiPrefix}`)) {
          cleanUrl = src.substring(`http://localhost:8888${apiPrefix}`.length);
        }

        console.log(`[ProtectedImage] Đang tải ảnh từ: ${cleanUrl} (Gốc: ${src})`);

        const response = await instance.get(cleanUrl, { responseType: "blob" });
        
        if (isMounted) {
          if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
          currentBlobUrl = URL.createObjectURL(response.data);
          setImgUrl(currentBlobUrl);
          console.log(`[ProtectedImage] Tải ảnh thành công: ${cleanUrl}`);
        }
      } catch (error) {
        console.error(`[ProtectedImage] Lỗi khi tải ảnh từ ${src}:`, error);
        if (isMounted) {
          setImgUrl(fallbackSrc || "");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    // Cleanup: giải phóng bộ nhớ khi src thay đổi hoặc unmount
    return () => {
      isMounted = false;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [src, fallbackSrc]);

  // Nếu không có ảnh và không có fallback, không render gì cả hoặc render placeholder
  if (!imgUrl && !isLoading) {
      if (fallbackSrc) return <img src={fallbackSrc} alt={alt} className={className} style={style} />;
      return null;
  }

  return (
    <img
      src={imgUrl}
      alt={alt}
      className={className}
      onError={onError}
      style={{
        ...style,
        opacity: isLoading ? 0.6 : 1,
        transition: "opacity 0.3s ease",
      }}
    />
  );
};

export default ProtectedImage;
