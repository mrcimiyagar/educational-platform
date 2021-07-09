module.exports = {
    adminPermissions: {
        canUploadFile: true,
        canRemoveFile: true,
        canAddSubRoom: true,
        canAddMessage: true,
        canRemoveMessage: true,
        canRemoveOwnMessage: true,
        canEditOwnMessage: true,
        canAddPoll: true,
        canRemovePoll: true,
        canInviteToRoom: true,
        canActInVideo: true,
        canPresent: true,
        canAssignPermission: true,
        canUseWhiteboard: true,
        canEditVideoSound: true
    },
    defaultPermissions: {
        canUploadFile: false,
        canRemoveFile: false,
        canAddSubRoom: false,
        canAddMessage: false,
        canRemoveMessage: false,
        canRemoveOwnMessage: false,
        canEditOwnMessage: false,
        canAddPoll: false,
        canRemovePoll: false,
        canInviteToRoom: false,
        canActInVideo: false,
        canPresent: false,
        canAssignPermission: false,
        canUseWhiteboard: false,
        canEditVideoSound: false
    },
    'solarizedTheme': JSON.stringify({
        primary: '#073642',
        primaryDark: '#002b36',
        primaryLight: '#586e75',
        textIcons: '#FFFFFF',
        accent: '#E040FB',
        primaryText: '#212121',
        secondaryText: '#757575',
        thirdText: '#eeeeee',
        divider: '#BDBDBD'
    }),
    'lightTheme': JSON.stringify({
        primary: '#eee',
        primaryDark: '#ddd',
        primaryLight: '#fff',
        textIcons: '#000',
        accent: '#E040FB',
        primaryText: '#222',
        secondaryText: '#444',
        thirdText: '#666',
        divider: '#888'
    }),
    'parentPath': '/root/marlik-community',
    'rootPath': '/root/marlik-community/main',
    'makeRandomCode' : function(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    makeVerifyCode : function() {
        let result = '';
        let characters = '0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    'toJson': function(obj) {
        const flatted = require('flatted');
        return flatted.stringify(obj);
    },
    'sleep': function(ms){
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        });
    },
    'sendMail': function (destination, subject, content, success, failure) {
        const nodemailer = require('nodemailer');
        const gmailUsername = 'keyhan.mohammadi1997@gmail.com';
        const gmailPassword = '6h%4j1k$s8kll#5l412dzs^e5km@tl6ol5,lu314j..';
        const smtpTransport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secureConnection: false,
            port: 587,
            pool: true,
            tls: {
                ciphers:'SSLv3'
            },
            requireTLS:true,
            auth: {
                user: gmailUsername,
                pass: gmailPassword
            }
        });
        let mailOptions={
            from: gmailUsername,
            to : destination,
            subject : subject,
            text : content
        };
        smtpTransport.sendMail(mailOptions, function(error, response){
            if (error) {
                console.log(error);
                failure();
            }
            else{
                console.log(response);
                success();
            }
        });
    }
};
