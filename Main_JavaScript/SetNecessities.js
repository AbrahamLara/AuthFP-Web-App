class SetNecessities {
    
    constructor() {}

    userIdIsEmpty() {
        return this.userId === null;
    }

    setBlueBubble(text) {
        return "<div class=\"Cell\"><div class=\"cell\" style=\"margin-left: auto\"><span id=\"Bubble\" style=\"background-color:rgb(0,137,250);float:right;\">" + text + "</span></div></div><div class=\"Cell\" style=\"height: 10px\"></div>";
    }

    setGreyBubble(text,profileImage) {
        return "<div class=\"Cell\"><div class=\"cell\" style=\"margin-left: 15px\"><span id=\"Bubble\" style=\"background-color:rgb(200,200,200);float: left;\">" + text + "</span></div><img id=\"Chat_Partner_Profile_Image\" src=\"" + profileImage + "\"></div>";
    }

    setUserInfo(id,profileImageURL,name,email,uid,database) {
        return "<div class=\"User_Row\" onclick=\"Retrieve_User_Info('"+ profileImageURL +"','" + id + "','" + uid + "')\"><img id=\"profilePictureURL\" src=\" " + profileImageURL + "\" draggable=\"false\"><div class=\"User_Info\"><label id=\"Set_Name\"> " + name + " </label><label id=\"Set_Email\"> " + email + " </label></div></div>";
    }
}