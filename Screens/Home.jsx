import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  Pressable,
  Clipboard,
  
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import {calculatePasswordStrength, generatePassword} from './utils';
import { Picker } from '@react-native-picker/picker';
const passwordCategories = ['Banking', 'Social', 'Work', 'Personal', 'Other'];

const AddPasswordModal = ({ visible, onClose, onAdd }) => {
  const [key, setKey] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('Other');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("Weak");

  const handleSubmit = () => {
    if (!key.trim() || !password.trim()) {
      Alert.alert('Error', 'Key and password are required');
      return;
    }
    onAdd(key, password, category);
    setKey('');
    setPassword('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Key (e.g., Gmail, Netflix)"
              placeholderTextColor="#666"
              value={key}
              onChangeText={setKey}
            />

            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={(text)=>{setPassword(text),setPasswordStrength(calculatePasswordStrength(text))}}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', width:'100%'}}>

            
              {password && <Text style={{color: 'white', textAlign:'left',marginBottom:20}}>{passwordStrength}</Text>}
            

            <TouchableOpacity style={{flex:1}} onPress={()=>setPassword(generatePassword(),setPasswordStrength(calculatePasswordStrength(password)))}>
              <Text style={{color: 'white', textAlign:'right',marginBottom:20,color:'lightblue'}}>Generate Password</Text>
            </TouchableOpacity>


            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.pickerInput}
                dropdownIconColor="#666"
              >
                {passwordCategories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>


            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.addButton]} 
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Home Screen Component
const HomeScreen = () => {
  const [passwords, setPasswords] = useState([]);
  const [resultPassword,setresultPassword] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    loadPasswords();
    
  }, []);

  const loadPasswords = async () => {
    try {
      const storedPasswords = await AsyncStorage.getItem('passwords');
      if (storedPasswords) {
        setPasswords(JSON.parse(storedPasswords));
        console.log(JSON.parse(storedPasswords));

        setresultPassword(JSON.parse(storedPasswords));
        
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load passwords');
    }
  };

  const savePassword = async (key, password,category) => {
    try {
      const newPassword = {
        id: Date.now().toString(),
        key,
        password,
        category,
        timestamp: new Date().toISOString()
      };
      
      const updatedPasswords = [...passwords, newPassword];
      await AsyncStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      setPasswords(updatedPasswords);
      setresultPassword(updatedPasswords);
    } catch (error) {
      Alert.alert('Error', 'Failed to save password');
    }
  };

  const deletePassword = async (id) => {
    Alert.alert(
      'Delete Password',
      'Are you sure you want to delete this password?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
              await AsyncStorage.setItem('passwords', JSON.stringify(updatedPasswords));
              setPasswords(updatedPasswords);
              setresultPassword(updatedPasswords);
              setSelectedPassword(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete password');
            }
          }
        }
      ]
    );
  };

  const copyToClipboard = async (password) => {
    try {
      await Clipboard.setString(password);
      Alert.alert('Success', 'Password copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy password');
    }
  };

 function filteredPasswords(searchQuery){

  if(searchQuery == " "){
    setresultPassword(passwords);
    return
  }

  setresultPassword(passwords.filter(pwd=>
    pwd.key.toLowerCase().includes(searchQuery.toLowerCase())

  ))

  
 }
     

  const renderPasswordItem = ({ item }) => (
    <Pressable
      style={[
        styles.passwordItem,
        selectedPassword?.id === item.id && styles.selectedItem
      ]}
      onPress={() => handlePasswordPress(item)}
    >
      <View style={styles.passwordItemContent}>
        <View style={styles.passwordItemHeader}>
          <Text style={styles.passwordKey}>{item.key}</Text>


          


          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={() => deletePassword(item.id)}
          >
            <Feather name="trash-2" size={20} color="#FF3B30" style={{}} />
          </TouchableOpacity>



          
          
        </View>

        <Text style={[styles.passwordKey,{fontSize:12,color:'grey',position:'absolute',bottom:0,right:0}]}>{item.category}</Text>

        
        {selectedPassword?.id === item.id && (
          <View style={styles.passwordActions}>
            <Text style={styles.passwordText}>{item.password}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(item.password)}
            >
              <Feather name="copy" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );

  const handlePasswordPress = (item) => {
    setSelectedPassword(selectedPassword?.id === item.id ? null : item);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Password Manager</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => setShowSearchBar(!showSearchBar)}
        >
          <Feather name={showSearchBar ? 'x' : 'search'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showSearchBar && (
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search passwords..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={(text)=>{setSearchQuery(text), filteredPasswords(text)}}
            autoFocus
          />
        </View>
      )}
      
      <FlatList
        data={resultPassword}
        renderItem={renderPasswordItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'No matching passwords found' : 'No passwords stored yet'}
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      <AddPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={savePassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    backgroundColor: '#121212',
    paddingTop: 50,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    margin: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    padding: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  passwordItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#2C2C2C',
  },
  passwordItemContent: {
    gap: 8,
  },
  passwordItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordKey: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  passwordActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C2C',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  passwordText: {
    fontSize: 16,
    color: '#B3B3B3',
    flex: 1,
  },
  copyButton: {
    padding: 4,
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    paddingRight: 50,
    marginBottom: 0,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#383838',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },

  categoryInput: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
  },
  pickerInput: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;