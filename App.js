import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Pressable, Text, TextInput, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import base64 from 'react-native-base64';
import RNPickerSelect from 'react-native-picker-select';

const Stack = createNativeStackNavigator();
const host = 'https://nscc-0304263-wordpress-thewavenews.azurewebsites.net';
const username = 'W0472826';
const password = 'hKFW fJir Cq0m xDRV 5yrY nd6H'; //api token

function HomeScreen({navigation}){

  return(
  
    <View style={styles.container}>
      <Image
        source={require('./assets/logo.jpg')} 
        style={styles.logo}
      />
      <Pressable style={styles.button} onPress={()=> navigation.navigate('Create')}>
        <Text style={styles.buttonText}>Add New Post</Text>
      </Pressable>
    </View>
  );
}

function CreateScreen({navigation}){

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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
      // alert(uri);
      console.log('URI: ' + uri);
      setImage(uri);
    }
  }

  // Upload Featured Image to WordPress
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

  // Create post in WordPress
  const submitPost = async () =>{
    // Validate inputs
    if(!title || !image || !content || !selectedCategory){
      alert('Please complete all input fields.');

    } else {
      
      setIsLoading(true);

      // Create media Api
      const mediaId = await uploadPhoto();
      console.log('Media ID: ' + mediaId);

    // Get category ID from label
    let categoryId;
    switch (selectedCategory) {
      case '3':
        categoryId = '3';
        break;
      case '4':
        categoryId = '4';
        break;
      case '5':
        categoryId = '5';
        break;
      case '6':
        categoryId = '6';
        break;
      default:
        categoryId = '';
        break;
    }

      // Create Post Api
      const endPoint = host + '/wp-json/wp/v2/posts';
     
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', 'publish');
      formData.append('featured_media', mediaId);
      formData.append('categories', categoryId); 
 
      // Create the post
      const result = await fetch(endPoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + base64.encode(username + ':' + password)
        },
        body: formData
      });
 
      const response = await result.json();

      if(response.id){

        // Log the link to the newly created post
        navigation.navigate('Home');
      } 
      else {
        alert('Opps, something went wrong.');
      }

      setIsLoading(false);
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        
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

        <View style={styles.pickerContainer}>
        <RNPickerSelect
            onValueChange={(value) => setSelectedCategory(value)}
            items={[
                { label: 'Arts + Music', value: '3' },
                { label: 'Food + Drink', value: '4' },
                { label: 'Opinion', value: '5' },
                { label: 'Events', value: '6' },
            ]}
        />
        </View>
       
        <Pressable onPress={pickImage} style={ styles.button}>
          <Text style={ styles.buttonText}>Choose Image</Text>
        </Pressable>

        {image && <Image source={{uri: image}} style={{width:250, height:250, resizeMode:'cover'}}/>}
      
        <Pressable onPress={submitPost} style={ styles.button}>
          <Text style={ styles.buttonText}>Submit</Text>
        </Pressable>
        {isLoading && <ActivityIndicator/>}
        <StatusBar style="auto" />
    
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} options={{title: 'The Wave'}}/>
        <Stack.Screen name='Create' component={CreateScreen} options={{title: 'Add New Post'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10
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
    backgroundColor: 'skyblue',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
  logo: {
    width: 250, 
    height: 250, 
    resizeMode: 'contain', 
  },
  pickerContainer:{
    width: 300,
    marginTop: 10,
    marginBottom: 20,
  }
});
