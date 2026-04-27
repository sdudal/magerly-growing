#!/bin/bash

# Magerly Static Website Infrastructure Deployment Script
# Usage: ./deploy.sh [action]
# Example: ./deploy.sh deploy

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
INFRASTRUCTURE_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATE_DIR="$INFRASTRUCTURE_DIR/templates"
PARAMETERS_DIR="$INFRASTRUCTURE_DIR/parameters"
STACK_NAME="magerly-static-website"
TEMPLATE_FILE="infrastructure/templates/static-website.yaml"
PARAMETERS_FILE="infrastructure/parameters/prod.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Usage function
usage() {
    cat << EOF
Usage: $0 [action]

Actions:
    validate    Validate CloudFormation template
    deploy      Deploy infrastructure stack (create new)
    update      Update existing infrastructure stack
    delete      Delete infrastructure stack
    status      Show stack status and resources
    outputs     Show stack outputs (URLs, bucket names, etc.)
    sync        Deploy website files to S3 and invalidate CloudFront
    debug       Show path debugging information (useful for WSL troubleshooting)
    help        Show this help message

Examples:
    $0 validate
    $0 deploy
    $0 update
    $0 sync

Prerequisites:
    - AWS CLI configured with appropriate credentials
    - jq installed for JSON parsing
    - Proper IAM permissions for CloudFormation, S3, CloudFront, Route53
    - Domain name configured in parameters/prod.json

Infrastructure Stack: $STACK_NAME
Template: $TEMPLATE_FILE
Parameters: $PARAMETERS_FILE
EOF
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured or invalid"
        exit 1
    fi
    
    # Check jq (optional but recommended)
    if ! command -v jq &> /dev/null; then
        log_warning "jq is not installed - some JSON parsing will be limited"
        log_info "Install jq for better experience:"
        log_info "  Ubuntu/Debian: sudo apt-get install jq"
        log_info "  macOS: brew install jq"
        log_info "  Windows: Use WSL or install via chocolatey: choco install jq"
    fi
    
    # Check if parameter file exists
    if [[ ! -f "$PARAMETERS_FILE" ]]; then
        log_error "Parameters file not found: $PARAMETERS_FILE"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Debug paths (useful for troubleshooting WSL issues)
debug_paths() {
    log_info "=== Path Debugging Information ==="
    log_info "Current working directory: $(pwd)"
    log_info "Script directory: $SCRIPT_DIR"
    log_info "Project root: $PROJECT_ROOT"
    log_info "Infrastructure directory: $INFRASTRUCTURE_DIR"
    log_info "Template directory: $TEMPLATE_DIR"
    log_info "Parameters directory: $PARAMETERS_DIR"
    log_info "Template file: $TEMPLATE_FILE"
    log_info "Parameters file: $PARAMETERS_FILE"
    
    # Check if running in WSL
    if grep -qi microsoft /proc/version 2>/dev/null; then
        log_info "Running in WSL environment"
        log_info "Template file exists: $([[ -f "$TEMPLATE_FILE" ]] && echo "YES" || echo "NO")"
        log_info "Parameters file exists: $([[ -f "$PARAMETERS_FILE" ]] && echo "YES" || echo "NO")"
        
        if [[ -f "$TEMPLATE_FILE" ]]; then
            log_info "Template file absolute path: $(realpath "$TEMPLATE_FILE")"
        fi
        if [[ -f "$PARAMETERS_FILE" ]]; then
            log_info "Parameters file absolute path: $(realpath "$PARAMETERS_FILE")"
        fi
    else
        log_info "Running in native Unix environment"
    fi
    log_info "================================="
}

# Validate CloudFormation template
validate_template() {
    log_info "Validating CloudFormation template..."
    
    # Check if template file exists
    if [[ ! -f "$TEMPLATE_FILE" ]]; then
        log_error "Template file not found: $TEMPLATE_FILE"
        log_info "Current working directory: $(pwd)"
        log_info "Script directory: $SCRIPT_DIR"
        log_info "Template directory: $TEMPLATE_DIR"
        exit 1
    fi
    
    if aws cloudformation validate-template --template-body "file://$TEMPLATE_FILE" > /dev/null; then
        log_success "Template validation passed"
    else
        log_error "Template validation failed"
        exit 1
    fi
}

# Check if stack exists
stack_exists() {
    aws cloudformation describe-stacks --stack-name "$STACK_NAME" &> /dev/null
}

# Deploy infrastructure stack
deploy_stack() {
    log_info "Deploying Magerly infrastructure stack"
    
    # Check if stack already exists
    if stack_exists; then
        log_error "Stack '$STACK_NAME' already exists. Use 'update' action to modify it."
        exit 1
    fi
    
    # Validate template first
    validate_template
    
    # Deploy stack
    log_info "Creating CloudFormation stack: $STACK_NAME"
    
    aws cloudformation create-stack \
        --stack-name "$STACK_NAME" \
        --template-body "file://$TEMPLATE_FILE" \
        --parameters "file://$PARAMETERS_FILE" \
        --capabilities CAPABILITY_NAMED_IAM \
        --tags \
            Key=Project,Value=magerly \
            Key=Environment,Value=prod \
            Key=ManagedBy,Value=CloudFormation \
        --enable-termination-protection
    
    log_info "Waiting for stack creation to complete..."
    log_warning "This may take 10-15 minutes due to CloudFront distribution creation..."
    
    aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME"
    
    if [[ $? -eq 0 ]]; then
        log_success "Infrastructure deployment completed successfully"
        show_outputs
    else
        log_error "Infrastructure deployment failed"
        exit 1
    fi
}

# Update infrastructure stack
update_stack() {
    log_info "Updating Magerly infrastructure stack"
    
    if ! stack_exists; then
        log_error "Stack '$STACK_NAME' does not exist. Use 'deploy' action to create it."
        exit 1
    fi
    
    # Validate template first
    validate_template
    
    log_info "Updating CloudFormation stack: $STACK_NAME"

    # Check if there are any changes
    aws cloudformation update-stack \
        --stack-name "$STACK_NAME" \
        --template-body "file://$TEMPLATE_FILE" \
        --parameters "file://$PARAMETERS_FILE" \
        --capabilities CAPABILITY_NAMED_IAM || {
        
        # Check if the error is due to no changes
        if aws cloudformation describe-stacks --stack-name "$STACK_NAME" &> /dev/null; then
            log_warning "No changes detected in the template"
            return 0
        else
            log_error "Stack update failed"
            exit 1
        fi
    }
    
    log_info "Waiting for stack update to complete..."
    aws cloudformation wait stack-update-complete --stack-name "$STACK_NAME"
    
    if [[ $? -eq 0 ]]; then
        log_success "Infrastructure update completed successfully"
        show_outputs
    else
        log_error "Infrastructure update failed"
        exit 1
    fi
}

# Delete infrastructure stack
delete_stack() {
    log_warning "This will delete ALL infrastructure for Magerly website"
    log_warning "Including: S3 buckets, CloudFront distribution, DNS records, SSL certificates"
    read -p "Are you absolutely sure? Type 'delete-magerly' to confirm: " confirm
    
    if [[ "$confirm" != "delete-magerly" ]]; then
        log_info "Deletion cancelled"
        exit 0
    fi
    
    if ! stack_exists; then
        log_error "Stack '$STACK_NAME' does not exist"
        exit 1
    fi
    
    # Disable termination protection first
    log_info "Disabling termination protection..."
    aws cloudformation update-termination-protection \
        --stack-name "$STACK_NAME" \
        --no-enable-termination-protection
    
    log_info "Deleting CloudFormation stack: $STACK_NAME"
    aws cloudformation delete-stack --stack-name "$STACK_NAME"
    
    log_info "Waiting for stack deletion to complete..."
    log_warning "This may take 10-15 minutes due to CloudFront distribution deletion..."
    
    aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME"
    
    log_success "Infrastructure deletion completed"
}

# Show stack status
show_status() {
    if ! stack_exists; then
        log_warning "Stack '$STACK_NAME' does not exist"
        exit 0
    fi
    
    log_info "Infrastructure status:"
    aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].{Status:StackStatus,Created:CreationTime,Updated:LastUpdatedTime}' \
        --output table
    
    log_info "Stack resources:"
    aws cloudformation describe-stack-resources \
        --stack-name "$STACK_NAME" \
        --query 'StackResources[].[ResourceType,LogicalResourceId,ResourceStatus]' \
        --output table
}

# Show stack outputs
show_outputs() {
    if ! stack_exists; then
        log_warning "Stack '$STACK_NAME' does not exist"
        exit 0
    fi
    
    log_info "Infrastructure outputs:"
    aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[]' \
        --output table
}

# Sync website files to S3
sync_website() {
    local dist_dir="$PROJECT_ROOT/dist"
    
    if ! stack_exists; then
        log_error "Infrastructure stack does not exist. Deploy infrastructure first:"
        log_info "  $0 deploy"
        exit 1
    fi
    
    # Get bucket name from stack outputs
    local bucket_name
    bucket_name=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" \
        --output text)
    
    if [[ -z "$bucket_name" ]]; then
        log_error "Could not retrieve bucket name from stack outputs"
        exit 1
    fi
    
    # Check if dist directory exists
    if [[ ! -d "$dist_dir" ]]; then
        log_error "Build directory not found: $dist_dir"
        log_info "Run 'npm run build' first to create the dist directory"
        exit 1
    fi
    
    log_info "Syncing website files to S3 bucket: $bucket_name"
    
    # Sync all files to S3 (excludes files that need explicit content-type)
    aws s3 sync "$dist_dir" "s3://$bucket_name" --delete \
        --exclude "*.xml" --exclude "*.json"
    
    # Upload XML files with explicit Content-Type (fixes CloudFront serving issues)
    if compgen -G "$dist_dir/*.xml" > /dev/null; then
        aws s3 cp "$dist_dir/" "s3://$bucket_name/" --recursive \
            --exclude "*" --include "*.xml" \
            --content-type "application/xml"
    fi
    
    # Upload JSON files with explicit Content-Type
    if compgen -G "$dist_dir/*.json" > /dev/null; then
        aws s3 cp "$dist_dir/" "s3://$bucket_name/" --recursive \
            --exclude "*" --include "*.json" \
            --content-type "application/json"
    fi
    
    log_success "Website files synced successfully"
    
    # Get CloudFront distribution ID and create invalidation
    local distribution_id
    distribution_id=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
        --output text)
    
    if [[ -n "$distribution_id" ]]; then
        log_info "Creating CloudFront invalidation for distribution: $distribution_id"
        aws cloudfront create-invalidation \
            --distribution-id "$distribution_id" \
            --paths "/*" > /dev/null
        log_success "CloudFront cache invalidation created"
        
        # Show website URL
        local website_url
        website_url=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
            --output text)
        
        if [[ -n "$website_url" ]]; then
            log_success "Website deployed! Visit: $website_url"
        fi
    fi
}

# Main function
main() {
    if [[ $# -eq 0 ]]; then
        usage
        exit 1
    fi
    
    local action=$1
    
    case $action in
        validate)
            check_prerequisites
            validate_template
            ;;
        deploy)
            check_prerequisites
            deploy_stack
            ;;
        update)
            check_prerequisites
            update_stack
            ;;
        delete)
            check_prerequisites
            delete_stack
            ;;
        status)
            check_prerequisites
            show_status
            ;;
        outputs)
            check_prerequisites
            show_outputs
            ;;
        sync)
            check_prerequisites
            sync_website
            ;;
        debug)
            debug_paths
            ;;
        help)
            usage
            ;;
        *)
            log_error "Unknown action: $action"
            echo
            usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"