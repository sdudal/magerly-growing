# Magerly Infrastructure

AWS CloudFormation infrastructure for the Magerly static website hosting - production-ready setup with S3, CloudFront, and Route 53.

## Architecture Overview

Production infrastructure stack optimized for static website hosting:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Route 53      │    │   CloudFront    │    │      S3         │
│   DNS Service   ├────┤   CDN/SSL/WAF   ├────┤ Static Hosting  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Components

- **S3 Bucket**: Static website hosting with encryption and versioning
- **CloudFront**: Global CDN with SSL termination and performance optimization
- **Route 53**: DNS management with health checks
- **ACM**: SSL certificate with automatic renewal
- **WAF**: Web Application Firewall for security
- **CloudWatch**: Monitoring, logging, and alerting
- **IAM**: Least-privilege deployment roles

## Directory Structure

```
infrastructure/
├── templates/
│   └── static-website.yaml     # CloudFormation template
├── parameters/
│   └── prod.json              # Production parameters
├── scripts/
│   └── deploy.sh              # Deployment script
└── README.md                  # This file
```

## Prerequisites

Before deploying, ensure you have:

1. **Unix-like environment**: Linux, macOS, or WSL on Windows
2. **AWS CLI** installed and configured
3. **Domain name** ready for DNS configuration
4. **AWS IAM permissions** for:
   - CloudFormation (full access)
   - S3 (full access)
   - CloudFront (full access)
   - Route 53 (full access)
   - Certificate Manager (full access)
   - IAM (for role management)
   - CloudWatch (for monitoring)

### Installation Help

If you need help installing these tools, see **[INSTALL.md](INSTALL.md)** for detailed setup instructions for:
- Windows (WSL, Git Bash, Docker options)
- macOS (Homebrew setup)
- Linux (Ubuntu, CentOS, etc.)

### Optional Tools

**jq** (JSON processor) - Enhances script output formatting but not required.

## Quick Start

### 1. Create Manual Resources

Before deploying the infrastructure, you need to manually create:

#### A. Route 53 Hosted Zone

```bash
# Create hosted zone for your domain
aws route53 create-hosted-zone \
  --name magerly.com \
  --caller-reference $(date +%s) \
  --hosted-zone-config Comment="Magerly production hosted zone"

# Note the HostedZone ID from the output
```

#### B. SSL Certificate in ACM

**Important**: Certificate must be created in **us-east-1** region for CloudFront.

```bash
# Create certificate (in us-east-1 region)
aws acm request-certificate \
  --domain-name magerly.com \
  --subject-alternative-names www.magerly.com \
  --validation-method DNS \
  --region us-east-1

# Note the CertificateArn from the output
```

#### C. Complete DNS Validation

1. **Get validation records**:
   ```bash
   aws acm describe-certificate \
     --certificate-arn YOUR_CERTIFICATE_ARN \
     --region us-east-1
   ```

2. **Add CNAME records** to your hosted zone for certificate validation

3. **Update domain nameservers** to point to Route 53 nameservers

4. **Wait for validation** (can take 5-30 minutes)

### 2. Configure Parameters

Edit `parameters/prod.json` with your domain, email, and the ARNs from step 1:

```json
[
  {
    "ParameterKey": "DomainName",
    "ParameterValue": "your-domain.com"
  },
  {
    "ParameterKey": "AlertEmail", 
    "ParameterValue": "your-email@example.com"
  },
  {
    "ParameterKey": "SSLCertificateArn",
    "ParameterValue": "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
  },
  {
    "ParameterKey": "HostedZoneId",
    "ParameterValue": "Z1D633PJN98FT9"
  }
]
```

### 2. Deploy Infrastructure

```bash
# Make script executable
chmod +x infrastructure/scripts/deploy.sh

# Validate template
./infrastructure/scripts/deploy.sh validate

# Deploy infrastructure (first time)
./infrastructure/scripts/deploy.sh deploy
```

⏱️ **Initial deployment takes 10-15 minutes** due to CloudFront distribution creation.

### 3. Deploy Website

```bash
# Build the website
npm run build

# Deploy files to S3 and invalidate CloudFront
./infrastructure/scripts/deploy.sh sync
```

## Available Commands

All commands use the deployment script:

```bash
./infrastructure/scripts/deploy.sh [action]
```

### Infrastructure Management

```bash
# Validate CloudFormation template
./infrastructure/scripts/deploy.sh validate

# Deploy new infrastructure
./infrastructure/scripts/deploy.sh deploy

# Update existing infrastructure  
./infrastructure/scripts/deploy.sh update

# Show infrastructure status and resources
./infrastructure/scripts/deploy.sh status

# Show stack outputs (URLs, bucket names, etc.)
./infrastructure/scripts/deploy.sh outputs

# Delete infrastructure (with confirmation)
./infrastructure/scripts/deploy.sh delete
```

### Website Deployment

```bash
# Deploy website files to S3 and invalidate CloudFront
./infrastructure/scripts/deploy.sh sync
```

### Troubleshooting & Help

```bash
# Show all available commands
./infrastructure/scripts/deploy.sh help

# Debug path issues (useful for WSL troubleshooting)
./infrastructure/scripts/deploy.sh debug
```

## Stack Outputs

After successful deployment, the following outputs are available:

- **BucketName**: S3 bucket name for website files
- **CloudFrontDistributionId**: For cache invalidation
- **CloudFrontDomainName**: CDN endpoint URL
- **WebsiteURL**: Final website URL (your domain)
- **SSLCertificateArn**: SSL certificate ARN
- **DeploymentRoleArn**: IAM role for CI/CD
- **Route53HostedZoneId**: DNS hosted zone ID

View outputs:
```bash
./infrastructure/scripts/deploy.sh outputs
```

## Security Features

- ✅ **HTTPS Enforcement**: All traffic redirected to HTTPS
- ✅ **WAF Protection**: AWS managed security rules
- ✅ **Access Controls**: S3 bucket not publicly accessible
- ✅ **Encryption**: S3 server-side encryption enabled
- ✅ **Least Privilege**: IAM roles with minimal permissions
- ✅ **Origin Access Control**: Secure S3-CloudFront integration

## Performance Features

- ✅ **Global CDN**: CloudFront edge locations worldwide
- ✅ **HTTP/2 & HTTP/3**: Modern protocol support
- ✅ **Compression**: Gzip/Brotli for all text assets
- ✅ **Smart Caching**: Optimized TTL for different file types
- ✅ **Edge Optimizations**: Security headers and performance policies

## Monitoring & Alerting

- ✅ **CloudWatch Alarms**: High error rate detection
- ✅ **SNS Notifications**: Email alerts for issues
- ✅ **Access Logging**: CloudFront request logs in S3
- ✅ **Cost Monitoring**: Budget alerts available

## Domain Setup

After infrastructure deployment:

1. **Update Name Servers**: Point your domain to the Route 53 name servers
2. **DNS Propagation**: Wait 24-48 hours for global DNS propagation
3. **SSL Certificate**: Automatic validation via DNS records

Get Route 53 name servers:
```bash
aws route53 get-hosted-zone --id $(./infrastructure/scripts/deploy.sh outputs | grep HostedZoneId | awk '{print $4}')
```

## Workflow

### Initial Setup
```bash
# 1. Deploy infrastructure
./infrastructure/scripts/deploy.sh deploy

# 2. Update domain name servers to Route 53
# 3. Wait for DNS propagation

# 4. Build and deploy website
npm run build
./infrastructure/scripts/deploy.sh sync
```

### Regular Updates
```bash
# Update infrastructure
./infrastructure/scripts/deploy.sh update

# Deploy website changes
npm run build
./infrastructure/scripts/deploy.sh sync
```

## Troubleshooting

### Common Issues

**Template validation fails:**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Validate specific template
aws cloudformation validate-template --template-body file://infrastructure/templates/static-website.yaml
```

**Stack deployment fails:**
```bash
# Check stack events
aws cloudformation describe-stack-events --stack-name magerly-static-website

# Check current status
./infrastructure/scripts/deploy.sh status
```

**Certificate validation stuck:**
- Ensure domain name servers point to Route 53
- Check DNS propagation: `dig your-domain.com NS`
- Verify certificate status in AWS Console

**Website not updating:**
```bash
# Create CloudFront invalidation
./infrastructure/scripts/deploy.sh sync

# Check if files are in S3
aws s3 ls s3://your-bucket-name --recursive
```

### Logs and Monitoring

```bash
# View CloudFormation events
aws cloudformation describe-stack-events --stack-name magerly-static-website

# View CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix /aws/magerly

# Check CloudFront error rates
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name 4xxErrorRate \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

## Cost Optimization

Monthly cost estimate: **$15-50** depending on traffic

- **S3**: ~$1-5 (storage and requests)
- **CloudFront**: ~$5-20 (data transfer)
- **Route 53**: ~$0.50 (hosted zone)
- **Certificate Manager**: Free
- **CloudWatch**: ~$2-5 (basic monitoring)

Cost optimization features:
- PriceClass_100 (North America + Europe only)
- Lifecycle policies for logs
- Efficient caching strategies

## CI/CD Integration

GitHub Actions integration:

```yaml
# .github/workflows/deploy.yml
- name: Deploy Infrastructure
  run: ./infrastructure/scripts/deploy.sh update

- name: Build Website
  run: npm run build

- name: Deploy Website
  run: ./infrastructure/scripts/deploy.sh sync
```

## Support

For infrastructure issues:

1. Check AWS CloudFormation console for detailed error messages
2. Review IAM permissions and AWS service limits
3. Verify domain configuration and DNS propagation
4. Check the script output for specific error details

---

**🚀 Ready for Production**: This infrastructure is production-ready with enterprise security, global performance, and cost optimization.