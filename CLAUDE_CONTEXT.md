# DeliveryGo - Contexto del Proyecto

## Información General
- **Proyecto**: DeliveryGo Express - App móvil de delivery
- **Stack**: React Native + Expo
- **Backend**: .NET microservicios (Docker Compose)
- **Repo GitHub**: https://github.com/joshmen/deliverygo-mobile
- **Usuario Git**: joshmen / xjoshmenx@gmail.com

## Estructura del Proyecto
```
C:\dev\deliverygo-clean\          # Mobile app (Expo/React Native)
C:\dev\deliverygo-clean\.maestro\ # Tests E2E con Maestro
```

## Backend (Docker Compose)
Los servicios corren en:
- **AuthService**: puerto 5000
- **TenantConfigService**: puerto 5001
- **OrderService**: puerto 5002

Configuración en `src/config/constants.ts`

## Credenciales de Demo
| Rol | Email | Password |
|-----|-------|----------|
| StoreOwner | owner@demo-restaurant.com | StoreOwner123! |
| Driver | driver@demo-restaurant.com | Driver123! |
| Customer | customer@demo-restaurant.com | Customer123! |

Tenant Code: `demo-restaurant`

## Tests E2E con Maestro (TODOS PASANDO ✅)

### Archivos de Test Principales
1. **expo-go-login.yaml** - Login StoreOwner
2. **02-driver-login.yaml** - Login Driver
3. **03-customer-login.yaml** - Login Customer
4. **04-login-validations.yaml** - Validaciones de formulario

### Comandos para ejecutar tests
```bash
cd C:\dev\deliverygo-clean

# Test individual
maestro test .maestro/expo-go-login.yaml

# Todos los tests
maestro test .maestro/
```

### Notas Técnicas de Maestro
- **appId**: `host.exp.exponent` (Expo Go)
- **Samsung Pass**: Se maneja con `pressKey: back`
- **Logout button**: Requiere `scrollUntilVisible` porque está abajo
- **Keyboard**: Cerrar con `pressKey: back` antes de assertions
- **Estados**: Tests manejan tanto logged-in como logged-out

### Problemas Resueltos
1. Samsung Pass popup bloqueaba assertions → `pressKey: back`
2. "DeliveryGo Express" no encontrado → `runFlow` condicional
3. Logout no visible → `scrollUntilVisible`
4. Keyboard tapando elementos → `pressKey: back` para cerrar
5. "Forgot Password" no existe → Cambiado a verificar "Demo Accounts:"

## Dispositivo de Pruebas
- Samsung Galaxy (con Samsung Pass habilitado)
- Conectado via ADB: `RFCX40PEFVK`
- ADB path: `C:\Android\Sdk\platform-tools\adb.exe`
- Maestro path: `C:\Users\AW AREA 51M R2\.maestro\bin\maestro`

## Comandos Útiles ADB
```bash
# Screenshot
/c/Android/Sdk/platform-tools/adb.exe exec-out screencap -p > screenshot.png

# Verificar dispositivo
/c/Android/Sdk/platform-tools/adb.exe devices

# Port forwarding para backend
/c/Android/Sdk/platform-tools/adb.exe reverse tcp:5000 tcp:5000
/c/Android/Sdk/platform-tools/adb.exe reverse tcp:5001 tcp:5001
/c/Android/Sdk/platform-tools/adb.exe reverse tcp:5002 tcp:5002
```

## Git Status
- Repo: https://github.com/joshmen/deliverygo-mobile
- Branch: main
- Último commit: "Remove .env from repo (security)"

### .gitignore incluye
- *.apk
- *.png (root level)
- *.bat
- .env
- test-output.txt

## Archivos Importantes
- `src/config/constants.ts` - Configuración de API y puertos
- `src/services/api.ts` - Cliente API
- `.maestro/config.yaml` - Configuración suite de tests
- `eas.json` - Configuración EAS Build

## Próximos Pasos Sugeridos
1. Agregar más tests E2E (crear orden, ver menú, etc.)
2. CI/CD para correr tests automáticamente
3. Tests de Driver (aceptar entregas, cambiar status)
4. Tests de Customer (browse restaurants, add to cart)

## Sesión Anterior
- Fecha: 25 Diciembre 2024
- Se completaron todos los tests de login para los 3 roles
- Se arreglaron problemas con Samsung Pass
- Se subió código a GitHub
- Se limpiaron archivos sensibles (.env, .apk) del repo
