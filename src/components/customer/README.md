# Customer Components

Componentes reutilizables para la sección de cliente (customer) de la aplicación. Integrados desde el template `food-delivery-app-ui-expo`.

## Componentes Disponibles

### 1. OrderCard.tsx
Muestra la tarjeta de una orden con información del restaurante, número de orden, precio, fecha y botones de acción.

```tsx
import OrderCard from './OrderCard'
import type { Order } from '../../types'

<OrderCard
  item={order}
  isTrack={false}
  onRate={(orderId) => handleRate(orderId)}
  onReOrder={(orderId) => handleReOrder(orderId)}
/>
```

**Props:**
- `item: Order` - Objeto Order de la API
- `isTrack?: boolean` - Si es true muestra "Track", si no "Re-Order"
- `onRate?: (orderId: string) => void` - Callback al presionar Rate
- `onReOrder?: (orderId: string) => void` - Callback al presionar Re-Order

---

### 2. CategoryCard.tsx
Componente genérico para mostrar categorías seleccionables con imagen/icono y título.

```tsx
import CategoryCard from './CategoryCard'

<CategoryCard
  item={category}
  selected={selectedCategoryId}
  onSelect={(id, title) => handleSelectCategory(id, title)}
/>
```

**Props:**
- `item: Category` - { id, title, image?, icon? }
- `selected: string` - ID de la categoría seleccionada
- `onSelect: (id, title) => void` - Callback de selección
- `onPress?: () => void` - Callback adicional opcional

---

### 3. CategoryItem.tsx
Componente genérico para mostrar productos/items en un grid con imagen, nombre, descripción, precio y botón para agregar.

```tsx
import CategoryItem from './CategoryItem'

<CategoryItem
  item={product}
  onAddPress={(item) => addToCart(item)}
  onPress={() => viewProductDetails(item)}
/>
```

**Props:**
- `item: CategoryItemData` - { id, name, description?, price, image?, imageUrl? }
- `onAddPress?: (item) => void` - Callback al presionar el botón +
- `onPress?: () => void` - Callback al presionar el item completo

---

## Archivos de Referencia

- **COMPONENTS_GUIDE.md** - Guía completa con ejemplos detallados
- **EXAMPLE_USAGE.tsx** - Ejemplos funcionales de integración
- **README.md** - Este archivo

---

## Características Comunes

✅ Totalmente tipados con TypeScript
✅ Soportan imágenes locales y URLs remotas
✅ Incluyen placeholders automáticos
✅ Usan nuestro sistema de colores y spacing
✅ Compatible con React Navigation
✅ Sombras nativas (iOS + Android)

---

## Adaptaciones Realizadas

Todos los componentes fueron adaptados del template con:

1. **Imports:** Cambio de alias `@/` a rutas relativas
2. **Navegación:** De `expo-router` a `@react-navigation/native`
3. **Datos:** Tipados con nuestras interfaces de API
4. **Flexibilidad:** Callbacks personalizables en lugar de navegación hardcodeada
5. **Genéricos:** Reutilizables en múltiples contextos

---

## Uso Rápido

### En un componente de órdenes:
```tsx
import OrderCard from '../components/customer/OrderCard'

function OrdersScreen() {
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderCard item={item} />}
      keyExtractor={(item) => item.id}
    />
  )
}
```

### En una pantalla de filtrado:
```tsx
import CategoryCard from '../components/customer/CategoryCard'

function BrowseScreen() {
  const [selected, setSelected] = useState('')

  return (
    <FlatList
      data={categories}
      horizontal
      renderItem={({ item }) => (
        <CategoryCard
          item={item}
          selected={selected}
          onSelect={(id) => setSelected(id)}
        />
      )}
    />
  )
}
```

### En un grid de productos:
```tsx
import CategoryItem from '../components/customer/CategoryItem'

function ProductsScreen() {
  return (
    <FlatList
      data={products}
      numColumns={2}
      renderItem={({ item }) => (
        <CategoryItem
          item={item}
          onAddPress={(item) => addToCart(item)}
        />
      )}
    />
  )
}
```

---

## Próximos Pasos

1. Verificar que no hay errores de compilación
2. Integrar en las pantallas correspondientes
3. Conectar callbacks con la lógica de la aplicación
4. Testear en el emulador/dispositivo
5. Ajustar estilos si es necesario

---

## Notas

- Los componentes no incluyen lógica de estado global - eso depende de tu arquitectura
- Los callbacks son personalizables para máxima flexibilidad
- Todos los estilos están dentro de cada componente usando StyleSheet
- Las imágenes pueden ser locales (require) o URLs remotas
- Incluyen placeholder automático para imágenes que no cargan

