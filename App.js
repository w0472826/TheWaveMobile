import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen ({navigation}){

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Function to choose photo on phone
  const pickImage = async() => {
    //Pick photo on phone using expo-image-picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    });
    
    if(!result.canceled){
      const uri = result.assets[0].uri;
     
      setImage(uri);
    }
  }
  return (
    <View style={styles.container}>
      <Text>The Wave</Text>
      <TextInput 
          style={ styles.input } 
          placeholder="Title"
          onChangeText={ text => setTitle(text) } 
          defaultValue= {title}/>
      
      <Button title="Choose an Image" onPress={pickImage}></Button>
      {image && <Image source={{uri:image}} sytle={{width:250, height:250, resizeMode:'cover'}}/>}
      
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {

  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={ HomeScreen } options={{ title: 'The Wave' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    width: 300,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'slateblue',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  }

});
