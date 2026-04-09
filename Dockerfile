# =============================================
# STAGE 1: BUILD - Dùng Maven để build file .jar
# =============================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml trước để tận dụng Docker layer cache
# (Chỉ re-download dependencies khi pom.xml thay đổi)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy toàn bộ source code rồi build
COPY src ./src
RUN mvn clean package -DskipTests -B

# =============================================
# STAGE 2: RUN - Chỉ cần JRE để chạy, không cần Maven
# =============================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Tạo user riêng, không chạy với root
RUN addgroup -S spring && adduser -S spring -G spring

# Tạo thư mục logs và phân quyền
RUN mkdir -p /app/logs && chown -R spring:spring /app/logs

# Copy file .jar từ stage build
COPY --from=builder /app/target/*.jar app.jar

# Chuyển sang user spring
USER spring:spring

# Expose port backend
EXPOSE 8888

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
