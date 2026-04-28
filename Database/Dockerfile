FROM mysql:8.0

ENV MYSQL_DATABASE=valuecrop
ENV MYSQL_ROOT_PASSWORD=root

EXPOSE 3306

# Optional: Add initialization scripts
# COPY ./init.sql /docker-entrypoint-initdb.d/

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD mysqladmin ping -h localhost -uroot -proot || exit 1
