# SSL Certificate Fix for CloudFront

## Problem
CloudFront requires SSL certificates to be in the **us-east-1** region, but your current certificate is in `eu-central-1`.

## Current Certificate (WRONG REGION)
```
arn:aws:acm:eu-central-1:174202417435:certificate/a78fb16c-764e-4839-bdc7-d902bcc7966a
```

## Solution Steps

### 1. Create New Certificate in us-east-1

1. **Switch to us-east-1 region**
   - Open AWS Console
   - Top-right corner: Select **US East (N. Virginia)**

2. **Go to Certificate Manager (ACM)**
   - Services → Certificate Manager
   - Or: https://console.aws.amazon.com/acm/home?region=us-east-1

3. **Request Certificate**
   - Click "Request certificate"
   - Choose "Request a public certificate"
   - Click "Next"

4. **Add Domain Names**
   - Primary domain: `magerly.com`
   - Click "Add another name to this certificate"
   - Add: `*.magerly.com` (for www and other subdomains)
   - Click "Next"

5. **Choose Validation Method**
   - Select **DNS validation**
   - Click "Next"

6. **Add Tags (Optional)**
   - Key: Environment, Value: production
   - Key: Project, Value: magerly
   - Click "Next"

7. **Review and Request**
   - Click "Request"

### 2. Validate the Certificate

**Option A: Using Route 53 (Easy)**
1. After requesting, you'll see the certificate with "Pending validation" status
2. Expand the domain details
3. Click "Create records in Route 53" button
4. Select both records (magerly.com and *.magerly.com)
5. Click "Create records"
6. Wait 5-30 minutes for validation

**Option B: Manual DNS (If not using Route 53)**
1. Copy the CNAME name and value
2. Add to your DNS provider
3. Wait for validation

### 3. Update Infrastructure Configuration

Once the certificate is **Issued** (not pending):

1. **Copy the Certificate ARN**
   - Should look like: `arn:aws:acm:us-east-1:174202417435:certificate/XXXXXXXX`

2. **Update `infrastructure/parameters/prod.json`**
   
   Replace line 20:
   ```json
   "ParameterValue": "arn:aws:acm:eu-central-1:174202417435:certificate/a78fb16c-764e-4839-bdc7-d902bcc7966a"
   ```
   
   With your new certificate ARN:
   ```json
   "ParameterValue": "arn:aws:acm:us-east-1:174202417435:certificate/YOUR-NEW-CERT-ID"
   ```

### 4. Deploy Infrastructure Again

```bash
cd infrastructure/scripts
./deploy.sh
```

## Important Notes

✅ **Certificate MUST be in us-east-1 for CloudFront**
- CloudFront is a global service
- All CloudFront SSL certificates must be in us-east-1
- This is an AWS requirement, not a bug

✅ **Keep Both Certificates**
- You can keep your eu-central-1 certificate for other services
- CloudFront will use the us-east-1 certificate

✅ **Validation Time**
- DNS validation usually takes 5-30 minutes
- Don't deploy until certificate status is "Issued"

## Verification

Before deploying, verify:
1. ✅ Certificate is in **us-east-1** region
2. ✅ Certificate status is **Issued** (not pending)
3. ✅ Certificate covers both `magerly.com` and `*.magerly.com`
4. ✅ prod.json has the correct ARN

## Troubleshooting

**"Certificate still pending"**
- Check DNS records in Route 53
- CNAME records should be present
- Wait up to 30 minutes

**"Cannot find certificate"**
- Make sure you're viewing us-east-1 region in ACM console
- Not eu-central-1

**"Still getting the error"**
- Double-check the ARN in prod.json
- Make sure certificate is "Issued" not "Pending validation"
- Verify ARN starts with `arn:aws:acm:us-east-1:`

