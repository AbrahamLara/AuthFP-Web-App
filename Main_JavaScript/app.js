const Profile_Image     = document.getElementById('Profile_Image');
//Switch_Control Intializers
const Login_Control     = document.getElementById('Login_Control');
const Login_Label       = document.getElementById('Login_Label');
const Register_Control  = document.getElementById('Register_Control');
const Register_Label    = document.getElementById('Register_Label');
//Input_Container Initializers
const Input_Container   = document.getElementById('Input_Container');
const Name_Input        = document.getElementById('Name_Input');
const Name_Separator    = document.getElementById('Name_Separator');
const Email_Input       = document.getElementById('Email_Input');
const Password_Input    = document.getElementById('Password_Input');
//Login/Register Initializers
const Login_Button      = document.getElementById('Login_Button');
const Register_Button   = document.getElementById('Register_Button');
//Deals with Profile_Image info
var storage_ref         = 'AuthFP_App_Users_Profile_Images/';
var file_name           = "person-default";
var file                = Profile_Image.baseURI;

(function() {

    //Initialize Firebase
    var config              = {
        apiKey: "AIzaSyCylUT0zVmt8UocdVuHZ3RGmuj1fNyyFbw",
        authDomain: "playground-a45e6.firebaseapp.com",
        databaseURL: "https://playground-a45e6.firebaseio.com",
        projectId: "playground-a45e6",
        storageBucket: "playground-a45e6.appspot.com",
        messagingSenderId: "102092502135"
    };

    firebase.initializeApp(config);

    const auth      = firebase.auth();
    const database  = firebase.database().ref();
    const storage   = firebase.storage().ref();

    Profile_Image.src = "img/person-default.png";

    //Login and Register Controll Handlers
    Login_Control.addEventListener('click', Handle_Login_Control);
    Register_Control.addEventListener('click', Handle_Register_Control);
    
    //When Enter key is pressed it fires off enter button
    Password_Input.addEventListener('keyup',function(event) {
        event.preventDefault();
        
        if (event.keyCode === 13) {
            
            Login_Button.style.visibility === 'hidden' ? Register_Button.click() : Login_Button.click();
            
        }
    });

    //Login and Register Button Handlers
    Login_Button.addEventListener('click', e => {
        Handle_Login_Button(auth);
    });
    Register_Button.addEventListener('click', e => {
        Handle_Register_Button(auth,database,storage);
    });

}());

function readURL() {

    if(this.files && this.files[0]) {
        var obj     = new FileReader();
        obj.onload  = function(data) {
            Profile_Image.src = data.target.result;
        }

        obj.readAsDataURL(this.files[0]);
        file        = this.files[0];
        file_name   = this.files[0].name;
    }
}

function Handle_Login_Control() {

    Set_Message_Label('white',"Type Email and Password");

    Login_Button.style.display          = "block";
    Register_Button.style.display       = "none";

    Register_Label.style.color          = Login_Control.style.background      = "white";
    Register_Control.style.background   = "transparent";

    Login_Label.style.color             = "rgb(61,91,151)";

    Input_Container.style.height        = "83px";

    Name_Separator.style.display        = Name_Input.style.display = Register_Button.style.display;

    Password_Input.style.height         = Email_Input.style.height = "35px";
}

function Handle_Register_Control() {

    Set_Message_Label('white',"Fill in all fields");

    Login_Button.style.display          = Register_Button.style.display;

    Name_Separator.style.display        = Name_Input.style.display = Register_Button.style.display = "";

    Login_Control.style.background      = "transparent";
    Register_Control.style.background   = "white";

    Login_Label.style.color             = Register_Control.style.background;
    Register_Label.style.color          = "rgb(61,91,151)";

    Input_Container.style.height        = "125px";

    Password_Input.style.height         = Email_Input.style.height = Name_Input.style.height;

}

function Handle_Login_Button(auth) {


    firebase.auth().signInWithEmailAndPassword(Email_Input.value, Password_Input.value).then(function() {
        
        window.location = "MainPage.html";

    }).catch(function(error) {

        Set_Message_Label('rgb(255,58,0)','Failed to Login');

        console.log(error.code + ' : '+ error.message);

    });
}

function Handle_Register_Button(auth,database,storage) {

    auth.createUserWithEmailAndPassword(Email_Input.value, Password_Input.value).then(function() {

        //Stores Profile Image into Firebase Storage
        storage.child(storage_ref + file_name).put(file).on('state_changed', function progress(snapshot) {

            //Handle Upload Session
            console.log('Profile Image in process of uploading');

        }, function error(err) {

            //Handle Failed Upload
            console.log('Profile Image failed to upload to storage or none was chosen');

        }, function complete() {

            console.log('Profile Image successfully uploaded');

            //Retrieve Profile Image URL
            storage.child(storage_ref + file_name).getDownloadURL().then(function(url) {

                console.log('Successfully Registered User');

                Set_Message_Label('rgb(255,255,255)','Successfully Registered User');

                Register_User_In_Database(auth,database,url);

            }).catch(function(error) {

                //Handle any errors
                console.log(error);

            });
        });

    }).catch(function(error) {

        if (error.code === 'storage/invalid-argument') {
            console.log('Successfully Registered User');

            Set_Message_Label('rgb(255,255,255)','Successfully Registered User');


            Register_User_In_Database(auth,database,new SetNecessities().defaultProfilePic());

        } else {
            //Handle Errors

            Set_Message_Label('rgb(255,58,0)','Failed to Register');

            console.log(error.code + ' : '+ error.message);

        }

    });
}

function Set_Message_Label(color,textContent) {
    document.getElementById('Message_Label').style.color = color;
    document.getElementById('Message_Label').textContent = textContent;
}

function Register_User_In_Database(auth,database,url) {

    auth.onAuthStateChanged(firebaseUser => {

        database.child('AuthFP App Users').child(firebaseUser.uid).set({
            "email":Email_Input.value,
            "name": Name_Input.value,
            "profileImageURL": url
        });

    });

}
