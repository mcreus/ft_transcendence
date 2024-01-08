# Dockerfile for ModSecurity
FROM vshn/modsecurity:3.1

# Copie du fichier de règles ModSecurity
# COPY modsecurity.conf /etc/nginx/modsecurity.conf

# Exposition du port 80 (ou tout autre port requis par votre application)
EXPOSE 80