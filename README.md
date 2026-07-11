# Benjamin Cooper — AWS-Hosted Cloud Portfolio

This project deploys the portfolio using:

- Private Amazon S3 bucket
- Amazon CloudFront CDN
- AWS Certificate Manager HTTPS certificate
- Amazon Route 53 DNS records
- Terraform infrastructure
- GitHub Actions deployment using AWS OIDC

## Architecture

GitHub push → GitHub Actions → private S3 bucket → CloudFront → Route 53 custom domain

The S3 bucket is not public. CloudFront uses Origin Access Control to retrieve the website files.

## Prerequisites

Install:

- Git
- Terraform 1.6 or later
- AWS CLI
- An AWS account
- A domain with a public hosted zone in Route 53

Configure local AWS access for the initial infrastructure deployment:

```bash
aws configure
aws sts get-caller-identity
```

## 1. Add your CV

Place your CV in:

```text
site/Benjamin-Cooper-CV.pdf
```

## 2. Configure Terraform

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with:

- Your root domain
- Your `www` domain
- Route 53 hosted zone ID
- GitHub username
- Repository name

## 3. Deploy the AWS infrastructure

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan
terraform apply
```

CloudFront and certificate deployment can take several minutes.

## 4. Upload the website for the first time

Use the Terraform outputs:

```bash
terraform output
```

Then run:

```bash
aws s3 sync site/ s3://YOUR_BUCKET_NAME --delete --exclude "ADD-YOUR-CV-HERE.txt"

aws cloudfront create-invalidation   --distribution-id YOUR_DISTRIBUTION_ID   --paths "/*"
```

## 5. Connect GitHub Actions

Create a GitHub repository and push this project.

In **GitHub → Settings → Secrets and variables → Actions**, add:

### Repository secret

```text
AWS_DEPLOY_ROLE_ARN
```

Set it to the `github_actions_role_arn` Terraform output.

### Repository variables

```text
AWS_REGION
S3_BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID
```

Use the matching Terraform outputs. After that, every push to `main` that changes `site/` will automatically deploy the website.

## 6. Open the website

Terraform outputs the final address:

```bash
terraform output website_url
```

## Important

This package is ready for deployment, but it cannot deploy itself until you provide access to your AWS account, Route 53 hosted zone and chosen domain.
