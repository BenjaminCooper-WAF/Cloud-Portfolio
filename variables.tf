variable "aws_region" {
  description = "AWS region for the S3 bucket and supporting resources."
  type        = string
  default     = "eu-west-2"
}

variable "project_name" {
  description = "Short lowercase project name used in resource names."
  type        = string
  default     = "benjamin-cloud-portfolio"
}

variable "domain_name" {
  description = "Root domain, for example benjamincloud.dev."
  type        = string
}

variable "www_domain_name" {
  description = "Website hostname, for example www.benjamincloud.dev."
  type        = string
}

variable "route53_zone_id" {
  description = "Existing Route 53 hosted zone ID for the root domain."
  type        = string
}

variable "github_owner" {
  description = "GitHub username or organisation that owns the repository."
  type        = string
}

variable "github_repository" {
  description = "GitHub repository name."
  type        = string
  default     = "benjamin-cloud-portfolio"
}

variable "create_github_oidc_provider" {
  description = "Set false if the GitHub Actions OIDC provider already exists in this AWS account."
  type        = bool
  default     = true
}
