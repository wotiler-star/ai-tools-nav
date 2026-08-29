# 后端：Spring Boot 多模块生产镜像
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

# 先拷贝 pom，利用 Docker 缓存依赖层
COPY pom.xml .
COPY ai-nav-common ./ai-nav-common
COPY ai-nav-web ./ai-nav-web
# 注入阿里云 Maven 镜像（避免腾讯云首尔节点到 Maven Central 的下载被污染）
COPY settings.xml /root/.m2/settings.xml
RUN mvn -B -q clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
# 默认 prod profile：MySQL + Redis + 查询缓存
COPY --from=builder /build/ai-nav-web/target/ai-nav-web.jar app.jar
EXPOSE 8123
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.profiles.active=prod"]
