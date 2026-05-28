# Kashos Kubernetes & Docker Deployment Guide

## 🐳 Docker Deployment

### Quick Start with Docker

#### 1. Build Docker Image
```bash
docker build -t kashos:latest .
```

#### 2. Run Container
```bash
docker run -p 3000:3000 -v $(pwd)/uploads:/app/uploads kashos:latest
```

#### 3. Access Application
- Phone App: http://localhost:3000/public/phone-app.html
- API: http://localhost:3000/api/docs

### Docker Compose (Recommended for Local)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f kashos-server

# Stop services
docker-compose down
```

---

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (1.20+)
- kubectl configured
- Docker image pushed to registry

### Quick Start

#### 1. Make Script Executable
```bash
chmod +x deploy-k8s.sh
```

#### 2. Full Deployment (Build → Push → Deploy)
```bash
DOCKER_USERNAME=yourname ./deploy-k8s.sh full
```

#### 3. Check Status
```bash
kubectl get pods -l app=kashos
kubectl get svc kashos-service
```

#### 4. Access Service
```bash
kubectl port-forward svc/kashos-service 8080:80
# Open: http://localhost:8080/public/phone-app.html
```

### Deploy Script Commands

| Command | Description |
|---------|-------------|
| `./deploy-k8s.sh build` | Build Docker image only |
| `./deploy-k8s.sh push` | Build and push to Docker Hub |
| `./deploy-k8s.sh deploy` | Deploy to Kubernetes |
| `./deploy-k8s.sh status` | Check deployment status |
| `./deploy-k8s.sh logs` | Show pod logs |
| `./deploy-k8s.sh full` | Complete deployment |
| `./deploy-k8s.sh clean` | Delete deployment |

### Kubernetes Features

✅ **Auto-Scaling**: 2-10 replicas based on CPU/memory  
✅ **Health Checks**: Liveness & readiness probes  
✅ **Load Balancing**: Service with LoadBalancer type  
✅ **Resource Limits**: CPU and memory constraints  

---

## 📦 Docker Package

### Create Distribution Package

```bash
chmod +x package-docker.sh
./package-docker.sh 1.0.0
```

This creates:
- `kashos-docker-1.0.0/` - Full package directory
- `kashos-docker-1.0.0.tar.gz` - Compressed archive
- `kashos-docker-1.0.0.tar.gz.sha256` - Checksum

### Install Package

```bash
# Extract
tar -xzf kashos-docker-1.0.0.tar.gz
cd kashos-docker-1.0.0

# Install
./INSTALL.sh

# Deploy to Kubernetes
./scripts/deploy-k8s.sh full
```

---

## 🛠️ CLI Commands Reference

### Docker Commands
```bash
# Build image
docker build -t kashos:latest .

# Run container
docker run -p 3000:3000 kashos:latest

# Push to registry
docker push askforkris90/kashos:latest

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>
```

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale service
docker-compose up -d --scale kashos-server=3

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Kubernetes Commands
```bash
# Apply deployment
kubectl apply -f k8s-deployment.yaml

# View deployments
kubectl get deployments

# View pods
kubectl get pods -l app=kashos

# View services
kubectl get svc

# View logs
kubectl logs -l app=kashos

# Port forward
kubectl port-forward svc/kashos-service 8080:80

# Scale deployment
kubectl scale deployment kashos-server --replicas=5

# Delete deployment
kubectl delete -f k8s-deployment.yaml
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│        Kubernetes/Docker                │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐    │
│  │  Pod 1       │  │  Pod 2       │    │
│  │  Kashos      │  │  Kashos      │    │
│  │  Port: 3000  │  │  Port: 3000  │    │
│  └──────────────┘  └──────────────┘    │
├─────────────────────────────────────────┤
│  Service (LoadBalancer)                 │
│  Port: 80 → 3000                        │
├─────────────────────────────────────────┤
│  HPA (Auto-scaling)                     │
│  CPU: 70%, Memory: 80%                  │
├─────────────────────────────────────────┤
│  Storage (Uploads)                      │
│  EmptyDir / PVC                         │
└─────────────────────────────────────────┘
```

---

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
```

### Resource Limits (Kubernetes)
```yaml
requests:
  memory: "128Mi"
  cpu: "100m"
limits:
  memory: "512Mi"
  cpu: "500m"
```

### Auto-Scaling (Kubernetes)
```yaml
minReplicas: 2
maxReplicas: 10
CPU Utilization: 70%
Memory Utilization: 80%
```

---

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Kubernetes Metrics
```bash
# View resource usage
kubectl top pods -l app=kashos

# View HPA status
kubectl get hpa
```

### Logs
```bash
# Docker
docker logs -f kashos-server

# Kubernetes
kubectl logs -f -l app=kashos
```

---

## 🚀 Production Deployment

### Recommended Setup
1. Use Docker Hub for image registry
2. Enable HTTPS with Ingress
3. Use persistent volumes for uploads
4. Set resource requests/limits
5. Enable monitoring and logging
6. Configure security policies
7. Set up backup strategy

### Example Production Deployment
```bash
# Build and push
docker build -t myregistry/kashos:v1.0.0 .
docker push myregistry/kashos:v1.0.0

# Update k8s-deployment.yaml with your registry

# Deploy with namespace
kubectl apply -f k8s-deployment.yaml -n production

# Verify
kubectl get all -n production
```

---

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs <container-id>

# Check image
docker images | grep kashos
```

### Pod Pending in Kubernetes
```bash
# Describe pod
kubectl describe pod <pod-name>

# Check resources
kubectl top nodes
```

### Service Not Accessible
```bash
# Check service
kubectl get svc kashos-service

# Port forward
kubectl port-forward svc/kashos-service 8080:80
```

---

## 📚 Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Docker Compose Specification](https://github.com/compose-spec/compose-spec)

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-28  
**Author**: askforkris90
