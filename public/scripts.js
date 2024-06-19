console.log(faceapi)

const run = async()=>{
    //we need to load our models
    //loading the models is going to use await

    // Getting the web cam and the audio devices ready 
    const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio: false
    })

    const videoFeedEl = document.getElementById('video-feed')
    videoFeedEl.srcObject = stream


    // Fetching in the models
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models')
    ])

    // Setting up the canvas
    const canvas = document.getElementById('canvas')
    canvas.style.left = videoFeedEl.offsetLeft
    canvas.style.top = videoFeedEl.offsetTop
    canvas.style.left = videoFeedEl.offsetLeft
    canvas.height = videoFeedEl.height
    canvas.width = videoFeedEl.width



    // FacicAL detection with points 
    setInterval(async()=>{
        let FaceAIData = await faceapi.detectAllFaces(videoFeedEl)
    .withFaceLandmarks()
    .withFaceDescriptors()
    .withAgeAndGender()
    .withFaceExpressions(); // Add this option

        console.log(FaceAIData)

           // Drawing on the canvas

    // Clearing out the canvas
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)

    // Draw the box Dots
    FaceAIData = faceapi.resizeResults(FaceAIData,videoFeedEl)

    // Getting the boundary box in 
    faceapi.draw.drawDetections(canvas, FaceAIData)
    faceapi.draw.drawFaceLandmarks(canvas,FaceAIData)
    faceapi.draw.drawFaceExpressions(canvas,FaceAIData)


    // Adding in the gender and age 
    FaceAIData.forEach(face=> {
        const { age , gender , genderProbability} = face 

        const genderText = `${gender} - ${Math.round(genderProbability*100)/100*100}`
        
        const ageText = `${Math.round(age)} years`

        const textField = new faceapi.draw.DrawTextField([genderText,ageText],face.detection.box.topRight)

        textField.draw(canvas)  
        console.log("it hitted ")
    })



    },200)

 
}

run()