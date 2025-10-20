# Installation Guide for Deployment Script

This guide helps you set up the required tools to deploy the Magerly infrastructure.

## Windows Users

The deployment script requires a Unix-like environment. Here are your options:

### Option 1: Windows Subsystem for Linux (WSL) - Recommended

1. **Install WSL2** (if not already installed):
   ```powershell
   # Run as Administrator in PowerShell
   wsl --install
   # Restart your computer
   ```

2. **Open WSL Terminal** (Ubuntu or your preferred distribution)

3. **Install required tools**:
   ```bash
   # Update package manager
   sudo apt update

   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   sudo apt install unzip
   unzip awscliv2.zip
   sudo ./aws/install

   # Install jq (optional but recommended)
   sudo apt install jq

   # Verify installations
   aws --version
   jq --version
   ```

4. **Configure AWS credentials**:
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, region, and output format
   ```

5. **Navigate to your project** (from WSL):
   ```bash
   # If your project is on C:\work\pet_projects\magerly-growing
   cd /mnt/c/work/pet_projects/magerly-growing
   
   # Make script executable
   chmod +x infrastructure/scripts/deploy.sh
   
   # Test the script
   ./infrastructure/scripts/deploy.sh help
   ```

### Option 2: Git Bash

1. **Install Git for Windows** (if not already installed)
2. **Install AWS CLI for Windows**
3. **Open Git Bash terminal**
4. **Install jq**:
   ```bash
   # Download jq for Windows
   curl -L -o jq.exe https://github.com/stedolan/jq/releases/download/jq-1.6/jq-win64.exe
   # Move to a directory in your PATH (e.g., C:\Program Files\Git\usr\bin\)
   ```

### Option 3: Docker (Advanced)

Create a container with all required tools:

```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    jq \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws/
```

## macOS Users

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install required tools**:
   ```bash
   # Install AWS CLI
   brew install awscli

   # Install jq (optional but recommended)
   brew install jq

   # Verify installations
   aws --version
   jq --version
   ```

3. **Configure AWS credentials**:
   ```bash
   aws configure
   ```

4. **Make script executable and test**:
   ```bash
   chmod +x infrastructure/scripts/deploy.sh
   ./infrastructure/scripts/deploy.sh help
   ```

## Linux Users

### Ubuntu/Debian:

```bash
# Update package manager
sudo apt update

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip
unzip awscliv2.zip
sudo ./aws/install

# Install jq (optional but recommended)
sudo apt install jq

# Configure AWS credentials
aws configure

# Make script executable and test
chmod +x infrastructure/scripts/deploy.sh
./infrastructure/scripts/deploy.sh help
```

### CentOS/RHEL/Amazon Linux:

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo yum install unzip
unzip awscliv2.zip
sudo ./aws/install

# Install jq (optional but recommended)
sudo yum install jq

# Configure and test (same as above)
aws configure
chmod +x infrastructure/scripts/deploy.sh
./infrastructure/scripts/deploy.sh help
```

## AWS Credentials Setup

After installing AWS CLI, configure your credentials:

```bash
aws configure
```

You'll need:
- **AWS Access Key ID**: From your AWS IAM user
- **AWS Secret Access Key**: From your AWS IAM user  
- **Default region name**: e.g., `us-east-1`
- **Default output format**: `json`

### Required IAM Permissions

Your AWS user needs these permissions:
- CloudFormation: Full access
- S3: Full access
- CloudFront: Full access
- Route 53: Full access
- Certificate Manager: Full access
- IAM: Role management
- CloudWatch: Monitoring access

## Testing Installation

After setup, test everything works:

```bash
# Test AWS CLI
aws sts get-caller-identity

# Test deployment script
./infrastructure/scripts/deploy.sh help

# If jq is installed, test it
echo '{"test": "value"}' | jq .
```

## Troubleshooting

### Common Issues:

**"bash: command not found"**
- On Windows: Use WSL, Git Bash, or install bash
- Ensure you're in the correct directory

**"AWS credentials not configured"**  
- Run `aws configure`
- Check `~/.aws/credentials` file exists

**"jq: command not found"**
- jq is optional - script will show warning but continue
- Install jq for better experience (see platform-specific instructions above)

**"Permission denied" on script**
- Run: `chmod +x infrastructure/scripts/deploy.sh`

**WSL file system issues**
- Access Windows files via `/mnt/c/path/to/project`
- Or copy project to WSL filesystem for better performance
- If getting "No such file or directory" errors, run: `./infrastructure/scripts/deploy.sh debug`

**Path-related errors in WSL**
- Make sure you're in the project directory: `cd /mnt/c/work/pet_projects/magerly-growing`
- Use the debug command to check paths: `./infrastructure/scripts/deploy.sh debug`
- Files should exist in both template and parameters directories

## Next Steps

Once installation is complete:

1. **Configure your domain** in `infrastructure/parameters/prod.json`
2. **Deploy infrastructure**: `./infrastructure/scripts/deploy.sh deploy`
3. **Build website**: `npm run build`
4. **Deploy website**: `./infrastructure/scripts/deploy.sh sync`

See the main [infrastructure/README.md](README.md) for detailed deployment instructions.
