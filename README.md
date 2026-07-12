# ☁️ AWS Cloud Portfolio

Welcome to my personal cloud engineering portfolio.

This project isn't just a website—it's a demonstration of how I design, automate and deploy secure cloud infrastructure using AWS and Infrastructure as Code.

Rather than manually creating resources through the AWS Console, every part of this platform is deployed using Terraform and automatically published through GitHub Actions.

The goal was to build something that reflects how I would approach a real production deployment: secure, repeatable, automated and easy to maintain.

---

# Architecture

```
GitHub
    │
    ▼
GitHub Actions
    │
    ▼
Amazon S3 (Private)
    │
    ▼
CloudFront CDN
    │
    ▼
AWS Certificate Manager
    │
    ▼
Route 53
    │
    ▼
Custom Domain
```

The website itself is hosted in a **private S3 bucket**.

Users never access S3 directly. Instead, CloudFront securely retrieves the content using **Origin Access Control (OAC)** before serving it globally over HTTPS.

This improves both security and performance.

---

# Why I Built It This Way

I wanted this project to demonstrate cloud engineering best practices rather than simply hosting a static website.

Some of the key design decisions include:

- Infrastructure fully managed with Terraform
- Private S3 bucket with Block Public Access enabled
- CloudFront used as the public entry point
- HTTPS provided by AWS Certificate Manager
- DNS managed through Route 53
- Automated deployments using GitHub Actions
- IAM role assumption with GitHub OIDC instead of long-lived AWS access keys

This creates a deployment that is secure, repeatable and easy to update.

---

# Technologies Used

### AWS

- Amazon S3
- CloudFront
- Route 53
- ACM
- IAM
- OIDC

### Infrastructure as Code

- Terraform

### CI/CD

- GitHub Actions

### Languages

- HTML
- CSS
- JavaScript

---

# Getting Started

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/benjamin-cloud-portfolio.git

cd benjamin-cloud-portfolio
```

---

# Configure Terraform

Move into the Terraform directory

```bash
cd infrastructure/terraform
```

Copy the example variables file

```bash
cp terraform.tfvars.example terraform.tfvars
```

Update the values for:

- Domain name
- Route53 Hosted Zone ID
- GitHub username
- Repository name

---

# Deploy the Infrastructure

Initialise Terraform

```bash
terraform init
```

Validate the configuration

```bash
terraform validate
```

Review the execution plan

```bash
terraform plan
```

Deploy

```bash
terraform apply
```

CloudFront deployments and SSL certificate validation may take several minutes.

---

# Upload the Website

Once Terraform has finished, retrieve the outputs

```bash
terraform output
```

Upload the website

```bash
aws s3 sync site/ s3://YOUR_BUCKET_NAME --delete
```

Refresh the CloudFront cache

```bash
aws cloudfront create-invalidation \
--distribution-id YOUR_DISTRIBUTION_ID \
--paths "/*"
```

---

# Continuous Deployment

After the initial deployment, everything is automated.

Whenever I push changes to the **main** branch, GitHub Actions:

- Builds the project
- Uploads the updated files to Amazon S3
- Removes deleted files
- Invalidates the CloudFront cache
- Deploys the latest version worldwide

No manual uploads are required.

---

# Security

Security was an important consideration throughout this project.

Rather than exposing the S3 bucket publicly, I chose to:

- Keep the bucket private
- Use Origin Access Control
- Use HTTPS everywhere
- Enable encryption
- Use GitHub OIDC authentication
- Avoid storing long-lived AWS credentials

These are the same principles I'd apply when deploying production workloads.

---

# Future Improvements

Some enhancements I will be adding in the future include:

- Next.js migration
- Automated Lighthouse performance testing
- Terraform modules
- AWS WAF
- CloudWatch monitoring
- AWS Budgets alerts
- GitHub API integration to automatically display new projects
- Interactive architecture diagrams

---

# About Me

I'm an AWS Certified Solutions Architect with a passion for building secure, scalable and automated cloud infrastructure.

I'm currently focused on Cloud Engineering, Platform Engineering and DevOps, and I'm always looking for opportunities to improve my skills through hands-on projects like this one.

If you'd like to connect, feel free to reach out.

**LinkedIn**

https://linkedin.com/in/benjamin-cooper-46140b385

**GitHub**

https://github.com/BenjaminCooper-WAF

---

## Thank you for taking the time to explore my project.

If you're a recruiter, hiring manager or fellow engineer, I'd love to hear your feedback.
