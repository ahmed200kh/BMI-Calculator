import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

/* -------------------- GenderSelection Component --------------------
   Bu bileşen, kullanıcıya "Male" ve "Female" seçeneklerini sunar.
------------------------------------------------------------------------ */
const GenderSelection = ({ gender, setGender }) => {
  return (
    <View style={styles.genderContainer}>
      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === 'male' && styles.genderButtonActive,
        ]}
        onPress={() => setGender('male')}
      >
        <Ionicons
          name="male"
          size={32}
          color={gender === 'male' ? '#fff' : '#333'}
        />
        <Text
          style={[
            styles.genderText,
            gender === 'male' && styles.genderTextActive,
          ]}
        >
          Male
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === 'female' && styles.genderButtonActive,
        ]}
        onPress={() => setGender('female')}
      >
        <Ionicons
          name="female"
          size={32}
          color={gender === 'female' ? '#fff' : '#333'}
        />
        <Text
          style={[
            styles.genderText,
            gender === 'female' && styles.genderTextActive,
          ]}
        >
          Female
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* ----------------------- AgeInput Component ----------------------------
   Bu bileşen, kullanıcının yaş bilgisini girmesi için bir metin girişi sağlar.
------------------------------------------------------------------------ */
const AgeInput = ({ age, setAge }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.textInput}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        placeholder="e.g. 25"
      />
    </View>
  );
};

/* ---------------------- LabeledSlider Component ------------------------
   Bu bileşen, etiketli bir slider sunar. Hem boy hem de kilo için kullanılabilir.
------------------------------------------------------------------------ */
const LabeledSlider = ({
  label,
  value,
  onValueChange,
  min,
  max,
  step,
  minTrackTintColor,
  thumbTintColor,
}) => {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.label}>
        {label}: {value}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={minTrackTintColor}
        maximumTrackTintColor="#ccc"
        thumbTintColor={thumbTintColor}
      />
    </View>
  );
};

/* ----------------------- ResultCard Component --------------------------
   Bu bileşen, hesaplanan BMI değerini ve durumunu gradyan arka planla gösterir.
------------------------------------------------------------------------ */
const ResultCard = ({ bmi, bmiStatus, getBmiColor }) => {
  return (
    <View style={styles.resultContainer}>
      <LinearGradient colors={getBmiColor()} style={styles.resultCard}>
        <Text style={styles.resultText}>BMI: {bmi}</Text>
        <Text style={styles.resultStatus}>{bmiStatus}</Text>
      </LinearGradient>
    </View>
  );
};

/* -------------------------- Main App Component -------------------------
   Uygulamanın ana bileşeni; diğer bileşenleri bir araya getirir.
------------------------------------------------------------------------ */
export default function App() {
  // State tanımlamaları
  const [gender, setGender] = useState('male'); // "male" veya "female"
  const [height, setHeight] = useState(170); // Boy (cm)
  const [weight, setWeight] = useState(65); // Kilo (kg)
  const [age, setAge] = useState(''); // Yaş (metin girişi); başlangıçta boş
  const [bmi, setBmi] = useState(null); // Hesaplanan BMI
  const [bmiStatus, setBmiStatus] = useState(''); // BMI durumu (Underweight, Normal, vs.)

  // BMI hesaplama fonksiyonu
  const calculateBMI = () => {
    // Eğer yaş boşsa, pop-up (alert) ile kullanıcıyı uyarır.
    if (age.trim() === "") {
      Alert.alert("Error", "Please enter your age!");
      return;
    }
    
    const h = parseFloat(height) / 100; // Boyu metreye çevirir
    const w = parseFloat(weight); // Kilo değerini alır
    const a = parseInt(age); // Yaşı tam sayı olarak alır

    if (!h || !w || !a) {
      Alert.alert("Error", "Please enter valid values!");
      return;
    }

    const result = w / (h * h); // BMI formülü: kilo / (boy^2)
    const rounded = result.toFixed(1); // Sonucu yuvarlar
    setBmi(rounded);

    if (result < 18.5) {
      setBmiStatus('Underweight');
    } else if (result < 25) {
      setBmiStatus('Normal');
    } else if (result < 30) {
      setBmiStatus('Overweight');
    } else {
      setBmiStatus('Obese');
    }
  };

  // BMI değerine göre gradyan renklerini döndürür
  const getBmiColor = () => {
    if (!bmi) return ['#ddd', '#ccc'];
    const val = parseFloat(bmi);
    if (val < 18.5) return ['#a8dadc', '#457b9d']; // Underweight: Açık mavi tonları
    if (val < 25) return ['#8bc34a', '#4caf50']; // Normal: Yeşil tonları
    if (val < 30) return ['#ffb74d', '#ff9800']; // Overweight: Turuncu tonları
    return ['#e57373', '#f44336']; // Obese: Kırmızı tonları
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#fff']} // Arka plan gradyanı: Açık mavi'den beyaza geçiş
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>BMI Calculator</Text>
        <GenderSelection gender={gender} setGender={setGender} />
        <AgeInput age={age} setAge={setAge} />
        <LabeledSlider
          label="Height (cm)"
          value={height}
          onValueChange={setHeight}
          min={100}
          max={220}
          step={1}
          minTrackTintColor="#26c6da"
          thumbTintColor="#00838f"
        />
        <LabeledSlider
          label="Weight (kg)"
          value={weight}
          onValueChange={setWeight}
          min={30}
          max={200}
          step={1}
          minTrackTintColor="#ffb74d"
          thumbTintColor="#bf360c"
        />
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={calculateBMI}
        >
          <Text style={styles.calculateText}>Calculate BMI</Text>
        </TouchableOpacity>

        {/* Eğer BMI hesaplandıysa sonucu gösterir */}
        {bmi && (
          <ResultCard bmi={bmi} bmiStatus={bmiStatus} getBmiColor={getBmiColor} />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

/* ----------------------------- Styles ---------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#00796b',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  genderButtonActive: {
    backgroundColor: '#00796b',
    borderColor: '#00796b',
  },
  genderText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  genderTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#444',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sliderContainer: {
    width: '100%',
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  calculateButton: {
    backgroundColor: '#00695c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  calculateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 30,
    width: '100%',
  },
  resultCard: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultStatus: {
    marginTop: 5,
    fontSize: 20,
    color: '#fff',
  },
});
