# Configuración de Firebase para GitHub Actions

## 1. Generar Service Account Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `demoangular-17892`
3. Ve a **Project Settings** > **Service accounts**
4. Haz clic en **Generate new private key**
5. Descarga el archivo JSON

## 2. Configurar Secrets en GitHub

### Para Staging:
1. Ve a tu repositorio en GitHub
2. **Settings** > **Secrets and variables** > **Actions**
3. Crea un nuevo secret: `FIREBASE_SERVICE_ACCOUNT_STAGING`
4. Pega el contenido del JSON descargado

### Para Production:
1. Crea otro secret: `FIREBASE_SERVICE_ACCOUNT_PROD`
2. Puedes usar la misma service account o crear una específica para producción

## 3. Configurar Environments

### Staging Environment:
1. **Settings** > **Environments**
2. Crea environment: `staging`
3. Configura protection rules si es necesario

### Production Environment:
1. Crea environment: `production`
2. Configura protection rules (recomendado)
3. Requiere review antes de deploy

## 4. Configurar Branch Protection

### Para main branch:
1. **Settings** > **Branches**
2. Add rule para `main`
3. Marca: "Require a pull request before merging"
4. Marca: "Require status checks to pass before merging"
5. Selecciona: "PR Check" y "Firebase Deploy"

### Para develop branch:
1. Configura reglas similares pero menos restrictivas

## 5. Flujo de Trabajo

### Desarrollo:
1. Crea feature branch desde `develop`
2. Desarrolla y haz commits
3. Crea PR a `develop`
4. Tests automáticos se ejecutan
5. Merge a `develop` → Deploy automático a staging

### Producción:
1. Crea PR de `develop` a `main`
2. Tests automáticos se ejecutan
3. Review manual requerido
4. Merge a `main` → Deploy automático a producción

## 6. Variables de Entorno

El workflow usa estas variables:
- `NODE_VERSION`: '22'
- `FIREBASE_PROJECT_ID`: 'demoangular-17892'

## 7. Comandos Manuales

Si necesitas deploy manual:
```bash
# Staging
firebase deploy --only functions,firestore:rules,firestore:indexes --project demoangular-17892

# Production
firebase deploy --only functions,firestore:rules,firestore:indexes --project demoangular-17892
``` 