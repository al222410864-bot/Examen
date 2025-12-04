import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from '../firebase-connection'; 

const { width } = Dimensions.get('window');

export default function Pantalla_2() {
  const navigation = useNavigation<any>();

  // Estados
  const [cargando, setCargando] = useState(false);
  const [mostrarCamara, setMostrarCamara] = useState(false); 
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null); 
  const [imagenDB, setImagenDB] = useState<string | null>(null); 


  const procesarImagen = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      setImagenPreview(manipResult.uri);
      if (manipResult.base64) {
        setImagenDB(`data:image/jpeg;base64,${manipResult.base64}`);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la imagen.");
    }
  };

  const abrirGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets[0].uri) {
      await procesarImagen(result.assets[0].uri);
    }
  };

  const activarCamara = async () => {
    if (!permission || !permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) return Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara para tomar la evidencia.");
    }
    setMostrarCamara(true);
  };

  const tomarFotoAhora = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.6, skipProcessing: true });
        if (photo?.uri) {
          await procesarImagen(photo.uri);
          setMostrarCamara(false);
        }
      } catch (error) { Alert.alert("Error", "Intenta de nuevo."); }
    }
  };

  const subirProductoTech = async () => {
    if (!imagenDB) return Alert.alert("Falta evidencia", "Por favor toma una foto o selecciona una de la galería.");
    
    setCargando(true);
    try {
      await addDoc(collection(db, "productos"), {
        imagen: imagenDB, 
        fecha: new Date().toISOString(),
      
      });
      
      Alert.alert(
        "¡Éxito!", 
        "La evidencia se ha guardado en la nube.", 
        [{ text: "Entendido", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };


  if (mostrarCamara) {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar hidden />
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          

          <TouchableOpacity style={styles.closeButton} onPress={() => setMostrarCamara(false)}>
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>


          <View style={styles.cameraControls}>
             {/* Voltear cámara */}
            <TouchableOpacity style={styles.controlIcon} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
               <Ionicons name="camera-reverse-outline" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={tomarFotoAhora}>
              <View style={styles.captureOuter}>
                 <View style={styles.captureInner} />
              </View>
            </TouchableOpacity>

  
            <View style={styles.controlIcon} /> 
          </View>
        </CameraView>
      </View>
    );
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E2C" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Nueva Evidencia</Text>
        <Text style={styles.subtitle}>Sube una foto para validar el inventario</Text>

        {/* Área de Previsualización */}
        <View style={styles.previewCard}>
          {imagenPreview ? (
            <>
              <Image source={{ uri: imagenPreview }} style={styles.imageFull} resizeMode="cover" />
              <TouchableOpacity 
                style={styles.trashBtn}
                onPress={() => { setImagenPreview(null); setImagenDB(null); }}
              >
                <Ionicons name="trash" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={80} color="#444" />
              <Text style={styles.placeholderText}>Sin imagen seleccionada</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          {!imagenPreview ? (
            <View style={styles.rowButtons}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnSecondary]} onPress={activarCamara}>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.btnText}>Cámara</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionBtn, styles.btnSecondary]} onPress={abrirGaleria}>
                <Ionicons name="images" size={24} color="#fff" />
                <Text style={styles.btnText}>Galería</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.btnPrimary]} 
              onPress={subirProductoTech}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={24} color="#fff" />
                  <Text style={styles.btnText}>Guardar Evidencia</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Botón Cancelar */}
          <TouchableOpacity 
            style={styles.cancelLink} 
            onPress={() => navigation.goBack()}
            disabled={cargando}
          >
            <Text style={styles.cancelText}>Cancelar y regresar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS "CHIDORIS" ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2C', 
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  previewCard: {
    width: width * 0.2,
    height: width * 0.2, 
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#3D3D5C',
    borderStyle: 'dashed', 
  },
  imageFull: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  trashBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 59, 48, 0.8)', 
    padding: 10,
    borderRadius: 25,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnPrimary: {
    backgroundColor: '#A87BC7', 
    width: '100%', 
  },
  btnSecondary: {
    backgroundColor: '#4E4E6A',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelLink: {
    marginTop: 20,
    padding: 10,
  },
  cancelText: {
    color: '#888',
    textDecorationLine: 'underline',
  },
  
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  captureOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  controlIcon: {
    width: 50,
    alignItems: 'center',
  },
});