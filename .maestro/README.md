# DeliveryGo E2E Test Suite (Maestro + Expo Go)

## Prerequisites

1. **Metro bundler running with tunnel:**
   ```bash
   cd C:\dev\deliverygo-clean
   npx expo start --tunnel --port 8082
   ```

2. **Expo Go app** installed on phone

3. **Project loaded in Expo Go** (scan QR code)

4. **Backend services running:**
   ```bash
   docker-compose up -d
   ```

## Test Files

| File | Description | Duration |
|------|-------------|----------|
| `expo-go-login.yaml` | Basic login flow (StoreOwner) | ~30s |
| `01-store-owner-full-flow.yaml` | Complete StoreOwner journey | ~60s |
| `02-driver-full-flow.yaml` | Complete Driver journey | ~60s |
| `03-logout-test.yaml` | Logout functionality | ~20s |
| `04-login-validation.yaml` | Form validation tests | ~45s |
| `run-all-tests.yaml` | Master suite (runs all) | ~4min |

## Running Tests

### Run single test:
```bash
cd C:\dev\deliverygo-clean
maestro test .maestro/expo-go-login.yaml
```

### Run all tests:
```bash
maestro test .maestro/run-all-tests.yaml
```

### Run with debug output:
```bash
maestro test .maestro/expo-go-login.yaml --debug-output=./maestro-debug
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| StoreOwner | owner@demo-restaurant.com | StoreOwner123! |
| Driver | driver@demo-restaurant.com | Driver123! |
| Customer | customer@demo-restaurant.com | Customer123! |

> **Note:** Customer role not yet implemented in backend enum

## Test Coverage

### StoreOwner Flow
- [x] Login with valid credentials
- [x] View Orders Dashboard
- [x] Navigate to Settings
- [x] Navigate to Profile
- [x] Logout

### Driver Flow
- [x] Login with valid credentials
- [x] View Available Deliveries
- [x] Navigate to History
- [x] Navigate to Profile
- [x] Logout

### Login Validation
- [x] Empty credentials error
- [x] Email only error
- [x] Password only error
- [x] Invalid credentials error
- [x] Forgot Password link visible
- [x] Sign Up link visible

### Customer Flow (Pending Backend Fix)
- [ ] Login as Customer
- [ ] Browse Stores
- [ ] View Store Details
- [ ] Add to Cart
- [ ] Checkout
- [ ] View Orders

## Troubleshooting

### Test fails at "Launch app"
- Ensure Expo Go is installed
- Ensure phone is connected via USB with ADB enabled

### Test fails at "All your favorites"
- Metro bundler might not be running
- Check `npx expo start --tunnel` is active
- Scan QR code in Expo Go

### Test times out
- Increase timeout in YAML: `timeout: 60000`
- Check network connectivity
- Verify backend services are running

## Adding New Tests

1. Create new `.yaml` file in `.maestro/` folder
2. Use `appId: host.exp.exponent` for Expo Go
3. Follow existing patterns for navigation
4. Add to `run-all-tests.yaml` if it should run in suite
