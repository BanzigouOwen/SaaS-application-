FROM golang:1.20-alpine as builder

WORKDIR /app
COPY go.* .
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o collector .

FROM alpine:latest
RUN apk --no-cache add ca-certificates net-tools openssh-client

WORKDIR /app
COPY --from=builder /app/collector .

ENV COLLECTOR_TOKEN=""
ENV VPN_ENDPOINT="api.netpulse-omni.com:51820"

ENTRYPOINT ["./collector"]