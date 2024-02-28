import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import base64 from 'react-native-base64';

const Stack = createNativeStackNavigator();
const host = 'https://nscc-0304263-wordpress-photos.azurewebsites.net';
const username = 'W0472826';
const password = 'hKFW fJir Cq0m xDRV 5yrY nd6H'; //api token

function HomeScreen ({navigation}){

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Upload feadtured image to WordPress
  const uploadPhoto = async () => {
    const endPoint = host + '/wp-json/wp/v2/media';
    const fileName = image.split('/').pop();
    const formData = new FormData();
 
    formData.append('file', {
      uri: image,
      name: fileName
    });
 
    const result = await fetch(endPoint, {
      method: 'POST',
      headers: {        
        'Content-disposition': 'formdata; filename=' + fileName,
        'Authorization': 'Basic ' + base64.encode(username + ':' + password)
      },
      body: formData
    });
 
    const response = await result.json();
    const mediaId = response.id;
   
    return mediaId;
  }

  // Crate Post in WordPress
  const submitPost = async () => {
    // Validate inputs
    if(!title || !image){
      alert('Please complete all input fields.');
    }
    else {
      const mediaId = await uploadPhoto();
      console.log('Media ID: ' + mediaId);
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
      
      <TextInput 
          style={ styles.input } 
          placeholder="Content"
          onChangeText={ text => setContent(text) } 
          defaultValue= {content}/>

      <Button title="Choose an Image" onPress={pickImage}></Button>
      
      {image && <ImagePicker source={{uri:image}} sytle={{width:250, height:250, resizeMode:'cover'}}/>}

      <Button title="Submit" onPress={submitPost}/>

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
