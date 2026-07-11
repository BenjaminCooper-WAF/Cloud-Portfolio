output "website_url" {
  description = "Public HTTPS URL for the portfolio."
  value       = "https://${var.domain_name}"
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "s3_bucket_name" {
  value = aws_s3_bucket.site.bucket
}

output "github_actions_role_arn" {
  value = aws_iam_role.github_deploy.arn
}
