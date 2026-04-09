import React, { useState, useEffect } from "react";
import type { RoutePoint } from "../../ItineraryDetail";
import styles from "./AddSpotModal.module.scss";
import axios from "axios";

interface Props {
  onClose: () => void;
  onAdd: (point: Omit<RoutePoint, "id">) => void;
  onPreviewSpot?: (point: Partial<RoutePoint>) => void;
}

interface Suggestion {
  display_name: string;
  name?: string;
  lat: string;
  lon: string;
}

const AddSpotModal: React.FC<Props> = ({ onClose, onAdd, onPreviewSpot }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [type, setType] = useState<RoutePoint["type"]>("attraction");
  const [time, setTime] = useState("09:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [daySelect, setDaySelect] = useState(1);

  // Auto-search on type with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        axios
          .get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&countrycodes=vn&limit=5`,
          )
          .then((res) => {
            if (res.data && res.data.length > 0) {
              setSuggestions(res.data);
            } else {
              setSuggestions([]);
            }
          })
          .catch((e) => console.error(e))
          .finally(() => setIsSearching(false));
      } else if (searchQuery.trim().length === 0) {
        setSuggestions([]);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchDescription = async (query: string) => {
    try {
      const searchRes = await axios.get(
        `https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`,
      );
      if (searchRes.data.query.search.length > 0) {
        const title = searchRes.data.query.search[0].title;
        const detailRes = await axios.get(
          `https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        );
        return detailRes.data.extract || "";
      }
      return "";
    } catch {
      return "";
    }
  };

  const handleSelectSuggestion = (item: Suggestion) => {
    const selectedName = item.name || item.display_name.split(",")[0];
    setName(selectedName);
    setAddress(item.display_name);
    setLatLng({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    });

    if (onPreviewSpot) {
      onPreviewSpot({
        name: selectedName,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: 'attraction',
        time: '...'
      });
    }

    setSuggestions([]);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!address && !latLng)) return;

    setLoading(true);
    setError("");

    try {
      let finalLat = latLng?.lat;
      let finalLng = latLng?.lng;

      if (!finalLat || !finalLng) {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&countrycodes=vn&limit=1`,
        );
        if (res.data && res.data.length > 0) {
          finalLat = parseFloat(res.data[0].lat);
          finalLng = parseFloat(res.data[0].lon);
        } else {
          setError("Không tìm thấy tọa độ cho địa chỉ này.");
          setLoading(false);
          return;
        }
      }

      const description = await fetchDescription(name);

      onAdd({
        name,
        lat: finalLat!,
        lng: finalLng!,
        time,
        type,
        description:
          description || `Đây là một địa điểm thú vị tại ${address}.`,
        note: note.trim() || undefined,
        day: daySelect,
      });
      onClose();
    } catch {
      setError("Lỗi kết nối khi tìm địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Tìm & Thêm địa điểm</h2>
          <button type="button" className={styles.modalClose} onClick={onClose} title="Đóng" aria-label="Đóng">
            <i className="ph-bold ph-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.addSpotForm} onClick={(e) => e.stopPropagation()}>
          <div className={styles.formBody}>
            {/* Cột trái: Tìm kiếm & Thông tin cơ bản */}
            <div className={styles.formColumn}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.columnTitle}>1. Tìm địa điểm</h3>
                <p className={styles.columnDesc}>Tìm trên bản đồ để tự động điền thông tin</p>
              </div>

              <div className={styles.searchSection}>
                <div className={styles.searchInputWrapper}>
                  <i className={`ph-fill ph-magnifying-glass ${styles.searchIcon}`}></i>
                  <input
                    type="text"
                    placeholder="Nhập tên khách sạn, nhà hàng, địa danh..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.modalSearchInput}
                    autoComplete="off"
                  />
                  {isSearching && <div className={styles.searchLoader}></div>}
                </div>

                {suggestions.length > 0 && (
                  <div className={styles.suggestionsDropdown}>
                    {suggestions.map((item, index) => (
                      <div key={index} className={styles.suggestionItem} onClick={() => handleSelectSuggestion(item)}>
                        <i className="ph-fill ph-map-pin"></i>
                        <div className={styles.suggestionText}>
                          <div className={styles.suggestionTitle}>{item.name || item.display_name.split(",")[0]}</div>
                          <div className={styles.suggestionAddr}>{item.display_name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.manualEntrySection}>
                 <div className={styles.sectionHeader}>
                    <h3 className={styles.columnTitle}>2. Thông tin chi tiết</h3>
                    <p className={styles.columnDesc}>Xác nhận lại tên và địa chỉ chính xác</p>
                 </div>
                 
                 <div className={styles.formGroup}>
                    <label htmlFor="spot-name">Tên địa điểm *</label>
                    <input
                      id="spot-name"
                      type="text"
                      placeholder="Ví dụ: Cầu Rồng, Sun World..."
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setLatLng(null);
                      }}
                      required
                    />
                 </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="spot-address">Địa chỉ cụ thể *</label>
                    <input
                      id="spot-address"
                      type="text"
                      placeholder="Số nhà, đường, phường/xã..."
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setLatLng(null);
                      }}
                      required
                    />
                 </div>
              </div>
            </div>

            {/* Cột phải: Cấu hình & Ghi chú */}
            <div className={styles.formColumn}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.columnTitle}>3. Thiết lập & Ghi chú</h3>
                <p className={styles.columnDesc}>Thời gian ghé thăm và nhắc nhở</p>
              </div>
              
              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${styles.flexGroup}`}>
                  <label htmlFor="spot-type">Phân loại</label>
                  <select id="spot-type" value={type} onChange={(e) => setType(e.target.value as RoutePoint["type"])} required>
                    <option value="hotel">🏨 Khách sạn</option>
                    <option value="restaurant">🍽️ Nhà hàng</option>
                    <option value="attraction">📷 Tham quan</option>
                    <option value="shopping">🛍️ Mua sắm</option>
                    <option value="other">📍 Khác</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.flexGroup}`}>
                  <label htmlFor="spot-time">Giờ ghé</label>
                  <input id="spot-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>

                <div className={`${styles.formGroup} ${styles.flexGroup}`}>
                  <label htmlFor="spot-day">Ngày</label>
                  <select id="spot-day" value={daySelect} onChange={(e) => setDaySelect(Number(e.target.value))} required>
                    <option value={1}>Ngày 1</option>
                    <option value={2}>Ngày 2</option>
                    <option value={3}>Ngày 3</option>
                  </select>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.noteGroup}`}>
                <label htmlFor="spot-note"><i className="ph-fill ph-notepad"></i> Ghi chú riêng cho bạn</label>
                <textarea
                  id="spot-note"
                  placeholder="Ghi chú các việc cần làm, món ăn muốn thử, hay số điện thoại liên hệ..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={6}
                  className={styles.noteTextarea}
                />
              </div>
            </div>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Hủy</button>
            <button type="submit" className={styles.btnSubmit} disabled={loading || !name || !address}>
              {loading ? "Đang lưu..." : "Thêm vào lịch trình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpotModal;
