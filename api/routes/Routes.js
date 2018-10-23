'use strict';
var jwt = require('jsonwebtoken');
var config = require('../../Config');
module.exports = function (app) {
    var Memberlist = require('../controllers/MembersController');
    var FamilyMemberlist = require('../controllers/FamilyMemberController');
    var committeeList = require('../controllers/committeeMemberController'), events = require("../controllers/EventManagementController"), login = require('../controllers/LoginController'), userModule = require('../controllers/UserModuleController'), advertisement = require('../controllers/AdvertisementController'), banner = require('../controllers/BannerManagementController'), clientSideController = require('../controllers/ClientSideController'), cors = require('cors');
    var email = require('../controllers/EmailController');
    app.use(cors());
    app.use(function (req, res, next) {
        if (req.url.startsWith('/login/') || req.url.startsWith('/authenticateFamilyMemberEmail/') || req.url.startsWith('/authenticateOTP/')
            || req.url.startsWith('/eventwithphotos') || req.url.startsWith('/getEventPhotos') || req.url.startsWith('/authenticateMemberEmail') ||
            req.url.startsWith('/allAdvertisements') || req.url.startsWith('/getAdvPhotos') || req.url.startsWith('/getAllMatrimonialMembers') ||
            req.url.startsWith('/allmembers') || req.url.startsWith('/getMemberPhoto') || req.url.startsWith('/membersbyId') || req.url.startsWith('/searchMember')
            || req.url.startsWith('/allFamilyMembers') || req.url.startsWith('/getFamilyMemberImage') || req.url.startsWith('/defaultImage')
            || req.url.startsWith('/matrimonialDefaultImage') || req.url.startsWith('/searchMatrimonial') || req.url.startsWith('/getAllCities') ||
            req.url.startsWith('/getAllCitizenhips') || req.url.startsWith('/getAllNativePlaces') || req.url.startsWith('/getAllEducations') ||
            req.url.startsWith('/getAllHeights') || req.url.startsWith('/committeeMember') || req.url.startsWith('/searchCommitteeMember') || req.url.startsWith('/getLogo')
            || req.url.startsWith('/getGirlImage') || req.url.startsWith('/defaultEventImage') || req.url.startsWith('/adminLogo') || req.url.startsWith('/validateMember')
            || req.url.startsWith('/getfamilymembers') || req.url.startsWith('/familyMemberById') || req.url.startsWith('/bannerWithPhotos') || req.url.startsWith('/bannerphoto')
            || req.url.startsWith('/totalMemberImage') || req.url.startsWith('/totalFamilyMemberImage') || req.url.startsWith('/totalCommiteeMemberImage') || req.url.startsWith('/totalEventImage')) {
            next();
        }
        else {
            var token = req.headers['x-access-token'] || req.query.token;
            if (token) {
                jwt.verify(token, config.secret, function (err, decoded) {
                    if (err) {
                        return res.status(401).send('Invalid token');
                    }
                    req.decoded = decoded;
                    next();
                });
            }
            else {
                return res.status(404).send('Token missing');
            }
        }
    });
    //Committee routes
    app.route('/committee')
        .get(committeeList.getAllCommitteeMembers)
        .post(committeeList.CreateCommitteeMember);
    app.route('/committee/:CommitteeMemberId')
        .get(committeeList.getCommitteeMemberbyId)
        .put(committeeList.updateCommitteeMember)
        .delete(committeeList.deleteCommitteeMember);
    app.route('/image.png')
        .get(committeeList.getImage);
    app.route('/committeeMemberSearch/:fieldName/:searchValue')
        .get(committeeList.searchCommitteeMember);
    app.route('/Designation')
        .get(committeeList.getAllDesignation);
    //Family Member Registration Routes
    app.route('/familymembers')
        .get(FamilyMemberlist.getAllFamilyMembers)
        .post(FamilyMemberlist.createFamilyMember);
    app.route('/familymembers/:MemberId')
        .get(FamilyMemberlist.getFamilyMemberbyMemberId)
        .put(FamilyMemberlist.updateFamilyMember);
    app.route('/getImage/:memberId/:fMemberId/:fileName')
        .get(FamilyMemberlist.getImage);
    app.route('/getStaticImage')
        .get(FamilyMemberlist.getStaticImage);
    app.route('/cities')
        .get(FamilyMemberlist.getAllCities);
    app.route('/natives')
        .get(FamilyMemberlist.getAllNatives);
    app.route('/education')
        .get(FamilyMemberlist.getAllEducation);
    app.route('/citizenship')
        .get(FamilyMemberlist.getAllCitizenships);
    app.route('/heights')
        .get(FamilyMemberlist.getAllHeights);
    //Member Registration Routes
    app.route('/members')
        .post(Memberlist.createMember)
        .get(Memberlist.getAllMembers);
    app.route('/members/:fieldname/:searchvalue')
        .get(Memberlist.searchUser);
    app.route('/getPhoto/:MemberId/:fileName')
        .get(Memberlist.sendMemberPhoto);
    app.route('/members/:MemberId')
        .get(Memberlist.getMemberbyId)
        .put(Memberlist.updateMember);
    //login routes
    app.route('/login/:emailId&:password')
        .get(login.userLogin);
    app.route('/users')
        .get(login.getAllUsers)
        .post(login.CreateUser);
    app.route('/users/:userFieldname/:userSearchvalue')
        .get(login.searchUser);
    app.route('/users/:UserId')
        .get(login.getUserbyId)
        .put(login.updateUser);
    app.route('/users/:email')
        .get(login.existUserEmail);
    app.route('/usersPassword/:UserId')
        .put(login.updateUserPassword);
    app.route('/systemusers')
        .get(login.getAllSystemUsers);
    app.route('/systemuser/:UserId')
        .get(login.getSystemUserById);
    app.route('/adminLogo')
        .get(login.getAdminLogo);
    //dashboard photos
    app.route('/totalCommiteeMemberImage')
        .get(login.getTotalCommiteeMemberImage);
    app.route('/totalMemberImage')
        .get(login.getTotalMemberImage);
    app.route('/totalFamilyMemberImage')
        .get(login.getTotalFamilyMemberImage);
    app.route('/totalEventImage')
        .get(login.getTotalEventImage);
    //EventManagement Routes
    app.route('/events')
        .get(events.getAllEvents)
        .post(events.createEvent);
    app.route('/events/:EventId')
        .put(events.updateEvent)
        .get(events.getEventById);
    app.route('/events/:eventFieldname/:eventSearchvalue')
        .get(events.searchEvent);
    app.route('/eventPhotos/:EventId')
        .post(events.uploadEventPhotos)
        .get(events.getEventPhotosById);
    app.route('/eventphoto/:EventId/:PhotoId/:name')
        .delete(events.deletePhoto);
    app.route('/photos/:EventId/:photoId')
        .get(events.eventPhotos);
    app.route('/getEventPhotos/:EventId/:FileName')
        .get(events.getEventsPhotos);
    app.route('/upcomingevents')
        .get(events.EventModelWithPhotos);
    app.route('/securityModules')
        .get(userModule.joinUserModWithSecurityMod);
    app.route('/userModules')
        .post(userModule.createUserModule);
    app.route('/userModules/:userModuleId')
        .put(userModule.updateUserModule);
    app.route('/userModules/:SystemUserId')
        .get(userModule.getUserModulesById);
    // Advertisement Routes
    app.route('/advertisement')
        .post(advertisement.createAdvertisement)
        .get(advertisement.getAllAdvertisements);
    app.route('/advertisements/:advertisementFieldname/:advertisementSearchvalue')
        .get(advertisement.searchAdvertisement);
    app.route('/advertisement/:AdvertisementId')
        .get(advertisement.getAdvertisementById)
        .put(advertisement.updateAdvertisement);
    app.route('/advertisementphoto/:AdvertisementId/:fileName')
        .get(advertisement.sendAdvertisementPhoto);
    app.route('/getDefaultImage')
        .get(advertisement.getDefaultImage);
    app.route('/getAdvertisementTypes')
        .get(advertisement.getAllAdvertisementTypes);
    app.route('/getAdvertisementLocations')
        .get(advertisement.getAllAdvertisementLocations);
    app.route('/advertisementPhotosById/:AdvertisementId')
        .get(advertisement.getAdvertisementPhotosById);
    app.route('/advertisementphoto/:AdvertisementId/:PhotoId/:name')
        .delete(advertisement.deleteAdvertisementPhoto);
    //banner routes
    app.route('/banner')
        .post(banner.createBanner)
        .get(banner.getAllBanners);
    app.route('/banner/:BannerId')
        .get(banner.getBannerById)
        .put(banner.updateBanner)
        .delete(banner.deleteBanner);
    app.route('/bannerPhotosById/:BannerId')
        .get(banner.getBannerPhotosById);
    app.route('/bannerphoto/:BannerId/:PhotoId/:name')
        .delete(banner.deleteBannerPhoto);
    app.route('/bannerphoto/:BannerId/:fileName')
        .get(banner.sendBannerPhoto);
    app.route('/banner/:bannerFieldname/:bannerSearchvalue')
        .get(banner.searchBanner);
    //client side routes
    app.route('/eventwithphotos')
        .get(clientSideController.joinEventModelWithPhotos);
    app.route('/bannerWithPhotos')
        .get(clientSideController.joinBannersWithPhotos);
    app.route('/bannerphoto/:BannerId/:fileName')
        .get(clientSideController.getBannerPhoto);
    app.route('/getEventPhotos/:EventId/:FileName')
        .get(clientSideController.getEventPhotos);
    app.route('/allAdvertisements')
        .get(clientSideController.getAllAdvertisements);
    app.route('/getAdvPhotos/:AdvertisementId/:FileName')
        .get(clientSideController.getAdvertisementPhoto);
    app.route('/allFamilyMembers')
        .get(clientSideController.getAllFamilyMembers);
    app.route('/allmembers')
        .get(clientSideController.getAllMembers);
    app.route('/getFamilyMemberImage/:memberId/:fMemberId/:fileName')
        .get(clientSideController.getFamilyMemberImage);
    app.route('/defaultImage')
        .get(clientSideController.getStaticImage);
    app.route('/getAllMatrimonialMembers')
        .get(clientSideController.getAllMatrimonialMembers);
    app.route('/validateMember/:email/:otp')
        .get(clientSideController.checkMember);
    //OTP Authentication routes
    app.route('/authenticateFamilyMemberEmail/:EmailAddress')
        .get(email.sendEmail);
    app.route('/authenticateOTP/:EmailAddress/:OTP')
        .get(email.validateEmail);
    app.route('/getMemberPhoto/:MemberId/:fileName')
        .get(clientSideController.sendMemberPhoto);
    app.route('/membersbyId/:MemberId')
        .get(clientSideController.getMemberbyId)
        .put(clientSideController.updateMemberProfile);
    app.route('/familyMemberById/:familyMemberId')
        .get(clientSideController.getFamilyMemberbyId)
        .put(clientSideController.updateFamilyMemberProfile);
    app.route('/searchMember/:fieldname/:searchvalue')
        .get(clientSideController.searchMember);
    app.route('/getfamilymembers/:MemberId')
        .get(clientSideController.getFamilyMemberbyMemberId);
    app.route('/committeeMember')
        .get(clientSideController.getAllCommitteeMembers);
    app.route('/searchCommitteeMember/:fieldName/:searchValue')
        .get(clientSideController.searchCommitteeMember);
    app.route('/authenticateOTP/:EmailAddress/:OTP')
        .get(email.validateEmail);
    app.route('/authenticateMemberEmail/:EmailAddress')
        .get(email.sendEmailToMember);
    app.route('/getAllCities')
        .get(clientSideController.getAllCities);
    app.route('/getAllCitizenhips')
        .get(clientSideController.getAllCitizens);
    app.route('/getAllNativePlaces')
        .get(clientSideController.getAllNativePlaces);
    app.route('/getAllEducations')
        .get(clientSideController.getAllEducations);
    app.route('/getAllHeights')
        .get(clientSideController.getAllHeights);
    app.route('/matrimonialDefaultImage')
        .get(clientSideController.matrimonialDefaultImage);
    app.route('/searchMatrimonial/:fromAge/:toAge/:manglik/:martial/:gender/:education/:city/:citizenShip/:native/:height/:handicap')
        .get(clientSideController.getMatrimonialResult);
    app.route('/getGirlImage')
        .get(clientSideController.getMatrimonialGirltImage);
    app.route('/defaultEventImage')
        .get(clientSideController.getEventImage);
};
//# sourceMappingURL=Routes.js.map