import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  SafeAreaView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-connection'; 
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

interface Producto {
  id: string;
  nombre: string;
}

const ProductoCard = ({ item, onPress }: { item: Producto; onPress?: () => void }) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.card}>
    <View style={styles.iconContainer}>
      <Ionicons name="cube-outline" size={24} color="#A87BC7" />
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <View style={styles.stockBadge}>
      
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#555" />
  </TouchableOpacity>
);

export default function Pantalla1() {
  const navigation = useNavigation<any>();
  
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    const q = query(collection(db, "productos")); 
    
    const unsub = onSnapshot(q, (snap) => {
      const docs: Producto[] = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data() 
      } as Producto));
      
      setListaProductos(docs);
      setCargando(false);
    });
    
    return () => unsub();
  }, []);


  const productosFiltrados = useMemo(() => {
    return listaProductos.filter(p => 
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [listaProductos, busqueda]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E2C" />
      
   
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventario</Text>
        <Text style={styles.headerSubtitle}>Gestión de productos</Text>
      </View>


      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A87BC7" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Buscar producto..." 
          placeholderTextColor="#666"
          value={busqueda} 
          onChangeText={setBusqueda}
          clearButtonMode="while-editing"
        /> 
      </View>

      <FlatList
        data={productosFiltrados}
        renderItem={({ item }) => (
          <ProductoCard 
            item={item} 
      
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
         ListEmptyComponent={
                    <Text style={{textAlign:'center', color:'#fff', marginTop: 20}}>
                        Sin resultados
                    </Text>
                }
      />

      {/* Botón Flotante (FAB) o Botón Inferior para Navegación */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.mainButton} 
            onPress={() => navigation.navigate('Pantalla_2')}
          >
            <Text style={styles.mainButtonText}>Siguiente pantalla de la camara</Text>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>       
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );     
}

// 5. Estilos "Chidoris" (Dark Mode Moderno)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2C', 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3D3D5C',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: '100%',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
 
  card: {
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(168, 123, 199, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardStock: {
    color: '#ccc',
    fontSize: 13,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },

  footer: {
    padding: 20,
    backgroundColor: '#1E1E2C', 
    borderTopWidth: 1,
    borderTopColor: '#2D2D44',
  },
  mainButton: {
    backgroundColor: '#7c09c9ff', 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#A87BC7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
});