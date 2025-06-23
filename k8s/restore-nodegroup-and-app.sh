#!/bin/bash

# === INITIAL CONFIGURATION ===
CLUSTER_NAME="performance"
NODEGROUP_NAME="performance-node-group"
REGION="us-east-1"
INSTANCE_TYPE="t3.small"
DISK_SIZE=20

# === SUBNETS IN THE SAME VPC ===
SUBNETS="subnet-014a8a46290ef0f1e subnet-004e05f513c27314f"

# === ROLE OF NODE GROUP ===
NODE_ROLE="arn:aws:iam::645112217991:role/performance-eks-nodegroup-role"

# === CREATE NODEGROUP ===
echo "🛠️ Criando node group..."
aws eks create-nodegroup \
  --cluster-name "$CLUSTER_NAME" \
  --nodegroup-name "$NODEGROUP_NAME" \
  --scaling-config minSize=1,maxSize=1,desiredSize=1 \
  --disk-size $DISK_SIZE \
  --subnets $SUBNETS \
  --instance-types $INSTANCE_TYPE \
  --node-role "$NODE_ROLE" \
  --region "$REGION"

# === WAIT ACTIVATION ===
echo "⏳ Aguardando node group ficar ACTIVE..."
while true; do
  STATUS=$(aws eks describe-nodegroup \
    --cluster-name "$CLUSTER_NAME" \
    --nodegroup-name "$NODEGROUP_NAME" \
    --region "$REGION" \
    --query "nodegroup.status" \
    --output text)

  echo "Status atual: $STATUS"

  if [ "$STATUS" == "ACTIVE" ]; then
    break
  fi

  sleep 15
done

# === RE-APPLY KUBERNETES MANIFEST ===
echo "📦 Aplicando deployment e service..."
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# === SHOW EXTERNAL IP ADDRESS ===
echo "🌐 Buscando IP externo do serviço..."
EXTERNAL_IP=""
while [ -z "$EXTERNAL_IP" ] || [ "$EXTERNAL_IP" == "<pending>" ]; do
  EXTERNAL_IP=$(kubectl get svc --field-selector metadata.name=meu-servico \
    -o jsonpath="{.items[0].status.loadBalancer.ingress[0].hostname}")
  echo "Aguardando IP..."
  sleep 10
done

echo "✅ Sua aplicação está disponível em: http://$EXTERNAL_IP"
