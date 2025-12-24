# Customer Components Guide

Guía de uso para los componentes de customer integrados desde el template.

## 1. OrderCard.tsx

**Ubicación:** `src/components/customer/OrderCard.tsx`

**Propósito:** Muestra la información de una orden con opciones para calificar, rastrear o repetir la orden.

### Interfaz
```typescript
interface Props {
  item: Order                           // Objeto Order de la API
  isTrack?: boolean                     // Si es true muestra "Track" en lugar de "Re-Order"
  onRate?: (orderId: string) => void   // Callback cuando se presiona "Rate"
  onReOrder?: (orderId: string) => void // Callback cuando se presiona "Re-Order"
}
```

### Uso Básico
```tsx
import OrderCard from '../components/customer/OrderCard'
import type { Order } from '../types'

function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([])

  const handleRate = (orderId: string) => {
    // Mostrar modal de rating
    console.log('Rate order:', orderId)
  }

  const handleReOrder = (orderId: string) => {
    // Crear nueva orden con los mismos productos
    console.log('Re-order:', orderId)
  }

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <OrderCard
          item={item}
          isTrack={false}
          onRate={handleRate}
          onReOrder={handleReOrder}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  )
}
```

### Características
- Adapta automáticamente la estructura de Order de la API
- Formatea fechas y precios correctamente
- Navega a OrderDetails cuando isTrack=true
- Soporta callbacks personalizados para Rate y Re-Order
- Compatible con nuestra estructura de datos

---

## 2. CategoryCard.tsx

**Ubicación:** `src/components/customer/CategoryCard.tsx`

**Propósito:** Componente de selección de categorías. Genérico para trabajar con cualquier estructura de categoría.

### Interfaz
```typescript
interface Category {
  id: string
  title: string
  image?: ImageSourcePropType | string  // Puede ser require() o URL
  icon?: ImageSourcePropType | string
}

interface Props {
  item: Category
  selected: string                                    // ID de la categoría seleccionada
  onSelect: (categoryId: string, categoryTitle: string) => void  // Callback de selección
  onPress?: () => void                              // Callback opcional adicional
}
```

### Uso Básico
```tsx
import { useState } from 'react'
import { FlatList, View } from 'react-native'
import CategoryCard from '../components/customer/CategoryCard'

function BrowseScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const categories = [
    {
      id: '1',
      title: 'Burgers',
      image: require('../assets/images/burger.png'),
    },
    {
      id: '2',
      title: 'Pizza',
      image: require('../assets/images/pizza.png'),
    },
    {
      id: '3',
      title: 'Sushi',
      image: require('../assets/images/sushi.png'),
    },
  ]

  const handleSelectCategory = (categoryId: string, categoryTitle: string) => {
    setSelectedCategory(categoryId)
    // Hacer algo con la categoría seleccionada
    console.log('Selected:', categoryTitle)
  }

  return (
    <FlatList
      data={categories}
      horizontal
      renderItem={({ item }) => (
        <CategoryCard
          item={item}
          selected={selectedCategory}
          onSelect={handleSelectCategory}
        />
      )}
      keyExtractor={(item) => item.id}
      scrollEnabled
    />
  )
}
```

### Características
- Genérico para cualquier estructura de categoría
- Soporta imágenes locales (require) e URLs
- Efecto visual de selección con cambio de color
- Flexible con callbacks opcionales
- Sombra y estilos consistentes

---

## 3. CategoryItem.tsx

**Ubicación:** `src/components/customer/CategoryItem.tsx`

**Propósito:** Muestra un producto/item con imagen, precio y botón de añadir al carrito.

### Interfaz
```typescript
interface CategoryItemData {
  id: string
  name: string
  description?: string
  price: number
  image?: ImageSourcePropType | string
  imageUrl?: string
}

interface Props {
  item: CategoryItemData
  onAddPress?: (item: CategoryItemData) => void  // Callback al presionar +
  onPress?: () => void                           // Callback al presionar el item
}
```

### Uso Básico
```tsx
import { View, FlatList } from 'react-native'
import CategoryItem from '../components/customer/CategoryItem'

function CategoryDetailScreen() {
  const items = [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Beef patty with cheese',
      price: 9.99,
      imageUrl: 'https://api.example.com/images/burger.jpg',
    },
    {
      id: '2',
      name: 'Bacon Burger',
      description: 'Beef with bacon and cheddar',
      price: 12.99,
      imageUrl: 'https://api.example.com/images/bacon-burger.jpg',
    },
  ]

  const handleAddPress = (item: CategoryItemData) => {
    // Añadir al carrito
    console.log('Added to cart:', item.name)
    // Actualizar carrito en la API o estado
  }

  const handleItemPress = () => {
    // Navegar a detalles del producto
    console.log('View details')
  }

  return (
    <FlatList
      data={items}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      renderItem={({ item }) => (
        <CategoryItem
          item={item}
          onAddPress={handleAddPress}
          onPress={handleItemPress}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  )
}
```

### Características
- Flexible para mostrar cualquier estructura de item
- Soporta imágenes locales y URLs
- Botón "+" para añadir al carrito
- Precio automáticamente formateado
- Manejo de imágenes con placeholder
- Responsive con grid de 2 columnas

---

## Notas Generales

### Importes Adaptados
Todos los componentes usan:
- `../../theme/colors` para la paleta de colores
- `../../theme/spacing` para espaciado
- `../../utils/normalize` para normalización responsiva
- `../common/Typo` para tipografía
- Rutas relativas en lugar de alias

### Navegación
Usan `useNavigation()` de `@react-navigation/native`:
- OrderCard: Navega a `OrderDetails` cuando isTrack=true
- CategoryItem: Navega a `StoreDetails` por defecto

### Compatibilidad
- Los componentes están completamente tipados con TypeScript
- Soportan tanto imágenes locales como URLs remotas
- Incluyen placeholders automáticos para imágenes faltantes
- Usan nuestro sistema de colores y espaciado existente

### Estilos
Todos los estilos están definidos con `StyleSheet` de React Native:
- Sombras nativas (shadowColor/shadowOpacity para iOS, elevation para Android)
- Espaciado consistente usando nuestro sistema de spacing
- Border radius usando `radius` del theme
- Responsive usando `normalizeX` y `normalizeY`

