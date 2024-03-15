storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

ui = true

# Mécanisme d'authentification par token
auth "token" {
  # Configurer le token d'accès root comme token par défaut
  default_lease_ttl = "0"
  max_lease_ttl     = "0"

  # Liste des rôles autorisés à utiliser ce mécanisme d'authentification
  roles {
    role_name = "root"
    allowed_policies = "*"
  }
}
