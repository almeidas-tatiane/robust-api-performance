#!/bin/bash

# === CONFIGURAÇÕES ===
CLUSTER_NAME="performance"
NODEGROUP_NAME="performance-node-group"
REGION="us-east-1"

echo "⚠️  This script will delete the node group '$NODEGROUP_NAME' do cluster '$CLUSTER_NAME' on region '$REGION'."
read -p "Would you like to continue? (y/n): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "❌ Operation cancelled by the user."
  exit 1
fi

echo "🧹 Deleting node group..."
aws eks delete-nodegroup \
  --cluster-name "$CLUSTER_NAME" \
  --nodegroup-name "$NODEGROUP_NAME" \
  --region "$REGION"

echo "⏳ Waiting exclusion to complete..."
while true; do
  STATUS=$(aws eks describe-nodegroup \
    --cluster-name "$CLUSTER_NAME" \
    --nodegroup-name "$NODEGROUP_NAME" \
    --region "$REGION" 2>/dev/null)

  if [[ $? -ne 0 ]]; then
    echo "✅ Node group deleted successfully."
    break
  fi

  echo "Waiting exclusion..."
  sleep 10
done
