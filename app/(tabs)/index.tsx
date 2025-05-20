import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect } from 'react';
import NfcManager, { NfcTech, NfcTag } from 'react-native-nfc-manager';

export default function HomeScreen() {
  useEffect(() => {
    // Initialiser NFC
    NfcManager.start()
      .then(() => console.log('NFC Manager started'))
      .catch((error: unknown) => console.warn('NFC Error:', error));

    // Nettoyage (optionnel, seulement si nécessaire)
    return () => {
      // Vérifier si stop est disponible et nécessaire
      if (typeof NfcManager.stop === 'function') {
        NfcManager.stop().catch((error: unknown) =>
          console.warn('Erreur lors de l’arrêt du NFC:', error)
        );
      }
    };
  }, []);

  const readNfcTag = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag: NfcTag | null = await NfcManager.getTag();
      if (tag) {
        console.log('Tag found:', tag);
        alert('Tag NFC détecté !');
      } else {
        console.warn('Aucun tag trouvé');
        alert('Aucun tag NFC détecté');
      }
    } catch (ex: unknown) {
      console.warn('Erreur NFC:', ex);
      alert('Erreur lors de la lecture du tag NFC');
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (error: unknown) {
        console.warn('Erreur lors de l’annulation de la requête NFC:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue dans MonApp</Text>
      <Text>Scannez une puce NFC pour commencer</Text>
      <Button title="Lire une puce NFC" onPress={readNfcTag} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});