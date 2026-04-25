package com.java.kltn.services.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.kltn.entities.AttractionEntity;
import com.java.kltn.entities.HotelEntity;
import com.java.kltn.entities.ProvinceEntity;
import com.java.kltn.entities.RestaurantEntity;
import com.java.kltn.enums.AttractionCategory;
import com.java.kltn.enums.HotelType;
import com.java.kltn.enums.RestaurantCuisine;
import com.java.kltn.repositories.AttractionRepository;
import com.java.kltn.repositories.HotelRepository;
import com.java.kltn.repositories.ProvinceRepository;
import com.java.kltn.repositories.RestaurantRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OSMImportService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final HotelRepository hotelRepository;
    private final RestaurantRepository restaurantRepository;
    private final AttractionRepository attractionRepository;
    private final ProvinceRepository provinceRepository;

    private static final String OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";
    private static final int TIMEOUT_MS = 60000; // 60 giây timeout

    // Chỉ cho phép import cho 3 provinces: Da Nang (3), Hue (4), Quang Nam (6)
    private static final Set<Long> ALLOWED_PROVINCE_IDS = Set.of(3L, 4L, 6L);

    // Mapping giữa provinceId và cityName
    private static final Map<Long, String> PROVINCE_CITY_MAPPING = Map.ofEntries(
            Map.entry(3L, "Da Nang"),
            Map.entry(4L, "Hue"),
            Map.entry(6L, "Hoi An")
    );

    /**
     * Import Hotels từ OpenStreetMap
     * Query OSM: tourism=hotel
     */
    @Transactional
    public int importHotelsFromOSM(String cityName, Long provinceId) {
        try {
            log.info("Starting hotel import from OSM for city: {}", cityName);

            ProvinceEntity province = provinceRepository.findById(provinceId)
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + provinceId));

            String query = buildOverpassQuery(cityName, "tourism=hotel");
            String osmData = callOverpassAPI(query);

            List<HotelEntity> hotels = parseHotelsFromOSM(osmData, province);
            hotelRepository.saveAll(hotels);

            log.info("Successfully imported {} hotels", hotels.size());
            return hotels.size();
        } catch (Exception e) {
            log.error("Error importing hotels from OSM", e);
            throw new RuntimeException("Failed to import hotels: " + e.getMessage());
        }
    }

    /**
     * Import Restaurants từ OpenStreetMap
     * Query OSM: amenity=restaurant
     */
    @Transactional
    public int importRestaurantsFromOSM(String cityName, Long provinceId) {
        try {
            log.info("Starting restaurant import from OSM for city: {}", cityName);

            ProvinceEntity province = provinceRepository.findById(provinceId)
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + provinceId));

            String query = buildOverpassQuery(cityName, "amenity=restaurant");
            String osmData = callOverpassAPI(query);

            List<RestaurantEntity> restaurants = parseRestaurantsFromOSM(osmData, province);
            restaurantRepository.saveAll(restaurants);

            log.info("Successfully imported {} restaurants", restaurants.size());
            return restaurants.size();
        } catch (Exception e) {
            log.error("Error importing restaurants from OSM", e);
            throw new RuntimeException("Failed to import restaurants: " + e.getMessage());
        }
    }

    /**
     * Import Attractions từ OpenStreetMap
     * Query OSM: tourism=attraction, tourism=museum, tourism=viewpoint, etc.
     */
    @Transactional
    public int importAttractionsFromOSM(String cityName, Long provinceId) {
        try {
            validateProvinceId(provinceId);

            ProvinceEntity province = provinceRepository.findById(provinceId)
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + provinceId));

            // Lấy nhiều loại attraction
            List<AttractionEntity> attractions = new ArrayList<>();

            String[] attractionTypes = {
                    "tourism=attraction",
                    "tourism=museum",
                    "tourism=viewpoint",
                    "tourism=monument",
                    "historic=monument"
            };

            for (String type : attractionTypes) {
                String query = buildOverpassQuery(cityName, type);
                String osmData = callOverpassAPI(query);
                attractions.addAll(parseAttractionsFromOSM(osmData, province));
            }

            attractionRepository.saveAll(attractions);

            log.info("Successfully imported {} attractions", attractions.size());
            return attractions.size();
        } catch (Exception e) {
            log.error("Error importing attractions from OSM", e);
            throw new RuntimeException("Failed to import attractions: " + e.getMessage());
        }
    }

    /**
     * Validate provincId - chỉ cho phép 3 provinces: Da Nang (3), Hue (4), Quang Nam (6)
     */
    private void validateProvinceId(Long provinceId) {
        if (!ALLOWED_PROVINCE_IDS.contains(provinceId)) {
            throw new RuntimeException(
                    String.format("Invalid province ID: %d. Only allowed provinces are: Da Nang (3), Hue (4), Quang Nam (6)", provinceId)
            );
        }
    }

    // Bounding box cho 3 cities
    private static final Map<String, double[]> CITY_COORDINATES = Map.ofEntries(
            Map.entry("Da Nang", new double[]{16.0735, 108.2007}),        // latitude, longitude
            Map.entry("Hue", new double[]{16.4637, 107.5909}),
            Map.entry("Hoi An", new double[]{15.8801, 108.3289})
    );

    /**
     * Xây dựng Overpass QL query - Sử dụng bbox
     */
    /**
     * Xây dựng Overpass QL query - Sử dụng bbox chuẩn định dạng quốc tế
     */
    private String buildOverpassQuery(String cityName, String tag) {
        String[] parts = tag.split("=");
        if (parts.length != 2) {
            throw new RuntimeException("Invalid tag format: " + tag);
        }

        String key = parts[0].trim();
        String value = parts[1].trim();

        // Lấy coordinates của city - Trim để tránh lỗi khoảng trắng từ Postman
        double[] coords = CITY_COORDINATES.get(cityName.trim());
        if (coords == null) {
            log.warn("City '{}' not found, using Da Nang as default", cityName);
            coords = new double[]{16.0735, 108.2007};
        }

        double lat = coords[0];
        double lon = coords[1];

        // Thu hẹp delta xuống 0.1 (~11km) để chính xác và nhẹ server hơn
        double delta = 0.1;
        double south = lat - delta;
        double north = lat + delta;
        double west = lon - delta;
        double east = lon + delta;

        // SỬA QUAN TRỌNG: Dùng Locale.US để ép định dạng số thực dùng dấu chấm (.)
        // Thêm [timeout:60] và tìm cả node, way, relation để đầy đủ dữ liệu
        String query = String.format(java.util.Locale.US,
                "[out:json][timeout:60];(" +
                        "node[\"%s\"=\"%s\"](%.4f,%.4f,%.4f,%.4f);" +
                        "way[\"%s\"=\"%s\"](%.4f,%.4f,%.4f,%.4f);" +
                        "relation[\"%s\"=\"%s\"](%.4f,%.4f,%.4f,%.4f);" +
                        ");out body center;",
                key, value, south, west, north, east,
                key, value, south, west, north, east,
                key, value, south, west, north, east
        );

        log.info("Built Query for {}: {}", cityName, query);
        return query;
    }

    /**
     * Gọi Overpass API - POST request với retry logic
     */
    private String callOverpassAPI(String query) throws IOException {
        log.info("Calling Overpass API with query: {}", query);

        // Gửi query RAW (không URLEncode!) - Overpass sẽ parse correctly
        String postData = query;
        log.debug("POST body (raw): {}", postData);

        byte[] postDataBytes = postData.getBytes(StandardCharsets.UTF_8);

        int maxRetries = 3;
        int retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                URL url = new URL(OVERPASS_API_URL);
                java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                // Gửi raw query - không phải form-urlencoded
                conn.setRequestProperty("Content-Type", "text/plain; charset=utf-8");
                conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
                conn.setRequestProperty("User-Agent", "LocalGoAI/1.0");
                conn.setConnectTimeout(TIMEOUT_MS);
                conn.setReadTimeout(TIMEOUT_MS);
                conn.setDoOutput(true);

                // Gửi POST body
                try (java.io.OutputStream os = conn.getOutputStream()) {
                    os.write(postDataBytes);
                    os.flush();
                }

                // Đọc response
                int responseCode = conn.getResponseCode();
                log.info("Overpass API response code: {}", responseCode);

                InputStream inputStream;
                if (responseCode >= 400) {
                    inputStream = conn.getErrorStream();
                    if (inputStream == null) {
                        conn.disconnect();
                        if (responseCode == 429 && retryCount < maxRetries - 1) {
                            log.warn("Rate limited by Overpass API (429), retrying in 5 seconds... (attempt {}/{})",
                                    retryCount + 1, maxRetries);
                            Thread.sleep(5000);
                            retryCount++;
                            continue;
                        }
                        throw new IOException("HTTP " + responseCode + " - No error stream available");
                    }
                } else {
                    inputStream = conn.getInputStream();
                }

                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                conn.disconnect();

                if (responseCode >= 400) {
                    String errorMsg = response.toString();
                    log.error("Overpass API error response: {}", errorMsg);
                    throw new IOException("Overpass API HTTP " + responseCode + ": " + errorMsg);
                }

                log.debug("Overpass API response length: {} bytes", response.length());
                return response.toString();

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IOException("Interrupted while waiting for retry", e);
            } catch (IOException e) {
                retryCount++;
                if (retryCount >= maxRetries) {
                    log.error("Failed after {} retries: {}", maxRetries, e.getMessage());
                    throw e;
                }
                log.warn("Overpass API call failed, retrying... (attempt {}/{})", retryCount, maxRetries);
                try {
                    Thread.sleep(3000 * retryCount); // Exponential backoff
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new IOException("Interrupted during retry", ie);
                }
            }
        }

        throw new IOException("Failed to call Overpass API after " + maxRetries + " attempts");
    }

    /**
     * Parse Hotels từ OSM JSON response
     */
    private List<HotelEntity> parseHotelsFromOSM(String jsonData, ProvinceEntity province) throws Exception {
        List<HotelEntity> hotels = new ArrayList<>();
        JsonNode root = objectMapper.readTree(jsonData);
        JsonNode elements = root.get("elements");

        if (elements != null && elements.isArray()) {
            for (JsonNode element : elements) {
                if (element.has("tags")) {
                    JsonNode tags = element.get("tags");
                    HotelEntity hotel = new HotelEntity();

                    // Thông tin cơ bản
                    String name = getTagValue(tags, "name", "Unknown Hotel");
                    hotel.setName(name);
                    hotel.setPhone(getTagValue(tags, "phone", null));
                    hotel.setWebsite(getTagValue(tags, "website", null));
//                    hotel.setAddressDetailed(buildAddress(tags));
                    hotel.setOpeningHours(getTagValue(tags, "opening_hours", null));

                    String rawAddress = buildAddress(tags);
                    if (rawAddress == null || rawAddress.trim().isEmpty() || rawAddress.equals("null")) {
                        // Nếu buildAddress trả về rác hoặc null, hãy gán tên cụ thể:
                        // Ví dụ: "Mường Thanh Hotel, Da Nang"
                        hotel.setAddressDetailed(name + ", " + province.getName());
                    } else {
                        hotel.setAddressDetailed(rawAddress);
                    }

                    // Tọa độ
                    if (element.has("lat") && element.has("lon")) {
                        hotel.setLatitude(element.get("lat").asDouble());
                        hotel.setLongitude(element.get("lon").asDouble());
                    }


                    // Vị trí
                    hotel.setLocation(generateLocation(hotel.getLatitude(), hotel.getLongitude()));
                    hotel.setProvince(province);

                    // Phân loại hotel
                    hotel.setCategory(determineHotelType(tags));

                    // Mặc định
                    hotel.setStatus("ACTIVE");
                    hotel.setDescription("Imported from OpenStreetMap");
                    hotel.setRating(0.0);
                    hotel.setReviewCount(0);
                    hotel.setViewCount(0);
                    hotel.setBookmarkCount(0);
                    hotel.setBookingCount(0);

                    hotels.add(hotel);
                }
            }
        }

        return hotels;
    }

    /**
     * Parse Restaurants từ OSM JSON response
     */
    private List<RestaurantEntity> parseRestaurantsFromOSM(String jsonData, ProvinceEntity province) throws Exception {
        List<RestaurantEntity> restaurants = new ArrayList<>();
        JsonNode root = objectMapper.readTree(jsonData);
        JsonNode elements = root.get("elements");

        if (elements != null && elements.isArray()) {
            for (JsonNode element : elements) {
                if (element.has("tags")) {
                    JsonNode tags = element.get("tags");
                    RestaurantEntity restaurant = new RestaurantEntity();

                    // Thông tin cơ bản
                    String name = getTagValue(tags, "name", "Unknown Restaurant");
                    restaurant.setName(name);
                    restaurant.setPhone(getTagValue(tags, "phone", null));
                    restaurant.setWebsite(getTagValue(tags, "website", null));
//                    restaurant.setAddressDetailed(buildAddress(tags));
                    restaurant.setOpeningHours(getTagValue(tags, "opening_hours", null));

                    String rawAddress = buildAddress(tags);
                    if (rawAddress == null || rawAddress.trim().isEmpty() || rawAddress.equals("null")) {
                        // Nếu buildAddress trả về rác hoặc null, hãy gán tên cụ thể:
                        // Ví dụ: "Mường Thanh Hotel, Da Nang"
                        restaurant.setAddressDetailed(name + ", " + province.getName());
                    } else {
                        restaurant.setAddressDetailed(rawAddress);
                    }


                    // Tọa độ
                    if (element.has("lat") && element.has("lon")) {
                        restaurant.setLatitude(element.get("lat").asDouble());
                        restaurant.setLongitude(element.get("lon").asDouble());
                    }

                    // Vị trí
                    restaurant.setLocation(generateLocation(restaurant.getLatitude(), restaurant.getLongitude()));
                    restaurant.setProvince(province);

                    // Phân loại nhà hàng
                    restaurant.setCategory(determineRestaurantCuisine(tags));

                    // Mặc định
                    restaurant.setStatus("ACTIVE");
                    restaurant.setDescription("Imported from OpenStreetMap");
                    restaurant.setRating(0.0);
                    restaurant.setReviewCount(0);
                    restaurant.setViewCount(0);
                    restaurant.setBookmarkCount(0);
                    restaurant.setBookingCount(0);

                    restaurants.add(restaurant);
                }
            }
        }

        return restaurants;
    }

    /**
     * Parse Attractions từ OSM JSON response
     */
    private List<AttractionEntity> parseAttractionsFromOSM(String jsonData, ProvinceEntity province) throws Exception {
        List<AttractionEntity> attractions = new ArrayList<>();
        JsonNode root = objectMapper.readTree(jsonData);
        JsonNode elements = root.get("elements");

        if (elements != null && elements.isArray()) {
            for (JsonNode element : elements) {
                if (element.has("tags")) {
                    JsonNode tags = element.get("tags");
                    AttractionEntity attraction = new AttractionEntity();

                    // Thông tin cơ bản
                    String name = getTagValue(tags, "name", "Unknown Attraction");
                    attraction.setName(name);
                    attraction.setPhone(getTagValue(tags, "phone", null));
                    attraction.setWebsite(getTagValue(tags, "website", null));
//                    attraction.setAddressDetailed(buildAddress(tags));
                    attraction.setOpeningHours(getTagValue(tags, "opening_hours", null));


                    String rawAddress = buildAddress(tags);
                    if (rawAddress == null || rawAddress.trim().isEmpty() || rawAddress.equals("null")) {
                        // Nếu buildAddress trả về rác hoặc null, hãy gán tên cụ thể:
                        attraction.setAddressDetailed(name + ", " + province.getName());
                    } else {
                        attraction.setAddressDetailed(rawAddress);
                    }

                    // Tọa độ
                    if (element.has("lat") && element.has("lon")) {
                        attraction.setLatitude(element.get("lat").asDouble());
                        attraction.setLongitude(element.get("lon").asDouble());
                    }

                    // Vị trí
                    attraction.setLocation(generateLocation(attraction.getLatitude(), attraction.getLongitude()));
                    attraction.setProvince(province);

                    // Phân loại điểm tham quan
                    attraction.setCategory(determineAttractionCategory(tags));

                    // Mặc định
                    attraction.setStatus("ACTIVE");
                    attraction.setDescription("Imported from OpenStreetMap");
                    attraction.setRating(0.0);
                    attraction.setReviewCount(0);
                    attraction.setViewCount(0);
                    attraction.setBookmarkCount(0);
                    attraction.setBookingCount(0);

                    attractions.add(attraction);
                }
            }
        }

        return attractions;
    }

    /**
     * Lấy tag value từ OSM
     */
    private String getTagValue(JsonNode tags, String key, String defaultValue) {
        JsonNode value = tags.get(key);
        return value != null ? value.asText() : defaultValue;
    }

    /**
     * Xây dựng địa chỉ từ các thành phần OSM address tags
     * Ghép các trường: housenumber + street, district, city, postcode
     */
    private String buildAddress(JsonNode tags) {
        List<String> addressParts = new ArrayList<>();

        // 1. Thử lấy addr:full hoặc address (OSM đôi khi dùng key khác nhau)
        String fullAddr = getTagValue(tags, "addr:full", getTagValue(tags, "address", null));
        if (fullAddr != null && !fullAddr.trim().isEmpty()) {
            return fullAddr;
        }

        // 2. Thu thập tất cả các phần có thể có
        String housenumber = getTagValue(tags, "addr:housenumber", null);
        String street = getTagValue(tags, "addr:street", null);
        String hamlet = getTagValue(tags, "addr:hamlet", null); // Thôn, xóm
        String ward = getTagValue(tags, "addr:ward", null);     // Phường, xã
        String district = getTagValue(tags, "addr:district", getTagValue(tags, "addr:suburb", null));
        String city = getTagValue(tags, "addr:city", getTagValue(tags, "addr:province", null));

        // Ghép số nhà và đường
        StringBuilder streetInfo = new StringBuilder();
        if (housenumber != null) streetInfo.append(housenumber).append(" ");
        if (street != null) streetInfo.append(street);
        if (streetInfo.length() > 0) addressParts.add(streetInfo.toString().trim());

        // Thêm các cấp hành chính nếu có
        if (hamlet != null) addressParts.add(hamlet);
        if (ward != null) addressParts.add(ward);
        if (district != null) addressParts.add(district);
        if (city != null) addressParts.add(city);

        // 3. Nếu vẫn không có gì, hãy lấy ít nhất là tên đường hoặc khu vực từ tag 'place' hoặc 'locality'
        if (addressParts.isEmpty()) {
            String place = getTagValue(tags, "place", null);
            if (place != null) addressParts.add(place);
        }

        if (addressParts.isEmpty()) return null;

        return String.join(", ", addressParts);
    }

    /**
     * Phân loại hotel dựa trên tags
     */
    private HotelType determineHotelType(JsonNode tags) {
        String stars = getTagValue(tags, "stars", "");
        String hotelType = getTagValue(tags, "hotel", "");

        try {
            int starCount = Integer.parseInt(stars);
            if (starCount >= 5) return HotelType.LUXURY;
            if (starCount >= 4) return HotelType.BUSINESS;
            if (starCount >= 2) return HotelType.BUDGET;
        } catch (NumberFormatException e) {
            log.debug("Could not parse stars: {}", stars);
        }

        if ("resort".equalsIgnoreCase(hotelType)) return HotelType.RESORT;
        if ("villa".equalsIgnoreCase(hotelType)) return HotelType.VILLA;
        if ("homestay".equalsIgnoreCase(hotelType)) return HotelType.HOMESTAY;

        return HotelType.BUSINESS; // Default
    }

    /**
     * Phân loại nhà hàng dựa trên tags
     */
    private RestaurantCuisine determineRestaurantCuisine(JsonNode tags) {
        String cuisine = getTagValue(tags, "cuisine", "");

        if (cuisine.contains("vietnamese")) return RestaurantCuisine.VIETNAMESE;
        if (cuisine.contains("seafood")) return RestaurantCuisine.SEAFOOD;
        if (cuisine.contains("dessert") || cuisine.contains("cafe")) return RestaurantCuisine.DESSERT;
        if (cuisine.contains("western") || cuisine.contains("european")) return RestaurantCuisine.WESTERN;
        if (cuisine.contains("asian")) return RestaurantCuisine.ASIAN;
        if (cuisine.contains("vegetarian")) return RestaurantCuisine.VEGETARIAN;

        return RestaurantCuisine.VIETNAMESE; // Default
    }

    /**
     * Phân loại điểm tham quan dựa trên tags
     */
    private AttractionCategory determineAttractionCategory(JsonNode tags) {
        String tourism = getTagValue(tags, "tourism", "");
        String historic = getTagValue(tags, "historic", "");
        String natural = getTagValue(tags, "natural", "");
        String leisure = getTagValue(tags, "leisure", "");

        if ("museum".equalsIgnoreCase(tourism) || "monument".equalsIgnoreCase(historic))
            return AttractionCategory.CULTURE;
        if (natural.length() > 0)
            return AttractionCategory.NATURE;
        if ("viewpoint".equalsIgnoreCase(tourism))
            return AttractionCategory.ATTRACTION;
        if (leisure.length() > 0)
            return AttractionCategory.RELAX;

        return AttractionCategory.ATTRACTION; // Default
    }

    /**
     * Sinh thị trường vị trí từ tọa độ
     */
    private String generateLocation(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return "Unknown Location";
        }
        return String.format("%.6f, %.6f", latitude, longitude);
    }
}
