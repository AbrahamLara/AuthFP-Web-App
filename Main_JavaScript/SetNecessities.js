class SetNecessities {
    
    constructor() {}

    setBlueBubbleText(text) {
        return "<div class=\"Cell\"><div class=\"cell\" style=\"margin-left: auto\"><span id=\"Bubble\" style=\"background-color:rgb(0,137,250);float:right;color:white;\">" + text + "</span></div></div>";
    }

    setGreyBubbleText(text,profileImage) {
        return "<div class=\"Cell\"><div class=\"cell\" style=\"margin-left: 15px\"><span id=\"Bubble\" style=\"background-color:rgb(240,240,240);float: left;color:black;\">" + text + "</span></div><img id=\"Chat_Partner_Profile_Image\" src=\"" + profileImage + "\"draggable=\"false\"></div>";
    }

    setBlueBubbleImage(imageSrc) {
        return "<div class=\"Cell\"><div class=\"cell\" style=\"margin-left: auto\"><img id=\"Img_Bubble\" style=\"float:right\" src=\"" + imageSrc + "\" draggable=\"false\"></div></div>";
    }

    setGreyBubbleImage(imageSrc,profileImage) {
        return "<div class=\"Cell\"><div class=\"cell\" style=\"margin-left: 15px\"><img id=\"Img_Bubble\" style=\"float:left\" src=\"" + imageSrc + "\" draggable=\"false\"></div><img id=\"Chat_Partner_Profile_Image\" src=\"" + profileImage + "\"draggable=\"false\"></div>";
    }

    setBlueBubbleVideo(videoSrc) {
        return "<div class=\"Cell\"><div class=\"cell\" style=\"margin-left: auto\"><video id=\"Vid_Bubble\" width=\"300\"src=\"" + videoSrc + "\" controls></video></div></div>";
    }

    setGreyBubbleVideo(videoSrc,profileImage) {
        return "<div class=\"Cell\"><div class=\"cell\" style=\"margin-left: 15px\"><video id=\"Vid_Bubble\" width=\"300\"src=\"" + videoSrc + "\" controls></video></div><img id=\"Chat_Partner_Profile_Image\" src=\"" + profileImage + "\" draggable=\"false\"></div>";
    }

    setUserInfo(id,profileImageURL,name,email,uid,database) {
        return "<div class=\"User_Row\" onclick=\"Retrieve_User_Info('"+ profileImageURL +"','" + id + "','" + uid + "')\"><img id=\"profilePictureURL\" src=\" " + profileImageURL + "\" draggable=\"false\"><div class=\"User_Info\"><label id=\"Set_Name\"> " + name + " </label><label id=\"Set_Email\"> " + email + " </label></div></div>";
    }
}