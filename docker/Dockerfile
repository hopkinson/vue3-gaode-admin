FROM hub.onloch.com/centos/nginx:1.16.0

ARG build_data
ARG ver
LABEL build-date="${build_data}" \
    VERSION="${ver}" \
    MAINTAINER="kelvin<hospp1@qq.com>"

COPY ./release /var/nginx/html
COPY ./conf.d /etc/nginx/conf.d

ENV PORT="80"
ENV SERVICE_NAME="booking-service-web"
ENV BUILD_DATE="${build_data}"

WORKDIR /var/nginx/html

EXPOSE 80
