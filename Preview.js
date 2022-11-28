import React, { useRef, useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Dimensions, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import WebView from 'react-native-webview'
import Modal from 'react-native-modal'
import { ColorPicker } from 'react-native-color-picker'
import RnSlider from '@react-native-community/slider'
import { actions } from '../VisualStoriesExpo/constants'
import * as ImagePicker from 'expo-image-picker'


export default function Preview(props) {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  const webRef = useRef(null)
  const [scroll, setScroll] = useState(true)
  const [cust, setCust] = useState(width)
  const [offset, setOffset] = useState(0)

  let navigation = props.navigation


  useEffect(() => {
    let data = JSON.parse(props.route.params.a)
    if (data[0] === undefined) {
      setTimeout(() => {
        Alert.alert(
          "",
          "Nothing to show",
          [
            { text: "OK", onPress: () => navigation.goBack() }
          ]
        );
      }, 500);
    }
    return
  }, [])

  // console.log(props.route.params.a) 

  const htmlDrawing =

    `      
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
    <body style="backgroundColor:black;" >
    <canvas id="canvas" width=${width * 5} height=${height - 100}></canvas>
      </body> 
     <script type="text/javascript" >

      var strokeColor;
      var canvas;
      var ctx;
      var styleId;
      var draw;
      let prevX;
      let prevY;
      var points = ${props.route.params.a} ;
      var local = 1;
      var arr = [];
       
     
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.globalAlpha = 1;
        var rafID;
        var i = 0;
        var j=0;
        ctx.globalAlpha = 1;

        let rct = canvas.getBoundingClientRect();

        canvas.width = rct.width * devicePixelRatio;
        canvas.height = rct.height * devicePixelRatio;

        ctx.scale(devicePixelRatio,devicePixelRatio);
        canvas.style.width = rct.width + "px"
        canvas.style.height = rct.height + "px"

        function animate(){
          if(i===points.length && j===points[i].length){
              console.log('cancelled')
              cancelAnimationFrame(rafID);
          }

          rafID = requestAnimationFrame(animate);
          // ctx.clearRect(0,0,canvas.width,canvas.height);
          if(points[i][j].id===${actions.penStroke}){
           penStroke();
          }
          if(points[i][j].id===${actions.pencilStroke}){
            pencilStroke();
          }
          if(points[i][j].id===${actions.markerStroke}){
            markerStroke();
          }
          if(points[i][j].id===${actions.slicedStroke}){
            slicedStroke();
          }
          if(points[i][j].id===${actions.multipleLines}){
            multiLine();
          }
          if(points[i][j].id===${actions.waterEffect}){
            waterStroke();
          }
          if(points[i][j].id===${actions.stars}){
            drawStar();
          }
          if(points[i][j].id===${actions.verticalLine}){
            drawVerticalLines();
          }
          if(points[i][j].id===${actions.sprayBrush}){
            sprayBrush();
          }
          if(points[i][j].id===${actions.rings}){
            ringBrush();
          }
      }
      // handleImage();
      animate();

      /// PEN STROKE ///

      function penStroke(){
          ctx.beginPath();
          ctx.strokeStyle=points[i][j].color;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.moveTo(points[i][j].x - getRandomInt(0, 2), points[i][j].y - getRandomInt(0, 2));
        ctx.lineTo(points[i][j+1].x - getRandomInt(0, 2), points[i][j+1].y - getRandomInt(0, 2));
        ctx.moveTo(points[i][j].x,points[i][j].y)
        ctx.lineTo(points[i][j+1].x,points[i][j+1].y)
        ctx.moveTo(points[i][j].x + getRandomInt(0, 2), points[i][j].y + getRandomInt(0, 2));
        ctx.lineTo(points[i][j+1].x + getRandomInt(0, 2), points[i][j+1].y + getRandomInt(0, 2));
        ctx.stroke();
        j=j+1
        if(j+1>=points[i].length){
            i=i+1;
            j=0;
            // ctx.moveTo(points[i][j].x,points[i][j].y)
        }  
      }

      /// PENCIL STROKE ///

      function pencilStroke()
      {
          ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.strokeStyle=points[i][j].color;
        ctx.moveTo(points[i][j].x, points[i][j].y);  
        ctx.lineTo(points[i][j+1].x, points[i][j+1].y);
        ctx.stroke();
        j=j+1;
        if(j+1>=points[i].length){
          i=i+1;
          j=0;
          // ctx.closePath();
          // ctx.moveTo(points[i][j].x,points[i][j].y)
      }
      }

      /// MARKER STROKE ///

      function markerStroke()
      {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 10;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.strokeStyle=points[i][j].color;
        ctx.moveTo(points[i][j].x, points[i][j].y);  
        ctx.lineTo(points[i][j+1].x, points[i][j+1].y);
        ctx.stroke();
        j=j+1;
        if(j+1>=points[i].length){
          i=i+1;
          j=0;
          // ctx.moveTo(points[i][j].x,points[i][j].y)
      }
      }

      /// SLICED STROKE ///

      function slicedStroke()
      {
        ctx.beginPath();
        ctx.strokeStyle=points[i][j].color;
        ctx.lineWidth = 2;
        ctx.moveTo(points[i][j].x - 4, points[i][j].y - 4);
        ctx.globalAlpha = 1;
        // ctx.stroke();
        ctx.lineTo(points[i][j+1].x - 4, points[i][j+1].y - 4);
        
        ctx.moveTo(points[i][j].x - 2, points[i][j].y - 2);
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.lineTo(points[i][j+1].x - 2, points[i][j+1].y - 2);
  
        ctx.moveTo(points[i][j].x, points[i][j].y);
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.lineTo(points[i][j+1].x, points[i][j+1].y);
  
        ctx.lineTo(points[i][j+1].x + 2, points[i][j+1].y + 2);
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.moveTo(points[i][j].x + 2, points[i][j].y + 2);
  
        ctx.moveTo(points[i][j].x + 4, points[i][j].y + 4);
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        // ctx.lineTo(points[i][j].x + 4, points[i][j].y + 4);
        
        j=j+1;
        if(j+1>=points[i].length){
          i=i+1;
          j=0;
          // ctx.moveTo(points[i][j].x,points[i][j].y)
      }
      }

      /// MULTI LINE ///

      function multiLine(){
        ctx.beginPath();
        var midPoint = midPointBtw(points[i][j],points[i][j+1]);
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.strokeStyle=points[i][j].color;
        
        ctx.moveTo(points[i][j].x - 5, points[i][j].y -5);
        ctx.lineTo(points[i][j+1].x - 5, points[i][j+1].y -5);
        ctx.stroke();

        ctx.moveTo(points[i][j].x - 2, points[i][j].y -2);
        ctx.lineTo(points[i][j+1].x - 2, points[i][j+1].y -2);
        ctx.stroke();

        ctx.moveTo(points[i][j].x, points[i][j].y);
        ctx.quadraticCurveTo(points[i][j].x, points[i][j].y, midPoint.x, midPoint.y);
        ctx.lineTo(points[i][j+1].x, points[i][j+1].y);
        ctx.stroke();

        ctx.moveTo(points[i][j].x + 2, points[i][j].y +2);
        ctx.lineTo(points[i][j+1].x + 2, points[i][j+1].y +2);
        ctx.stroke();

        ctx.moveTo(points[i][j].x + 5, points[i][j].y +5);
        ctx.lineTo(points[i][j+1].x + 5, points[i][j+1].y +5);
        ctx.stroke();
        j=j+1;
        if(j+1>=points[i].length){
          i=i+1;
          j=0;
      }
      }

      
      function midPointBtw(p1, p2) {
        return {
          x: p1.x + (p2.x - p1.x) / 2,
          y: p1.y + (p2.y - p1.y) / 2
        };
      }
      
      //// WATER STROKE ////

      function waterStroke(){
          ctx.strokeStyle=points[i][j].color;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.globalAlpha = Math.random();
          ctx.beginPath();
          ctx.arc(points[i][j].x, points[i][j].y, getRandomInt(5, 10),false, Math.PI * 2, false);
          ctx.fill();
          j=j+1;
          if(j>=points[i].length){
            i=i+1;
            j=0;
        }
      }

      //// STAR DESIGN ////

      function drawStar() {
        var length = 10;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle=points[i][j].color;
        ctx.save();
        ctx.translate(points[i][j].x, points[i][j].y);
        ctx.beginPath();
        ctx.rotate((Math.PI * 1 / 10));
        for (var k = 5; k--;) {
          ctx.lineTo(0, length);
          ctx.translate(0, length);
          ctx.rotate((Math.PI * 2 / 10));
          ctx.lineTo(0, -length);
          ctx.translate(0, -length);
          ctx.rotate(-(Math.PI * 6 / 10));
        }
        ctx.lineTo(0, length);
        ctx.stroke();
        ctx.restore();
        j=j+1;
          if(j>=points[i].length){
            i=i+1;
            j=0;
        }
      }

      //// VERTICAL LINES ////

      function drawVerticalLines() {
        var length = 10;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle=points[i][j].color;
        ctx.save();
        ctx.translate(points[i][j].x, points[i][j].y);
        ctx.beginPath();
        ctx.rotate((Math.PI * 1 / 10));
        for (var k = 5; k--;) {
          ctx.lineTo(0, length);
          ctx.lineTo(0, -length);
        }
        ctx.lineTo(0, length);
        ctx.stroke();
        ctx.restore();
        j=j+1;
          if(j>=points[i].length){
            i=i+1;
            j=0;
        }
      }

      /// SPRAY BRUSH ///

      function sprayBrush(){
        var density = 50;
        ctx.lineWidth = 10;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.fillStyle = points[i][j].color;
        ctx.globalAlpha = 1;
        // ctx.moveTo(points[i][j].x, points[i][j].y);
        for (var k = density; k--; ) {
          var radius = getRandomFloat(0, 20);
          var angle = getRandomFloat(0, Math.PI*2);
          ctx.fillRect(points[i][j].x + radius * Math.cos(angle), points[i][j].y + radius * Math.sin(angle), 1, 1);
        }
        j=j+1;
          if(j>=points[i].length){
            i=i+1;
            j=0;
        }
      }

      /// RINGS ///

      function ringBrush(){
        var density = 50;
        var radius = 20;
        ctx.lineWidth = 10;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.fillStyle = points[i][j].color;
        ctx.globalAlpha = 1;
        // ctx.moveTo(points[points.length-1].x, points[points.length-1].y);
        for (var k = density; k--; ) {
          var angle = getRandomFloat(0, Math.PI*2);
          ctx.fillRect(points[i][j].x + radius * Math.cos(angle), points[i][j].y + radius * Math.sin(angle), 1, 1);
        }
        j=j+1;
          if(j>=points[i].length){
            i=i+1;
            j=0;
        }
      }
  
      /// RANDOMIZE POINTS ///

      function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /// RANDOMIZE FLOAT POINTS ///

        function getRandomFloat(min, max) {
          return Math.random() * (max - min) + min;
        }

      /// HANDLE IMAGE ///  

        function handleImage(a){
          const img = new Image();
          img.src = "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png";
          img.onload=()=>{
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
          }
        }

      /// RECEIVE REACT NATIVE INTERACTION ///
      
      
      var message = function(event){
        var msgData = JSON.parse(event.data);
        // alert(msgData);
        if(msgData.action === '${actions.setColor}'){
          ctx.strokeStyle = msgData.data;
          return;
        }
        if(msgData === '${actions.clearData}'){
          ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
          return;
        }
        if(msgData.action === '${actions.setStrokeStyle}'){
          styleId = msgData.data;
          return;
        }
        if(msgData.action === '${actions.setImage}'){
          var a=JSON.stringify(msgData.data);
          handleImage(a);
          return;
        }
      }
      
      document.addEventListener("message", message , false);
      window.addEventListener("message", message , false);
      </script>`;

  const scrolling = (event) => {
    const x = event.nativeEvent.contentOffset.x

    if (x > 0 && cust < 10000) {
      setCust(cust - offset)
      setCust(cust + x)
      setCust(cust + 50)
      setOffset(x)
    }
  }

  return (
    <SafeAreaView style={{ height, width, backgroundColor: 'white' }} >
      <TouchableOpacity
        style={{
          marginHorizontal: '2%',
          paddingHorizontal: '1%'
        }}
        onPress={() => navigation.goBack()} >
        <Text>Go Back</Text>
      </TouchableOpacity>
      <ScrollView
        horizontal={true}
        style={{ flex: 1 }}
        onScroll={(e) => scrolling(e)}
        scrollEnabled={scroll}
        scrollEventThrottle={5}
      >
        <WebView
          bounces={false}
          scrollEnabled={false}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          ref={(ref) => webRef.current = ref}
          source={{ html: htmlDrawing }}
          onHttpError={(e) => {
            const { nativeEvent } = e;
            console.warn('error', nativeEvent)
          }}
          // onMessage={onMessage}
          containerStyle={{ backgroundColor: 'red' }}
          style={{ height, width: cust }}
          originWhitelist={['*']}
        />

      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bottomButton: {
    marginHorizontal: '2%',
    borderWidth: 1,
    borderColor: 'black'
  },
  strokeModal: {
    height: 300,
    width: 300,
    alignSelf: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: '1%'
  },
  colorModal: {
    height: 300,
    width: 300,
    alignSelf: 'center'
  },
  strokeModalText: {
    marginBottom: '2%'
  }
});
