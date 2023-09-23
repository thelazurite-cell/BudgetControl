FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["Mettle.Backend/Mettle.Dms.Backend.Api/Mettle.Dms.Backend.Api.csproj", "Mettle.Backend/Mettle.Dms.Backend.Api/"]
RUN dotnet restore "Mettle.Backend/Mettle.Dms.Backend.Api/Mettle.Dms.Backend.Api.csproj"
COPY . .
WORKDIR "/src/Mettle.Backend/Mettle.Dms.Backend.Api"
RUN dotnet build "Mettle.Dms.Backend.Api.csproj" -c $configuration -o /app/build.

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "Mettle.Dms.Backend.Api.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
ARG PASSWORD_ENV_SEEDED
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
RUN openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout app_key.pem -out app_cert.pem -subj "/CN=localhost" -days 3650
RUN openssl pkcs8 -inform PEM -topk8 -nocrypt -in app_key.pem -out app_key2.pem
RUN cp app_cert.pem /usr/local/share/ca-certificates/
RUN cp app_key2.pem /usr/local/share/ca-certificates/
# RUN cat app_cert.pem && cat app_key2.pem &&  exit -1
RUN chmod 644 /usr/local/share/ca-certificates/app_cert.pem && chmod 644 /usr/local/share/ca-certificates/app_key2.pem
RUN update-ca-certificates

ENV ASPNETCORE_ENVIRONMENT=Development
# ENV ASPNETCORE_Kestrel__Certificates__Default__Password=""
# ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/usr/local/share/ca-certificates/app_cert.pem
# ENV ASPNETCORE_Kestrel__Certificates__Default__KeyPath=/usr/local/share/ca-certificates/app_key2.pem

COPY --from=publish /app/publish .
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
RUN chown appuser /usr/local/share/ca-certificates/app_cert.pem && chown appuser /usr/local/share/ca-certificates/app_key2.pem
USER appuser
ENV ASPNETCORE_URLS=https://+:5001;http://+:5000
ENTRYPOINT ["dotnet", "Mettle.Dms.Backend.Api.dll", "--server.urls", "http://+:5000;https://+:5001"]
