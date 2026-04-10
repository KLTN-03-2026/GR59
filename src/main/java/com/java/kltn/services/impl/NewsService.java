package com.java.kltn.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsService {

    // In-memory storage for news
    private final Map<Long, Map<String, Object>> news = Collections.synchronizedMap(new HashMap<>());
    private final Map<String, List<Long>> categories = Collections.synchronizedMap(new HashMap<>());
    private Long nextNewsId = 1L;

    public List<Map<String, Object>> getAllNews(int skip, int limit, String sortBy) {
        List<Map<String, Object>> allNews = new ArrayList<>(news.values());
        
        if (sortBy != null && "date".equals(sortBy)) {
            allNews.sort((a, b) -> {
                Object dateA = a.get("date");
                Object dateB = b.get("date");
                if (dateA instanceof String && dateB instanceof String) {
                    return ((String) dateB).compareTo((String) dateA);
                }
                return 0;
            });
        }
        
        int end = Math.min(skip + limit, allNews.size());
        return allNews.subList(skip, end);
    }

    public List<Map<String, Object>> getFeaturedNews(int limit) {
        return news.values().stream()
                .filter(n -> n.get("isFeatured") == Boolean.TRUE)
                .limit(limit)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getNewsDetail(Long newsId) {
        return news.getOrDefault(newsId, new HashMap<>());
    }

    public List<Map<String, Object>> getNewsByCategory(String category, int skip, int limit) {
        List<Long> newsIds = categories.getOrDefault(category, new ArrayList<>());
        List<Map<String, Object>> categoryNews = newsIds.stream()
                .map(id -> news.get(id))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        
        int end = Math.min(skip + limit, categoryNews.size());
        return categoryNews.subList(skip, end);
    }

    public List<Map<String, Object>> searchNews(String keyword, int skip, int limit) {
        List<Map<String, Object>> results = news.values().stream()
                .filter(n -> {
                    String title = (String) n.get("title");
                    String excerpt = (String) n.get("excerpt");
                    return (title != null && title.toLowerCase().contains(keyword.toLowerCase())) ||
                           (excerpt != null && excerpt.toLowerCase().contains(keyword.toLowerCase()));
                })
                .collect(Collectors.toList());
        
        int end = Math.min(skip + limit, results.size());
        return results.subList(skip, end);
    }

    public List<Map<String, Object>> getRelatedNews(Long newsId, int limit) {
        Map<String, Object> targetNews = news.get(newsId);
        if (targetNews == null) return new ArrayList<>();
        
        String category = (String) targetNews.get("category");
        if (category == null) return new ArrayList<>();
        
        List<Long> categoryNewsIds = categories.getOrDefault(category, new ArrayList<>());
        return categoryNewsIds.stream()
                .filter(id -> !id.equals(newsId))
                .map(id -> news.get(id))
                .filter(Objects::nonNull)
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createNews(Map<String, Object> request) {
        Long newsId = nextNewsId++;
        
        Map<String, Object> newsItem = new HashMap<>(request);
        newsItem.put("id", newsId);
        newsItem.put("date", LocalDateTime.now().toString());
        newsItem.put("views", 0);
        newsItem.put("likes", 0);
        
        String category = (String) newsItem.get("category");
        if (category != null) {
            categories.computeIfAbsent(category, k -> new ArrayList<>()).add(newsId);
        }
        
        news.put(newsId, newsItem);
        return newsItem;
    }

    @Transactional
    public Map<String, Object> updateNews(Long newsId, Map<String, Object> request) {
        Map<String, Object> newsItem = news.get(newsId);
        if (newsItem != null) {
            newsItem.putAll(request);
            news.put(newsId, newsItem);
        }
        return newsItem;
    }

    @Transactional
    public void deleteNews(Long newsId) {
        Map<String, Object> newsItem = news.get(newsId);
        if (newsItem != null) {
            String category = (String) newsItem.get("category");
            if (category != null) {
                List<Long> categoryIds = categories.get(category);
                if (categoryIds != null) {
                    categoryIds.remove(newsId);
                }
            }
        }
        news.remove(newsId);
    }

    public List<Map<String, Object>> getNewsCategories() {
        return categories.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> catMap = new HashMap<>();
                    catMap.put("name", entry.getKey());
                    catMap.put("slug", entry.getKey().toLowerCase().replace(" ", "-"));
                    catMap.put("count", entry.getValue().size());
                    return catMap;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createNewsCategory(Map<String, String> request) {
        String name = request.get("name");
        String icon = request.get("icon");
        
        Map<String, Object> category = new HashMap<>();
        category.put("name", name);
        category.put("slug", name.toLowerCase().replace(" ", "-"));
        category.put("icon", icon);
        category.put("count", 0);
        
        categories.putIfAbsent(name, new ArrayList<>());
        return category;
    }
}
